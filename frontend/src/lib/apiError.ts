import axios from 'axios';

export interface AppApiError {
  status?: number;
  code: string;
  message: string;
  details?: Array<{
    field?: string;
    section?: string;
    message: string;
  }>;
}

export function normalizeApiError(error: unknown): AppApiError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as Record<string, unknown> | undefined;

    if (data && typeof data === 'object') {
      const code = typeof data.code === 'string' ? data.code : 'UNEXPECTED_ERROR';
      let message = typeof data.message === 'string' ? data.message : error.message;

      // Sanitize generic routing/endpoint 404 messages for user-friendly display
      if (status === 404 && (message.includes('Route ') || message.toLowerCase().includes('not found') || code === 'NOT_FOUND')) {
        message = 'The requested content could not be loaded. Please try again later.';
      }

      const details = Array.isArray(data.details) ? (data.details as Array<{
        field?: string;
        section?: string;
        message: string;
      }>) : undefined;

      return {
        status,
        code,
        message,
        details,
      };
    }

    if (error.code === 'ERR_NETWORK') {
      return {
        code: 'NETWORK_ERROR',
        message: 'Network error. Please check your connection and try again.',
      };
    }

    if (error.code === 'ECONNABORTED') {
      return {
        code: 'ECONNABORTED',
        message: 'The request took too long. Please check your connection and try again.',
      };
    }

    return {
      status,
      code: 'UNEXPECTED_ERROR',
      message: error.message || 'An unexpected error occurred.',
    };
  }

  if (error instanceof Error) {
    return {
      code: 'UNEXPECTED_ERROR',
      message: error.message,
    };
  }

  if (error && typeof error === 'object') {
    const data = error as Record<string, unknown>;
    if (typeof data.code === 'string' || typeof data.message === 'string') {
      const details = Array.isArray(data.details) ? (data.details as Array<{
        field?: string;
        section?: string;
        message: string;
      }>) : undefined;

      return {
        code: typeof data.code === 'string' ? data.code : 'UNEXPECTED_ERROR',
        message: typeof data.message === 'string' ? data.message : 'An unexpected error occurred.',
        details,
      };
    }
  }

  return {
    code: 'UNEXPECTED_ERROR',
    message: 'An unknown error occurred.',
  };
}
