import { useCallback, useEffect, useRef } from 'react';
import type { CalculationResult, Product } from '../../shared/types';
import { useProductStore } from '../store/productStore';

function validateProducts(products: Product[]): string | null {
  for (const product of products) {
    if (!product.name || product.name.trim() === '') {
      return '商品名称不能为空';
    }
    if (typeof product.cost !== 'number' || product.cost < 0) {
      return `商品 ${product.name} 的成本价必须为非负数`;
    }
    if (typeof product.price !== 'number' || product.price <= 0) {
      return `商品 ${product.name} 的售价必须大于0`;
    }
    if (product.price <= product.cost) {
      return `商品 ${product.name} 的售价必须大于成本价`;
    }
  }
  return null;
}

export function useCalculation() {
  const {
    products,
    minComboSize,
    maxComboSize,
    setResult,
    setCalculating,
    setError,
  } = useProductStore();

  const wsRef = useRef<WebSocket | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const messageQueueRef = useRef<Array<() => void>>([]);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = import.meta.env.DEV ? 'localhost:8874' : window.location.host;
    const wsUrl = `${protocol}//${host}/ws/realtime`;

    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      console.log('WebSocket connected');
      while (messageQueueRef.current.length > 0) {
        const message = messageQueueRef.current.shift();
        message?.();
      }
    };

    wsRef.current.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        if (response.type === 'result') {
          setResult(response.payload as CalculationResult);
          setCalculating(false);
          setError(null);
        } else if (response.type === 'error') {
          setError(response.payload.message);
          setCalculating(false);
        }
      } catch (e) {
        console.error('Parse error:', e);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('连接服务器失败，请稍后重试');
      setCalculating(false);
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket disconnected, reconnecting...');
      setTimeout(connectWebSocket, 3000);
    };
  }, [setResult, setCalculating, setError]);

  const sendCalculation = useCallback(
    (productList: Product[], min: number, max: number) => {
      const send = () => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          setCalculating(true);
          wsRef.current.send(
            JSON.stringify({
              type: 'calculate',
              payload: {
                products: productList,
                minComboSize: min,
                maxComboSize: max,
              },
            })
          );
        } else {
          messageQueueRef.current.push(() => send());
          connectWebSocket();
        }
      };
      send();
    },
    [connectWebSocket, setCalculating]
  );

  const calculate = useCallback(() => {
    if (products.length < minComboSize) {
      setError(`请至少输入 ${minComboSize} 个商品才能计算组合`);
      return;
    }
    const validationError = validateProducts(products);
    if (validationError) {
      setError(validationError);
      return;
    }
    sendCalculation(products, minComboSize, maxComboSize);
  }, [products, minComboSize, maxComboSize, sendCalculation, setError]);

  const realtimeCalculate = useCallback(() => {
    if (products.length < minComboSize) {
      return;
    }

    const validationError = validateProducts(products);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      sendCalculation(products, minComboSize, maxComboSize);
    }, 500);
  }, [products, minComboSize, maxComboSize, sendCalculation, setError]);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [connectWebSocket]);

  return { calculate, realtimeCalculate };
}
