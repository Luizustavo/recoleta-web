import { 
  CreateUserRequest, 
  UpdateUserRequest, 
  GetUsersRequest,
  User, 
  ApiUserResponse,
  IUserService
} from "@/types/user-api";

/**
 * Serviço de usuários conforme documentação da API
 */
export class UserService implements IUserService {
  private readonly baseURL = '/api';

  /**
   * Headers para requisições autenticadas
   */
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }

  /**
   * Criar novo usuário (sem autenticação)
   */
  async create(userData: CreateUserRequest): Promise<User> {
    const response = await fetch(`${this.baseURL}/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    const result: ApiUserResponse<User> = await response.json();
    if (!result.success) {
      throw new Error(result.message);
    }
    
    return result.data!;
  }

  /**
   * Listar usuários com paginação (requer autenticação)
   */
  async getAll(options: GetUsersRequest = {}): Promise<User[]> {
    const { skip, take } = options;
    const queryParams = new URLSearchParams();
    
    if (skip !== undefined) queryParams.append('skip', skip.toString());
    if (take !== undefined) queryParams.append('take', take.toString());
    
    const url = `${this.baseURL}/user${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    
    const result: ApiUserResponse<User[]> = await response.json();
    if (!result.success) {
      throw new Error(result.message);
    }
    
    return result.data!;
  }

  /**
   * Buscar usuário por ID (requer autenticação)
   */
  async getById(id: string): Promise<User> {
    const response = await fetch(`${this.baseURL}/user/${id}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    
    const result: ApiUserResponse<User> = await response.json();
    if (!result.success) {
      throw new Error(result.message);
    }
    
    return result.data!;
  }

  /**
   * Atualizar usuário (requer autenticação)
   */
  async update(id: string, updateData: UpdateUserRequest): Promise<User> {
    const response = await fetch(`${this.baseURL}/user/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updateData)
    });
    
    const result: ApiUserResponse<User> = await response.json();
    if (!result.success) {
      throw new Error(result.message);
    }
    
    return result.data!;
  }

  /**
   * Deletar usuário (requer autenticação)
   */
  async delete(id: string): Promise<boolean> {
    const response = await fetch(`${this.baseURL}/user/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    
    const result: ApiUserResponse<null> = await response.json();
    if (!result.success) {
      throw new Error(result.message);
    }
    
    return true;
  }

  /**
   * Buscar usuários com filtros locais (exemplo)
   */
  async search(options: GetUsersRequest & { search?: string } = {}): Promise<User[]> {
    const { search, ...paginationOptions } = options;
    
    const allUsers = await this.getAll(paginationOptions);
    
    if (search) {
      return allUsers.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return allUsers;
  }
}

// Instância singleton para uso global
export const userService = new UserService();

/**
 * Funções utilitárias para uso direto
 */

/**
 * Criar novo usuário
 */
export async function createUser(userData: CreateUserRequest): Promise<User> {
  return userService.create(userData);
}

/**
 * Listar usuários com paginação
 */
export async function getUsers(options?: GetUsersRequest): Promise<User[]> {
  return userService.getAll(options);
}

/**
 * Buscar usuário por ID
 */
export async function getUserById(id: string): Promise<User> {
  return userService.getById(id);
}

/**
 * Atualizar usuário
 */
export async function updateUser(id: string, updateData: UpdateUserRequest): Promise<User> {
  return userService.update(id, updateData);
}

/**
 * Deletar usuário
 */
export async function deleteUser(id: string): Promise<boolean> {
  return userService.delete(id);
}

/**
 * Hook React personalizado (para ser usado em componentes)
 */
export interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  loadUsers: (options?: GetUsersRequest) => Promise<void>;
  createUser: (userData: CreateUserRequest) => Promise<User>;
  updateUser: (id: string, updateData: UpdateUserRequest) => Promise<User>;
  deleteUser: (id: string) => Promise<boolean>;
  searchUsers: (search: string, options?: GetUsersRequest) => Promise<void>;
}

// Nota: O hook real seria implementado em um arquivo separado usando useState, useCallback, etc.
// Esta é apenas a interface para referência
