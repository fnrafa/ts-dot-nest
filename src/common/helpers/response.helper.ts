export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data?: T;
}

export const successResponse = <T>(
  message: string,
  data?: T,
): ApiResponse<T> => ({
  status: true,
  message,
  data,
});

export const createdResponse = <T>(
  message: string,
  data?: T,
): ApiResponse<T> => ({
  status: true,
  message,
  data,
});

export const badRequestResponse = (message: string): ApiResponse<null> => ({
  status: false,
  message,
});

export const unauthorizedResponse = (message: string): ApiResponse<null> => ({
  status: false,
  message,
});

export const forbiddenResponse = (message: string): ApiResponse<null> => ({
  status: false,
  message,
});

export const notFoundResponse = (message: string): ApiResponse<null> => ({
  status: false,
  message,
});

export const conflictResponse = (message: string): ApiResponse<null> => ({
  status: false,
  message,
});

export const internalErrorResponse = (message: string): ApiResponse<null> => ({
  status: false,
  message,
});
