# 🔐 Auth API Routes Documentation

Documentação completa das rotas de autenticação da API Recoleta para integração com o frontend.

## Base URL
```
http://localhost:3004/api
```

---

## 📋 Lista de Rotas

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| `POST` | `/user` | ❌ Não requerida | Registrar novo usuário |
| `POST` | `/auth/signin` | ❌ Não requerida | Login do usuário |
| `POST` | `/auth/validate-token` | ❌ Não requerida | Validar token JWT (via body) |
| `GET` | `/auth/validate` | ✅ Obrigatória | Validar token JWT (via header) |

---

## 🔗 Detalhamento das Rotas

### 1. Registrar Usuário
**`POST /api/user`** 🌐

#### Request Body
```javascript
{
  "name": "João Silva",                    // string (obrigatório)
  "email": "joao@email.com",              // string - email válido (obrigatório)
  "password": "senha123"                   // string - mínimo 6 caracteres (obrigatório)
}
```

#### Response Success (201)
```javascript
{
  "success": true,
  "message": "Usuário criado com sucesso",
  "code": "SUCCESS",
  "data": {
    "id": "66d8f4a2c8f1234567890xyz",
    "name": "João Silva",
    "email": "joao@email.com",
    "createdAt": "2025-09-06T12:00:00.000Z",
    "updatedAt": "2025-09-06T12:00:00.000Z"
  }
}
```

#### Response Error (400) - Dados Inválidos
```javascript
{
  "success": false,
  "message": "Dados de entrada inválidos",
  "code": "VALIDATION_ERROR",
  "errors": [
    {
      "field": "email",
      "message": "Email inválido"
    },
    {
      "field": "password",
      "message": "A senha deve ter pelo menos 6 caracteres"
    }
  ]
}
```

#### Response Error (400) - Email já existe
```javascript
{
  "success": false,
  "message": "Email já está em uso",
  "code": "CONFLICT",
  "data": null
}
```

---

### 2. Login do Usuário
**`POST /api/auth/signin`** 🌐

#### Request Body
```javascript
{
  "email": "joao@email.com",              // string - email válido (obrigatório)
  "password": "senha123"                   // string (obrigatório)
}
```

#### Response Success (200)
```javascript
{
  "success": true,
  "message": "Login successful",
  "code": "SUCCESS",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZDhmNGEyYzhmMTIzNDU2Nzg5MHh5eiIsImVtYWlsIjoiam9hb0BlbWFpbC5jb20iLCJuYW1lIjoiSm9cdTAwZTNvIFNpbHZhIiwiaWF0IjoxNzI1NjMyNDAwLCJleHAiOjE3MjU3MTg4MDB9.signature",
    "user": {
      "id": "66d8f4a2c8f1234567890xyz",
      "email": "joao@email.com",
      "name": "João Silva"
    }
  }
}
```

#### Response Error (401) - Credenciais Inválidas
```javascript
{
  "success": false,
  "message": "Credenciais inválidas",
  "code": "NOT_FOUND",
  "data": null
}
```

#### Response Error (400) - Dados Inválidos
```javascript
{
  "success": false,
  "message": "Dados de entrada inválidos",
  "code": "VALIDATION_ERROR",
  "errors": [
    {
      "field": "email",
      "message": "Email inválido"
    },
    {
      "field": "password",
      "message": "Senha é obrigatória"
    }
  ]
}
```

---

### 3. Validar Token (POST)
**`POST /api/auth/validate-token`** 🌐

#### Request Body
```javascript
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."  // string JWT token (obrigatório)
}
```

#### Response Success (200) - Token Válido
```javascript
{
  "success": true,
  "message": "Token validated successfully",
  "code": "SUCCESS",
  "data": {
    "valid": true,
    "payload": {
      "id": "66d8f4a2c8f1234567890xyz",
      "email": "joao@email.com",
      "name": "João Silva",
      "iat": 1725632400,                    // timestamp de criação
      "exp": 1725718800                     // timestamp de expiração
    }
  }
}
```

#### Response Error (401) - Token Inválido
```javascript
{
  "success": false,
  "message": "Invalid token",
  "code": "NOT_FOUND",
  "data": {
    "valid": false
  }
}
```

