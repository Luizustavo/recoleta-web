# 👤 User API Routes Documentation

Documentação completa das rotas de usuários da API Recoleta para integração com o frontend.

## Base URL
```
http://localhost:3004/api
```

---

## 📋 Lista de Rotas

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| `POST` | `/user` | ❌ Não requerida | Criar novo usuário |
| `GET` | `/user` | ✅ Obrigatória | Listar todos os usuários (com paginação) |
| `GET` | `/user/:id` | ✅ Obrigatória | Buscar usuário por ID |
| `PATCH` | `/user/:id` | ✅ Obrigatória | Atualizar usuário por ID |
| `DELETE` | `/user/:id` | ✅ Obrigatória | Deletar usuário por ID |

---

## 🔗 Detalhamento das Rotas

### 1. Criar Usuário
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

### 2. Listar Todos os Usuários
**`GET /api/user`** 🔒

#### Headers
```javascript
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Query Parameters (Opcionais)
```javascript
// Paginação
?skip=0&take=10                          // Pular 0, pegar 10 usuários
?skip=10&take=5                          // Pular 10, pegar 5 usuários
?take=20                                 // Pegar apenas 20 usuários
```

#### Response Success (200)
```javascript
{
  "success": true,
  "message": "Users fetched successfully",
  "code": "SUCCESS",
  "data": [
    {
      "id": "66d8f4a2c8f1234567890xyz",
      "name": "João Silva",
      "email": "joao@email.com"
    },
    {
      "id": "66d8f4a2c8f1234567890abc",
      "name": "Maria Oliveira",
      "email": "maria@email.com"
    },
    {
      "id": "66d8f4a2c8f1234567890def",
      "name": "Pedro Santos",
      "email": "pedro@email.com"
    }
  ]
}
```

#### Response Error (401) - Token Inválido
```javascript
{
  "success": false,
  "message": "Token inválido ou expirado",
  "code": "UNAUTHORIZED",
  "data": null
}
```

---

### 3. Buscar Usuário por ID
**`GET /api/user/:id`** 🔒

#### Headers
```javascript
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Path Parameters
```javascript
// :id = ObjectId do usuário
// Exemplo: /api/user/66d8f4a2c8f1234567890xyz
```

#### Response Success (200)
```javascript
{
  "success": true,
  "message": "User fetched successfully",
  "code": "SUCCESS",
  "data": {
    "id": "66d8f4a2c8f1234567890xyz",
    "name": "João Silva",
    "email": "joao@email.com"
  }
}
```

#### Response Error (404) - Usuário não encontrado
```javascript
{
  "success": false,
  "message": "User not found",
  "code": "NOT_FOUND",
  "data": null
}
```

#### Response Error (401) - Token Inválido
```javascript
{
  "success": false,
  "message": "Token inválido ou expirado",
  "code": "UNAUTHORIZED",
  "data": null
}
```

---

### 4. Atualizar Usuário
**`PATCH /api/user/:id`** 🔒

#### Headers
```javascript
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}
```

#### Path Parameters
```javascript
// :id = ObjectId do usuário
// Exemplo: /api/user/66d8f4a2c8f1234567890xyz
```

#### Request Body (Todos os campos são opcionais)
```javascript
{
  "name": "João Silva Santos",             // string (opcional)
  "email": "joao.santos@email.com"        // string - email válido (opcional)
}
```

#### Response Success (200)
```javascript
{
  "success": true,
  "message": "User updated successfully",
  "code": "SUCCESS",
  "data": {
    "id": "66d8f4a2c8f1234567890xyz",
    "name": "João Silva Santos",
    "email": "joao.santos@email.com"
  }
}
```

#### Response Error (404) - Usuário não encontrado
```javascript
{
  "success": false,
  "message": "User not found",
  "code": "NOT_FOUND",
  "data": null
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
    }
  ]
}
```

---

### 5. Deletar Usuário
**`DELETE /api/user/:id`** 🔒

