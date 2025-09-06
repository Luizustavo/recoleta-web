// Tipos baseados na documentação da API de Auth

// Interfaces de Request
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ValidateTokenRequest {
  token: string;
}

// Interfaces de Response
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface TokenPayload {
  id: string;
  email: string;
  name: string;
  iat: number;  // issued at
  exp: number;  // expires at
}

export interface ValidateTokenResponse {
  valid: boolean;
  payload?: TokenPayload;
}

export interface ApiAuthResponse<T = unknown> {
  success: boolean;
  message: string;
  code: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Códigos de erro conforme documentação
export enum AuthErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',        // Credenciais inválidas ou token inválido
  CONFLICT = 'CONFLICT',           // Email já existe
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

export interface AuthError {
  success: false;
  message: string;
  code: AuthErrorCode;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Service Class Interface
export interface IAuthService {
  register(userData: RegisterRequest): Promise<User>;
  login(credentials: LoginRequest): Promise<LoginResponse>;
  logout(): void;
  isAuthenticated(): boolean;
  getToken(): string | null;
  getUser(): LoginResponse['user'] | null;
  validateCurrentToken(): Promise<boolean>;
  getAuthHeaders(): Record<string, string>;
  authenticatedFetch(url: string, options?: RequestInit): Promise<Response>;
}
