// User type definition
export interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  [key: string]: unknown;
}

// App state type
export interface AppState {
  isMobileMenuOpen: boolean;
  [key: string]: unknown;
}

// Session data type
export interface SessionData {
  user?: User;
  expires?: string;
}

// Auth response type
export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
  redirectTo?: string;
}
