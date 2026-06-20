import { type Request, type Response, type NextFunction } from 'express';
import { createError } from '../middlewares/errorHandler.js';
import {
  createGrowthReadingForMother,
  getGrowthHistoryForMother,
  getLatestGrowthReadingForMother,
  getGrowthChartForMother,
} from '../services/growthService.js';
import {
  validateCreateGrowthReadingInput,
  validateGrowthHistoryLimit,
} from '../validators/growthValidator.js';

export async function postGrowthLog(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      next(createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.'));
      return;
    }

    const validation = validateCreateGrowthReadingInput(req.body);
    if (!validation.valid || !validation.data) {
      const firstField = validation.errors[0]?.field;
      const code = firstField === 'readingDate'
        ? 'INVALID_READING_DATE'
        : firstField === 'weightGrams'
          ? 'INVALID_WEIGHT_GRAMS'
          : firstField === 'lengthCm'
            ? 'INVALID_LENGTH_CM'
            : firstField === 'headCircumferenceCm'
              ? 'INVALID_HEAD_CIRCUMFERENCE_CM'
              : firstField === 'timePoint'
                ? 'INVALID_TIME_POINT'
                : 'INVALID_GROWTH_READING';

      next(createError(400, code, validation.errors.map((error) => error.message).join(' '), validation.errors));
      return;
    }

    const result = await createGrowthReadingForMother(req.user, validation.data);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getGrowthHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      next(createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.'));
      return;
    }

    const validation = validateGrowthHistoryLimit(req.query['limit']);
    if (!validation.valid || validation.data === undefined) {
      next(createError(400, 'INVALID_REQUEST', validation.errors.map((error) => error.message).join(' '), validation.errors));
      return;
    }

    const result = await getGrowthHistoryForMother(req.user, validation.data);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getGrowthLatest(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      next(createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.'));
      return;
    }

    const result = await getLatestGrowthReadingForMother(req.user);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getGrowthChart(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      next(createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.'));
      return;
    }

    const metric = req.query['metric'];
    if (metric !== 'weight' && metric !== 'length' && metric !== 'headCircumference') {
      next(createError(400, 'INVALID_REQUEST', "metric must be 'weight', 'length', or 'headCircumference'."));
      return;
    }

    const result = await getGrowthChartForMother(req.user, metric);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
