import { 
  RegisterRequest, 
  LoginRequest, 
  User, 
  LoginResponse, 
  ApiAuthResponse,
  ValidateTokenResponse,
  IAuthService
} from "@/types/auth-api";

/**
 * Serviço de autenticação conforme documentação da API
 */
export class AuthService implements IAuthService {
  private readonly baseURL = '/api';
  private readonly tokenKey = 'access_token';
  private readonly userKey = 'user';

  /**
   * Registrar novo usuário
   */
  async register(userData: RegisterRequest): Promise<User> {
    const response = await fetch(`${this.baseURL}/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    const result: ApiAuthResponse<User> = await response.json();
    if (!result.success) {
      throw new Error(result.message);
    }
    
    return result.data!;
  }

  /**
   * Fazer login do usuário
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${this.baseURL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    const result: ApiAuthResponse<LoginResponse> = await response.json();
    if (!result.success) {
      throw new Error(result.message);
    }
    
    // Salvar token e dados do usuário
    this.setToken(result.data!.access_token);
    this.setUser(result.data!.user);
    
    return result.data!;
  }

  /**
   * Fazer logout
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    
    // Chamar endpoint de logout se disponível
    fetch(`${this.baseURL}/auth`, {
      method: 'DELETE'
    }).catch(() => {
      // Ignorar erros de logout
    });
  }

  /**
   * Verificar se está logado
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Obter token
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Salvar token
   */
  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Obter dados do usuário
   */
  getUser(): LoginResponse['user'] | null {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Salvar dados do usuário
   */
  private setUser(user: LoginResponse['user']): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  /**
   * Validar token atual usando POST /api/auth/validate-token
   */
  async validateTokenByBody(token?: string): Promise<boolean> {
    const tokenToValidate = token || this.getToken();
    if (!tokenToValidate) return false;

    try {
      const response = await fetch(`${this.baseURL}/auth/validate-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenToValidate })
      });
      
      const result: ApiAuthResponse<ValidateTokenResponse> = await response.json();
      
      if (!result.data?.valid) {
        this.logout();
      }
      
      return result.data?.valid ?? false;
    } catch {
      this.logout();
      return false;
    }
  }

  /**
   * Validar token atual usando GET /api/auth/validate (header)
   */
  async validateCurrentToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await fetch(`${this.baseURL}/auth/validate`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const result: ApiAuthResponse<ValidateTokenResponse> = await response.json();
      
      if (!result.data?.valid) {
        this.logout();
      }
      
      return result.data?.valid ?? false;
    } catch {
      this.logout();
      return false;
    }
  }

  /**
   * Headers para requisições autenticadas
   */
  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }

  /**
   * Fazer requisição autenticada
   */
  async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const headers = {
      ...this.getAuthHeaders(),
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    // Se receber 401, token pode estar expirado
    if (response.status === 401) {
      this.logout();
      throw new Error('Token expirado. Faça login novamente.');
    }

    return response;
  }
}

// Instância singleton para uso global
export const authService = new AuthService();

/**
 * Funções utilitárias para uso direto
 */

/**
 * Registrar novo usuário
 */
export async function registerUser(userData: RegisterRequest): Promise<User> {
  return authService.register(userData);
}

/**
 * Fazer login
 */
export async function loginUser(credentials: LoginRequest): Promise<LoginResponse> {
  return authService.login(credentials);
}

/**
 * Validar token via POST (body)
 */
export async function validateToken(token: string): Promise<boolean> {
  return authService.validateTokenByBody(token);
}

/**
 * Validar token via GET (header)
 */
export async function validateTokenFromHeader(): Promise<boolean> {
  return authService.validateCurrentToken();
}

/**
 * Fazer logout
 */
export function logout(): void {
  authService.logout();
}
