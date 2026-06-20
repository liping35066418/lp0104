/**
 * local server entry file, for local development
 */
import { WebSocketServer, type WebSocket } from 'ws';
import app from './app.js';
import type { CalculateRequest, CalculationResult } from '../shared/types.js';
import { generateAndCalculate } from './services/combinationGenerator.js';

/**
 * start server with port
 */
const PORT = process.env.PORT || 8874;

const server = app.listen(PORT, () => {
  console.log(`Server ready on port ${PORT}`);
});

/**
 * WebSocket server for real-time calculations
 */
const wss = new WebSocketServer({ server, path: '/ws/realtime' });

interface ExtendedWebSocket extends WebSocket {
  isAlive?: boolean;
}

wss.on('connection', (ws: ExtendedWebSocket) => {
  console.log('WebSocket client connected');
  ws.isAlive = true;

  ws.on('pong', () => {
    ws.isAlive = true;
  });

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString()) as {
        type: 'calculate';
        payload: CalculateRequest;
      };

      if (message.type === 'calculate') {
        const { products, minComboSize = 2, maxComboSize = 5 } = message.payload;

        if (!products || products.length < 2) {
          ws.send(JSON.stringify({
            type: 'error',
            payload: { message: '请至少输入2个商品才能计算组合' },
          }));
          return;
        }

        const result = generateAndCalculate(products, minComboSize, maxComboSize);
        const response: CalculationResult = {
          ...result,
          timestamp: Date.now(),
        };

        ws.send(JSON.stringify({
          type: 'result',
          payload: response,
        }));
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        payload: { message: '数据处理错误' },
      }));
    }
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

const heartbeat = setInterval(() => {
  wss.clients.forEach((ws) => {
    const client = ws as ExtendedWebSocket;
    if (client.isAlive === false) {
      client.terminate();
      return;
    }
    client.isAlive = false;
    client.ping();
  });
}, 30000);

wss.on('close', () => {
  clearInterval(heartbeat);
});

/**
 * close server
 */
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;