/**
 * @file controllers/authController.ts
 * @description Express route handlers for authentication endpoints.
 *
 * Controllers are intentionally thin — they handle HTTP concerns
 * (request parsing, response shaping, error forwarding) and delegate all
 * business logic to `authService`.
 *
 * ## Endpoints
 *  POST /api/auth/register  – Create account with phone + password
 *  POST /api/auth/login     – Authenticate with phone + password
 *  POST /api/auth/create-pin – Create or authenticated-update a PIN
 *  POST /api/auth/login-pin  – Authenticate with phone + PIN
 *  POST /api/auth/change-pin – Password-confirmed PIN replacement
 *  DELETE /api/auth/remove-pin – Password-confirmed PIN removal
 */

import { type Request, type Response, type NextFunction } from 'express';
import {
  validateRegisterInput,
  validateLoginInput,
  validateCreatePinInput,
  validateLoginPinInput,
  validateChangePinInput,
  validateRemovePinInput,
} from '../validators/authValidator.js';
import {
  registerUser,
  loginUser,
  createOrUpdatePin,
  loginWithPin,
  changePin as changeUserPin,
  removePin as removeUserPin,
} from '../services/authService.js';
import { createError } from '../middlewares/errorHandler.js';
import { PhoneValidationError } from '../utils/phoneNumber.js';

// ---------------------------------------------------------------------------
// POST /api/auth/register
// ---------------------------------------------------------------------------

/**
 * Creates a new user account.
 *
 * Request body: `{ phone, password, confirmPassword }`
 * Success: HTTP 201 with access token, refresh token, and sanitised user.
 */
export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as Record<string, unknown>;
    const validation = validateRegisterInput(body);

    if (!validation.valid || !validation.data) {
      next(
        createError(
          400,
          'VALIDATION_ERROR',
          validation.errors.map((e) => e.message).join(' ')
        )
      );
      return;
    }

    const result = await registerUser(
      validation.data.phone,
      validation.data.password
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
        nextStep: result.nextStep,
      },
    });
  } catch (err) {
    if (err instanceof PhoneValidationError) {
      next(createError(400, err.code, err.message));
      return;
    }
    next(err);
  }
}

// ---------------------------------------------------------------------------
// POST /api/auth/login
// ---------------------------------------------------------------------------

/**
 * Authenticates a user with phone + password.
 *
 * Request body: `{ phone, password }`
 * Success: HTTP 200 with access token, refresh token, and sanitised user.
 */
export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as Record<string, unknown>;
    const validation = validateLoginInput(body);

    if (!validation.valid || !validation.data) {
      next(
        createError(
          400,
          'VALIDATION_ERROR',
          validation.errors.map((e) => e.message).join(' ')
        )
      );
      return;
    }

    const result = await loginUser(
      validation.data.phone,
      validation.data.password
    );

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
        nextStep: result.nextStep,
      },
    });
  } catch (err) {
    if (err instanceof PhoneValidationError) {
      // Map phone validation errors on login to the generic message to prevent
      // leaking information about which phones are registered.
      next(createError(400, err.code, err.message));
      return;
    }
    next(err);
  }
}

function getAuthenticatedUserId(req: Request): string {
  if (!req.user) {
    throw createError(401, 'MISSING_TOKEN', 'Authentication required. Please log in.');
  }

  return req.user.id;
}

// ---------------------------------------------------------------------------
// POST /api/auth/create-pin
// ---------------------------------------------------------------------------

export async function createPin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as Record<string, unknown>;
    const validation = validateCreatePinInput(body);

    if (!validation.valid || !validation.data) {
      next(
        createError(
          400,
          'VALIDATION_ERROR',
          validation.errors.map((e) => e.message).join(' ')
        )
      );
      return;
    }

    const result = await createOrUpdatePin(
      getAuthenticatedUserId(req),
      validation.data.pin,
      validation.data.currentPassword
    );

    res.status(200).json({
      success: true,
      message: 'PIN created successfully.',
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

// ---------------------------------------------------------------------------
// POST /api/auth/login-pin
// ---------------------------------------------------------------------------

export async function loginPin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as Record<string, unknown>;
    const validation = validateLoginPinInput(body);

    if (!validation.valid || !validation.data) {
      next(
        createError(
          400,
          'VALIDATION_ERROR',
          validation.errors.map((e) => e.message).join(' ')
        )
      );
      return;
    }

    const result = await loginWithPin(validation.data.phone, validation.data.pin);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
        nextStep: result.nextStep,
      },
    });
  } catch (err) {
    if (err instanceof PhoneValidationError) {
      next(createError(400, err.code, err.message));
      return;
    }

    next(err);
  }
}

// ---------------------------------------------------------------------------
// POST /api/auth/change-pin
// ---------------------------------------------------------------------------

export async function changePin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as Record<string, unknown>;
    const validation = validateChangePinInput(body);

    if (!validation.valid || !validation.data) {
      next(
        createError(
          400,
          'VALIDATION_ERROR',
          validation.errors.map((e) => e.message).join(' ')
        )
      );
      return;
    }

    const result = await changeUserPin(
      getAuthenticatedUserId(req),
      validation.data.currentPassword,
      validation.data.newPin
    );

    res.status(200).json({
      success: true,
      message: 'PIN changed successfully.',
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/auth/remove-pin
// ---------------------------------------------------------------------------

export async function removePin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as Record<string, unknown>;
    const validation = validateRemovePinInput(body);

    if (!validation.valid || !validation.data) {
      next(
        createError(
          400,
          'VALIDATION_ERROR',
          validation.errors.map((e) => e.message).join(' ')
        )
      );
      return;
    }

    const result = await removeUserPin(
      getAuthenticatedUserId(req),
      validation.data.currentPassword
    );

    res.status(200).json({
      success: true,
      message: 'PIN removed successfully.',
      data: result,
    });
  } catch (err) {
    next(err);
  }
}