#### Headers
```javascript
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Path Parameters
```javascript
// :id = ObjectId do usuário
// Exemplo: /api/user/66d8f4a2c8f1234567890xyz
```

#### Response Success (200)
```javascript
{
  "success": true,
  "message": "User deleted successfully",
  "code": "SUCCESS",
  "data": null
}
```

#### Response Error (404) - Usuário não encontrado
```javascript
{
  "success": false,
  "message": "User not found",
  "code": "NOT_FOUND",
  "data": null
}
```

#### Response Error (401) - Token Inválido
```javascript
{
  "success": false,
  "message": "Token inválido ou expirado",
  "code": "UNAUTHORIZED",
  "data": null
}
```

---

## 📱 Exemplos de Integração Frontend

### JavaScript/TypeScript

#### 1. Criar Usuário
```javascript
const createUser = async (userData) => {
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
      console.log('Usuário criado:', result.data);
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
};

// Uso
const newUser = await createUser({
  name: "João Silva",
  email: "joao@email.com",
  password: "senha123"
});
```

#### 2. Listar Usuários com Paginação
```javascript
const getUsers = async (options = {}) => {
  try {
    const { skip = 0, take = 10, token } = options;
    const queryParams = new URLSearchParams();
    
    if (skip !== undefined) queryParams.append('skip', skip.toString());
    if (take !== undefined) queryParams.append('take', take.toString());
    
    const url = `/api/user${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Usuários encontrados:', result.data);
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw error;
  }
};

// Uso
const token = localStorage.getItem('access_token');
const users = await getUsers({ skip: 0, take: 20, token });
```

#### 3. Buscar Usuário por ID
```javascript
const getUserById = async (userId, token) => {
  try {
    const response = await fetch(`/api/user/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Usuário encontrado:', result.data);
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    throw error;
  }
};

