import express, { type Request, type Response } from 'express';
import type { CalculateRequest } from '../../shared/types.js';
import { generateAndCalculate, validateProducts } from '../services/combinationGenerator.js';

const router = express.Router();

router.post('/', (req: Request, res: Response) => {
  try {
    const { products, minComboSize = 2, maxComboSize = 5 } = req.body as CalculateRequest;

    const validationError = validateProducts(products);
    if (validationError) {
      res.status(400).json({
        success: false,
        error: validationError,
      });
      return;
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
