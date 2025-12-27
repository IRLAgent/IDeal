/**
 * Authentication utility functions for managing JWT tokens
 * Handles token storage, retrieval, and validation
 */

const TOKEN_KEY = 'ideal_auth_token';
const USER_KEY = 'ideal_user';

export interface User {
  id: string;
  email: string;
  name: string;
  userType: 'buyer' | 'seller';
}

export interface AuthResponse {
  token: string;
  user: User;
}

/**
 * Store JWT token and user info in localStorage
 */
export function setAuthToken(token: string, user: User): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Retrieve JWT token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Retrieve user info from localStorage
 */
export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userJson = localStorage.getItem(USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

/**
 * Clear authentication (logout)
 */
export function clearAuth(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Get auth headers for API requests
 */
export function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}