// Uso
const token = localStorage.getItem('access_token');
const user = await getUserById('66d8f4a2c8f1234567890xyz', token);
```

#### 4. Atualizar Usuário
```javascript
const updateUser = async (userId, updateData, token) => {
  try {
    const response = await fetch(`/api/user/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Usuário atualizado:', result.data);
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw error;
  }
};

// Uso
const token = localStorage.getItem('access_token');
const updatedUser = await updateUser('66d8f4a2c8f1234567890xyz', {
  name: "João Silva Santos",
  email: "joao.santos@email.com"
}, token);
```

#### 5. Deletar Usuário
```javascript
const deleteUser = async (userId, token) => {
  try {
    const response = await fetch(`/api/user/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Usuário deletado com sucesso');
      return true;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    throw error;
  }
};

// Uso
const token = localStorage.getItem('access_token');
await deleteUser('66d8f4a2c8f1234567890xyz', token);
```

#### 6. Classe de Serviço Completa
```javascript
class UserService {
  constructor(baseURL = '/api', authService = null) {
    this.baseURL = baseURL;
    this.authService = authService;
  }

  // Headers com autenticação
  getAuthHeaders() {
    const token = this.authService?.getToken() || localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }

  // Criar usuário (sem autenticação)
  async create(userData) {
    const response = await fetch(`${this.baseURL}/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    
    return result.data;
  }

  // Listar usuários com paginação
  async getAll(options = {}) {
    const { skip, take } = options;
    const queryParams = new URLSearchParams();
    
    if (skip !== undefined) queryParams.append('skip', skip.toString());
    if (take !== undefined) queryParams.append('take', take.toString());
    
    const url = `${this.baseURL}/user${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    
    return result.data;
  }

  // Buscar usuário por ID
  async getById(id) {
    const response = await fetch(`${this.baseURL}/user/${id}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    
    return result.data;
  }

  // Atualizar usuário
  async update(id, updateData) {
    const response = await fetch(`${this.baseURL}/user/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updateData)
    });
    
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    
    return result.data;
  }

  // Deletar usuário
  async delete(id) {
    const response = await fetch(`${this.baseURL}/user/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    
    return true;
  }

  // Buscar usuários com filtros e paginação avançada
  async search(options = {}) {
    const { 
      search, 
      skip = 0, 
      take = 10, 
      sortBy = 'name', 
      sortOrder = 'asc' 
    } = options;

    // Esta implementação é um exemplo de como poderia funcionar
    // A API atual não suporta filtros, mas mostra como seria
    const allUsers = await this.getAll({ skip, take });
    
    if (search) {
      return allUsers.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return allUsers;
  }
}

// Uso da classe
const userService = new UserService();

// Criar usuário
const newUser = await userService.create({
  name: "João Silva",
  email: "joao@email.com", 
  password: "senha123"
});

// Listar usuários
const users = await userService.getAll({ skip: 0, take: 10 });

// Buscar usuário específico
const user = await userService.getById('66d8f4a2c8f1234567890xyz');

// Atualizar usuário
const updated = await userService.update('66d8f4a2c8f1234567890xyz', {
  name: "João Silva Santos"
});

// Deletar usuário
await userService.delete('66d8f4a2c8f1234567890xyz');
```

---

## 🎯 Tipos TypeScript

```typescript
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
export interface ApiUserResponse<T = any> {
  success: boolean;
  message: string;
  code: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Service Class com TypeScript
export class UserService {
  private readonly baseURL: string;
  private authService: any;

  constructor(baseURL = '/api', authService?: any) {
    this.baseURL = baseURL;
    this.authService = authService;
  }

  private getAuthHeaders(): Record<string, string> {
    const token = this.authService?.getToken() || localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }

  async create(userData: CreateUserRequest): Promise<User> {
    const response = await fetch(`${this.baseURL}/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    const result: ApiUserResponse<User> = await response.json();
    if (!result.success) throw new Error(result.message);
    
    return result.data!;
  }

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
    if (!result.success) throw new Error(result.message);
    
    return result.data!;
  }

  async getById(id: string): Promise<User> {
    const response = await fetch(`${this.baseURL}/user/${id}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    
    const result: ApiUserResponse<User> = await response.json();
    if (!result.success) throw new Error(result.message);
    
    return result.data!;
  }

  async update(id: string, updateData: UpdateUserRequest): Promise<User> {
    const response = await fetch(`${this.baseURL}/user/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updateData)
    });
    
    const result: ApiUserResponse<User> = await response.json();
    if (!result.success) throw new Error(result.message);
    
    return result.data!;
  }

  async delete(id: string): Promise<boolean> {
    const response = await fetch(`${this.baseURL}/user/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    
    const result: ApiUserResponse<null> = await response.json();
    if (!result.success) throw new Error(result.message);
    
    return true;
  }
}

// Hook React personalizado
export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userService = new UserService();

  const loadUsers = useCallback(async (options: GetUsersRequest = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await userService.getAll(options);
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (userData: CreateUserRequest) => {
    setError(null);
    
    try {
      const newUser = await userService.create(userData);
      setUsers(prev => [...prev, newUser]);
      return newUser;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao criar usuário';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, []);

  const updateUser = useCallback(async (id: string, updateData: UpdateUserRequest) => {
    setError(null);
    
    try {
      const updated = await userService.update(id, updateData);
      setUsers(prev => prev.map(user => user.id === id ? updated : user));
      return updated;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao atualizar usuário';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    setError(null);
    
    try {
      await userService.delete(id);
      setUsers(prev => prev.filter(user => user.id !== id));
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao deletar usuário';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, []);

  return {
    users,
    loading,
    error,
    loadUsers,
    createUser,
    updateUser,
    deleteUser
  };
};
```

---

## 🔧 Exemplos de Componentes React

### Listagem de Usuários
```typescript
import React, { useEffect, useState } from 'react';

const UserList: React.FC = () => {
  const { 
    users, 
    loading, 
    error, 
    loadUsers, 
    deleteUser 
  } = useUsers();

  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    loadUsers({ skip: currentPage * pageSize, take: pageSize });
  }, [currentPage, loadUsers]);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja deletar ${name}?`)) {
      try {
        await deleteUser(id);
        alert('Usuário deletado com sucesso!');
      } catch (error) {
        alert('Erro ao deletar usuário');
      }
    }
  };

  if (loading) return <div>Carregando usuários...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <h2>Lista de Usuários</h2>
      
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => handleDelete(user.id, user.name)}>
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button 
          disabled={currentPage === 0}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          Anterior
        </button>
        <span>Página {currentPage + 1}</span>
        <button 
          disabled={users.length < pageSize}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Próxima
        </button>
      </div>
    </div>
  );
};
```

### Formulário de Criação/Edição
```typescript
import React, { useState } from 'react';