#### Response Error (400) - Token não fornecido
```javascript
{
  "success": false,
  "message": "Token not provided",
  "code": "NOT_FOUND",
  "data": {
    "valid": false
  }
}
```

---

### 4. Validar Token (GET)
**`GET /api/auth/validate`** 🔒

#### Request Headers
```javascript
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Response Success (200) - Token Válido
```javascript
{
  "success": true,
  "message": "Token validated successfully",
  "code": "SUCCESS",
  "data": {
    "valid": true,
    "payload": {
      "id": "66d8f4a2c8f1234567890xyz",
      "email": "joao@email.com",
      "name": "João Silva",
      "iat": 1725632400,
      "exp": 1725718800
    }
  }
}
```

#### Response Error (401) - Token Inválido ou Ausente
```javascript
{
  "success": false,
  "message": "Invalid token",
  "code": "NOT_FOUND",
  "data": {
    "valid": false
  }
}
```

---

## 📱 Exemplos de Integração Frontend

### JavaScript/TypeScript

#### 1. Registrar Usuário
```javascript
const registerUser = async (userData) => {
  try {
    const response = await fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Usuário registrado:', result.data);
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    throw error;
  }
};

// Uso
const newUser = await registerUser({
  name: "João Silva",
  email: "joao@email.com",
  password: "senha123"
});
```

#### 2. Fazer Login
```javascript
const loginUser = async (credentials) => {
  try {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    const result = await response.json();
    
    if (result.success) {
      // Salvar token no localStorage/sessionStorage
      localStorage.setItem('access_token', result.data.access_token);
      localStorage.setItem('user', JSON.stringify(result.data.user));
      
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
};

// Uso
const loginData = await loginUser({
  email: "joao@email.com",
  password: "senha123"
});
```

#### 3. Validar Token (POST)
```javascript
const validateToken = async (token) => {
  try {
    const response = await fetch('/api/auth/validate-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    });

    const result = await response.json();
    
    return result.data.valid;
  } catch (error) {
    console.error('Erro ao validar token:', error);
    return false;
  }
};

// Uso
const token = localStorage.getItem('access_token');
const isValid = await validateToken(token);
```

#### 4. Validar Token (GET)
```javascript
const validateTokenFromHeader = async () => {
  try {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch('/api/auth/validate', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();
    
    return result.data.valid;
  } catch (error) {
    console.error('Erro ao validar token:', error);
    return false;
  }
};

// Uso
const isAuthenticated = await validateTokenFromHeader();
```

#### 5. Sistema Completo de Autenticação
```javascript
class AuthService {
  constructor() {
    this.baseURL = '/api';
    this.tokenKey = 'access_token';
    this.userKey = 'user';
  }

  // Registrar usuário
  async register(userData) {
    const response = await fetch(`${this.baseURL}/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    
    return result.data;
  }

  // Fazer login
  async login(credentials) {
    const response = await fetch(`${this.baseURL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    
    // Salvar token e dados do usuário
    this.setToken(result.data.access_token);
    this.setUser(result.data.user);
    
    return result.data;
  }

  // Fazer logout
  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  // Verificar se está logado
  isAuthenticated() {
    return !!this.getToken();
  }

  // Obter token
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  // Salvar token
  setToken(token) {
    localStorage.setItem(this.tokenKey, token);
  }

  // Obter dados do usuário
  getUser() {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  // Salvar dados do usuário
  setUser(user) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  // Validar token atual
  async validateCurrentToken() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await fetch(`${this.baseURL}/auth/validate`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const result = await response.json();
      
      if (!result.data.valid) {
        this.logout(); // Remove token inválido
      }
      
      return result.data.valid;
    } catch (error) {
      this.logout(); // Remove token em caso de erro
      return false;
    }
  }

  // Headers para requisições autenticadas
  getAuthHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }

  // Fazer requisição autenticada
  async authenticatedFetch(url, options = {}) {
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

// Uso do serviço
const auth = new AuthService();

// Registrar
await auth.register({
  name: "João Silva",
  email: "joao@email.com",
  password: "senha123"
});

// Login
await auth.login({
  email: "joao@email.com",
  password: "senha123"
});

// Verificar autenticação
if (auth.isAuthenticated()) {
  console.log('Usuário logado:', auth.getUser());
}

// Fazer requisição autenticada
const response = await auth.authenticatedFetch('/api/waste', {
  method: 'POST',
  body: JSON.stringify(wasteData)
});
```

---

## 🎯 Tipos TypeScript

```typescript
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

export interface ApiAuthResponse<T = any> {
  success: boolean;
  message: string;
  code: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Service Class
export class AuthService {
  private readonly baseURL = '/api';
  private readonly tokenKey = 'access_token';
  private readonly userKey = 'user';

  async register(userData: RegisterRequest): Promise<User> {
    const response = await fetch(`${this.baseURL}/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    const result: ApiAuthResponse<User> = await response.json();
    if (!result.success) throw new Error(result.message);
    
    return result.data!;
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${this.baseURL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    const result: ApiAuthResponse<LoginResponse> = await response.json();
    if (!result.success) throw new Error(result.message);
    
    this.setToken(result.data!.access_token);
    this.setUser(result.data!.user);
    
    return result.data!;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getUser(): LoginResponse['user'] | null {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  private setUser(user: LoginResponse['user']): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

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
    } catch (error) {
      this.logout();
      return false;
    }
  }

  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }

  async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const headers = {
      ...this.getAuthHeaders(),
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (response.status === 401) {
      this.logout();
      throw new Error('Token expirado. Faça login novamente.');
    }

    return response;
  }
}
```

---

## 🔧 Middleware de Autenticação

### React Hook Personalizado
```typescript
import { useState, useEffect, useCallback } from 'react';

interface AuthState {
  user: LoginResponse['user'] | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useAuth = () => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true
  });

  const authService = new AuthService();

  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        const isValid = await authService.validateCurrentToken();
        
        setAuth({
          user: authService.getUser(),
          token: authService.getToken(),
          isAuthenticated: isValid,
          isLoading: false
        });
      } else {
        setAuth({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    const result = await authService.login(credentials);
    
    setAuth({
      user: result.user,
      token: result.access_token,
      isAuthenticated: true,
      isLoading: false
    });

    return result;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    
    setAuth({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false
    });
  }, []);

  const register = useCallback(async (userData: RegisterRequest) => {
    return await authService.register(userData);
  }, []);

  return {
    ...auth,
    login,
    logout,
    register,
    authService
  };
};
```

---

## ⚠️ Códigos de Erro Comuns

| Código HTTP | Código API | Descrição |
|-------------|------------|-----------|
| `400` | `VALIDATION_ERROR` | Dados de entrada inválidos |
| `401` | `NOT_FOUND` | Credenciais inválidas ou token inválido |
| `409` | `CONFLICT` | Email já existe (registro) |
| `500` | `INTERNAL_ERROR` | Erro interno do servidor |

---

## 🛡️ Segurança e Boas Práticas

### 1. **Armazenamento de Token**
```javascript
// ✅ Recomendado para SPAs
localStorage.setItem('access_token', token);

// ✅ Alternativa mais segura (sessão)
sessionStorage.setItem('access_token', token);

// ❌ Evitar em produção (vulnerável a XSS)
document.cookie = `token=${token}`;
```

### 2. **Validação de Token**
```javascript
// Validar token antes de requisições críticas
const isValid = await auth.validateCurrentToken();
if (!isValid) {
  // Redirecionar para login
  window.location.href = '/login';
}
```

### 3. **Headers de Segurança**
```javascript
// Sempre incluir token em requisições autenticadas
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
```

### 4. **Tratamento de Expiração**
```javascript
// Interceptar respostas 401 e fazer logout automático
if (response.status === 401) {
  auth.logout();
  window.location.href = '/login';
}
```

---

## 📝 Notas Importantes

1. **Token JWT**: Expira em 24 horas (configurável)
2. **Payload**: Contém `id`, `email`, `name`, `iat`, `exp`
3. **Senha**: Hash com bcrypt (não retornada nas respostas)
4. **Email**: Deve ser único no sistema
5. **Validação**: Automática em rotas protegidas via middleware
6. **HTTPS**: Obrigatório em produção para segurança
7. **CORS**: Configurado para permitir requisições do frontend

---

**Última atualização:** 6 de Setembro de 2025
**Versão da API:** 1.0
