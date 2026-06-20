import express, { type Request, type Response } from 'express';
import type { CalculateRequest } from '../../shared/types.js';
import { generateAndCalculate } from '../services/combinationGenerator.js';

const router = express.Router();

router.post('/', (req: Request, res: Response) => {
  try {
    const { products, minComboSize = 2, maxComboSize = 5 } = req.body as CalculateRequest;

    if (!products || !Array.isArray(products) || products.length === 0) {
      res.status(400).json({
        success: false,
        error: '请至少输入一个商品',
      });
      return;
    }

    for (const product of products) {
      if (!product.name || product.name.trim() === '') {
        res.status(400).json({
          success: false,
          error: '商品名称不能为空',
        });
        return;
      }
      if (typeof product.cost !== 'number' || product.cost < 0) {
        res.status(400).json({
          success: false,
          error: `商品 ${product.name} 的成本价必须为非负数`,
        });
        return;
      }
      if (typeof product.price !== 'number' || product.price <= 0) {
        res.status(400).json({
          success: false,
          error: `商品 ${product.name} 的售价必须大于0`,
        });
        return;
      }
      if (product.price <= product.cost) {
        res.status(400).json({
          success: false,
          error: `商品 ${product.name} 的售价必须大于成本价`,
        });
        return;
      }
    }

    const result = generateAndCalculate(products, minComboSize, maxComboSize);

    res.json({
      success: true,
      data: {
        ...result,
        timestamp: Date.now(),
      },
    });
  } catch (error) {
    console.error('Calculation error:', error);
    res.status(500).json({
      success: false,
      error: '计算过程中发生错误',
    });
  }
});

export default router;
