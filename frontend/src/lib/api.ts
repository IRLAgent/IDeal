/**
 * API client for communicating with the backend
 * Handles request formatting and error handling
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ApiError {
  status: number;
  message: string;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    const error: ApiError = {
      status: response.status,
      message: data.error || data.message || 'An error occurred',
    };
    throw error;
  }

  return data;
}

export async function apiCall<T>(
  endpoint: string,
  options: RequestInit & { method: string } = { method: 'GET' }
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    return handleResponse<T>(response);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`API Error: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Make authenticated API calls with JWT token
 */
export async function apiCallAuth<T>(
  endpoint: string,
  options: RequestInit & { method: string } = { method: 'GET' },
  token: string
): Promise<T> {
  return apiCall<T>(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}
