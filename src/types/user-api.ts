// Tipos baseados na documentação da API de User

// Interfaces de Request
export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
}

export interface GetUsersRequest {
  skip?: number;
  take?: number;
}

// Interface de Response
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

// Interface de resposta da API
export interface ApiUserResponse<T = unknown> {
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
export enum UserErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',           // Email já existe
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

export interface UserError {
  success: false;
  message: string;
  code: UserErrorCode;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Service Class Interface
export interface IUserService {
  create(userData: CreateUserRequest): Promise<User>;
  getAll(options?: GetUsersRequest): Promise<User[]>;
  getById(id: string): Promise<User>;
  update(id: string, updateData: UpdateUserRequest): Promise<User>;
  delete(id: string): Promise<boolean>;
}