interface UserFormProps {
  initialData?: Partial<User>;
  onSubmit: (data: CreateUserRequest | UpdateUserRequest) => Promise<void>;
  submitLabel: string;
}

const UserForm: React.FC<UserFormProps> = ({ 
  initialData = {}, 
  onSubmit, 
  submitLabel 
}) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await onSubmit(formData);
      if (!initialData.id) {
        // Reset form apenas para criação
        setFormData({ name: '', email: '', password: '' });
      }
      alert('Usuário salvo com sucesso!');
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ general: error.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Nome:</label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      {!initialData.id && (
        <div>
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            required
            minLength={6}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
      )}

      {errors.general && <div className="error">{errors.general}</div>}

      <button type="submit" disabled={loading}>
        {loading ? 'Salvando...' : submitLabel}
      </button>
    </form>
  );
};

// Componente para criar usuário
const CreateUser: React.FC = () => {
  const { createUser } = useUsers();

  return (
    <UserForm
      onSubmit={createUser}
      submitLabel="Criar Usuário"
    />
  );
};

// Componente para editar usuário
const EditUser: React.FC<{ user: User }> = ({ user }) => {
  const { updateUser } = useUsers();

  const handleUpdate = async (data: UpdateUserRequest) => {
    await updateUser(user.id, data);
  };

  return (
    <UserForm
      initialData={user}
      onSubmit={handleUpdate}
      submitLabel="Atualizar Usuário"
    />
  );
};
```

---

## ⚠️ Códigos de Erro Comuns

| Código HTTP | Código API | Descrição |
|-------------|------------|-----------|
| `400` | `VALIDATION_ERROR` | Dados de entrada inválidos |
| `401` | `UNAUTHORIZED` | Token inválido ou expirado |
| `404` | `NOT_FOUND` | Usuário não encontrado |
| `409` | `CONFLICT` | Email já está em uso |
| `500` | `INTERNAL_ERROR` | Erro interno do servidor |

---

## 🛡️ Segurança e Boas Práticas

### 1. **Autenticação**
```javascript
// Sempre incluir token em rotas protegidas
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
```

### 2. **Validação de Dados**
```javascript
// Validar dados antes do envio
const validateUserData = (userData) => {
  const errors = {};
  
  if (!userData.name?.trim()) {
    errors.name = 'Nome é obrigatório';
  }
  
  if (!userData.email?.includes('@')) {
    errors.email = 'Email inválido';
  }
  
  if (userData.password && userData.password.length < 6) {
    errors.password = 'Senha deve ter pelo menos 6 caracteres';
  }
  
  return errors;
};
```

### 3. **Paginação Eficiente**
```javascript
// Use paginação para listas grandes
const loadUsers = async (page = 0, size = 10) => {
  return await userService.getAll({ 
    skip: page * size, 
    take: size 
  });
};
```

### 4. **Tratamento de Erros**
```javascript
// Sempre tratar erros de forma adequada
try {
  const user = await userService.getById(id);
  return user;
} catch (error) {
  if (error.message.includes('not found')) {
    // Usuário não encontrado
    return null;
  } else if (error.message.includes('unauthorized')) {
    // Redirecionar para login
    window.location.href = '/login';
  } else {
    // Erro genérico
    console.error('Erro inesperado:', error);
  }
}
```

---

## 📝 Notas Importantes

1. **Paginação**: Use `skip` e `take` para controlar a quantidade de dados retornados
2. **Autenticação**: Todas as rotas exceto POST /user requerem token JWT válido
3. **Email Único**: O sistema não permite emails duplicados
4. **Senha**: Não é retornada em nenhuma resposta por segurança
5. **IDs**: Utilizam formato ObjectId do MongoDB (24 caracteres hexadecimais)
6. **Soft Delete**: Confirme se o sistema usa exclusão física ou lógica
7. **Rate Limiting**: Considere implementar limite de requisições em produção

---

**Última atualização:** 6 de Setembro de 2025
**Versão da API:** 1.0
