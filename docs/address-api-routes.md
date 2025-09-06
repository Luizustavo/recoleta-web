# 🏠 Address API Routes Documentation

Documentação completa das rotas de endereços da API Recoleta para integração com o frontend.

## Base URL
```
http://localhost:3004/api
```

---

## 📋 Lista de Rotas

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| `POST` | `/address` | ✅ Obrigatória | Criar novo endereço |
| `GET` | `/address` | ✅ Obrigatória | Listar endereços do usuário logado |
| `GET` | `/address/:id` | ✅ Obrigatória | Buscar endereço por ID |
| `PATCH` | `/address/:id` | ✅ Obrigatória | Atualizar endereço por ID |
| `DELETE` | `/address/:id` | ✅ Obrigatória | Deletar endereço por ID |

> **⚠️ Importante:** Todas as rotas requerem autenticação JWT. O usuário só pode acessar seus próprios endereços.

---

## 🔗 Detalhamento das Rotas

### 1. Criar Endereço
**`POST /api/address`** 🔒

#### Headers
```javascript
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}
```

#### Request Body
```javascript
{
  "street": "Rua das Flores",              // string (obrigatório)
  "number": "123",                         // string (obrigatório)
  "city": "São Paulo",                     // string (obrigatório)
  "state": "SP",                           // string (obrigatório)
  "country": "Brasil",                     // string (opcional, padrão: "Brasil")
  "zipCode": "01234-567",                  // string (obrigatório)
  "longitude": -46.633308,                 // number (opcional)
  "latitude": -23.550520                   // number (opcional)
}
```

#### Response Success (201)
```javascript
{
  "success": true,
  "message": "Address created successfully",
  "code": "SUCCESS",
  "data": {
    "id": "66d8f4a2c8f1234567890xyz",
    "street": "Rua das Flores",
    "number": "123",
    "city": "São Paulo",
    "state": "SP",
    "country": "Brasil",
    "zipCode": "01234-567",
    "longitude": -46.633308,
    "latitude": -23.550520,
    "userId": "66d8f4a2c8f1234567890abc",
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
      "field": "street",
      "message": "Rua é obrigatória"
    },
    {
      "field": "zipCode",
      "message": "CEP deve ser uma string"
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

### 2. Listar Endereços do Usuário
**`GET /api/address`** 🔒

#### Headers
```javascript
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Response Success (200)
```javascript
{
  "success": true,
  "message": "Addresses fetched successfully",
  "code": "SUCCESS",
  "data": [
    {
      "id": "66d8f4a2c8f1234567890xyz",
      "street": "Rua das Flores",
      "number": "123",
      "city": "São Paulo",
      "state": "SP",
      "country": "Brasil",
      "zipCode": "01234-567",
      "longitude": -46.633308,
      "latitude": -23.550520,
      "userId": "66d8f4a2c8f1234567890abc",
      "createdAt": "2025-09-06T12:00:00.000Z",
      "updatedAt": "2025-09-06T12:00:00.000Z"
    },
    {
      "id": "66d8f4a2c8f1234567890def",
      "street": "Avenida Paulista",
      "number": "1000",
      "city": "São Paulo",
      "state": "SP",
      "country": "Brasil",
      "zipCode": "01310-100",
      "longitude": -46.656139,
      "latitude": -23.561414,
      "userId": "66d8f4a2c8f1234567890abc",
      "createdAt": "2025-09-06T10:00:00.000Z",
      "updatedAt": "2025-09-06T10:00:00.000Z"
    }
  ]
}
```

#### Response Success (200) - Lista Vazia
```javascript
{
  "success": true,
  "message": "Addresses fetched successfully",
  "code": "SUCCESS",
  "data": []
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

### 3. Buscar Endereço por ID
**`GET /api/address/:id`** 🔒

#### Headers
```javascript
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Path Parameters
```javascript
// :id = ObjectId do endereço
// Exemplo: /api/address/66d8f4a2c8f1234567890xyz
```

#### Response Success (200)
```javascript
{
  "success": true,
  "message": "Address fetched successfully",
  "code": "SUCCESS",
  "data": {
    "id": "66d8f4a2c8f1234567890xyz",
    "street": "Rua das Flores",
    "number": "123",
    "city": "São Paulo",
    "state": "SP",
    "country": "Brasil",
    "zipCode": "01234-567",
    "longitude": -46.633308,
    "latitude": -23.550520,
    "userId": "66d8f4a2c8f1234567890abc",
    "createdAt": "2025-09-06T12:00:00.000Z",
    "updatedAt": "2025-09-06T12:00:00.000Z"
  }
}
```

#### Response Error (404) - Endereço não encontrado
```javascript
{
  "success": false,
  "message": "Address not found",
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

### 4. Atualizar Endereço
**`PATCH /api/address/:id`** 🔒

#### Headers
```javascript
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}
```

#### Path Parameters
```javascript
// :id = ObjectId do endereço
// Exemplo: /api/address/66d8f4a2c8f1234567890xyz
```

#### Request Body (Todos os campos são opcionais)
```javascript
{
  "street": "Rua das Rosas",               // string (opcional)
  "number": "456",                         // string (opcional)
  "city": "Rio de Janeiro",                // string (opcional)
  "state": "RJ",                           // string (opcional)
  "country": "Brasil",                     // string (opcional)
  "zipCode": "22070-900",                  // string (opcional)
  "longitude": -43.177280,                 // number (opcional)
  "latitude": -22.966800                   // number (opcional)
}
```

#### Response Success (200)
```javascript
{
  "success": true,
  "message": "Address updated successfully",
  "code": "SUCCESS",
  "data": {
    "id": "66d8f4a2c8f1234567890xyz",
    "street": "Rua das Rosas",
    "number": "456",
    "city": "Rio de Janeiro",
    "state": "RJ",
    "country": "Brasil",
    "zipCode": "22070-900",
    "longitude": -43.177280,
    "latitude": -22.966800,
    "userId": "66d8f4a2c8f1234567890abc",
    "createdAt": "2025-09-06T12:00:00.000Z",
    "updatedAt": "2025-09-06T14:30:00.000Z"
  }
}
```

#### Response Error (404) - Endereço não encontrado
```javascript
{
  "success": false,
  "message": "Address not found",
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
      "field": "zipCode",
      "message": "CEP deve ser uma string"
    }
  ]
}
```

---

### 5. Deletar Endereço
**`DELETE /api/address/:id`** 🔒

#### Headers
```javascript
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Path Parameters
```javascript
// :id = ObjectId do endereço
// Exemplo: /api/address/66d8f4a2c8f1234567890xyz
```

#### Response Success (200)
```javascript
{
  "success": true,
  "message": "Address deleted successfully",
  "code": "SUCCESS",
  "data": null
}
```

#### Response Error (404) - Endereço não encontrado
```javascript
{
  "success": false,
  "message": "Address not found",
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

#### 1. Criar Endereço
```javascript
const createAddress = async (addressData, token) => {
  try {
    const response = await fetch('/api/address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(addressData)
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Endereço criado:', result.data);
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Erro ao criar endereço:', error);
    throw error;
  }
};

// Uso
const token = localStorage.getItem('access_token');
const newAddress = await createAddress({
  street: "Rua das Flores",
  number: "123",
  city: "São Paulo",
  state: "SP",
  country: "Brasil",
  zipCode: "01234-567",
  longitude: -46.633308,
  latitude: -23.550520
}, token);
```

#### 2. Listar Endereços do Usuário
```javascript
const getUserAddresses = async (token) => {
  try {
    const response = await fetch('/api/address', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Endereços encontrados:', result.data);
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Erro ao buscar endereços:', error);
    throw error;
  }
};

// Uso
const token = localStorage.getItem('access_token');
const addresses = await getUserAddresses(token);
```

#### 3. Buscar Endereço por ID
```javascript
const getAddressById = async (addressId, token) => {
  try {
    const response = await fetch(`/api/address/${addressId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Endereço encontrado:', result.data);
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Erro ao buscar endereço:', error);
    throw error;
  }
};

// Uso
const token = localStorage.getItem('access_token');
const address = await getAddressById('66d8f4a2c8f1234567890xyz', token);
```

#### 4. Atualizar Endereço
```javascript
const updateAddress = async (addressId, updateData, token) => {
  try {
    const response = await fetch(`/api/address/${addressId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Endereço atualizado:', result.data);
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Erro ao atualizar endereço:', error);
    throw error;
  }
};

// Uso
const token = localStorage.getItem('access_token');
const updatedAddress = await updateAddress('66d8f4a2c8f1234567890xyz', {
  street: "Rua das Rosas",
  number: "456"
}, token);
```

#### 5. Deletar Endereço
```javascript
const deleteAddress = async (addressId, token) => {
  try {
    const response = await fetch(`/api/address/${addressId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Endereço deletado com sucesso');
      return true;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Erro ao deletar endereço:', error);
    throw error;
  }
};

// Uso
const token = localStorage.getItem('access_token');
await deleteAddress('66d8f4a2c8f1234567890xyz', token);
```

#### 6. Classe de Serviço Completa
```javascript
class AddressService {
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

  // Criar endereço
  async create(addressData) {
    const response = await fetch(`${this.baseURL}/address`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(addressData)
    });
    
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    
    return result.data;
  }

  // Listar endereços do usuário
  async getAll() {
    const response = await fetch(`${this.baseURL}/address`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    
    return result.data;
  }

  // Buscar endereço por ID
  async getById(id) {
    const response = await fetch(`${this.baseURL}/address/${id}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    
    return result.data;
  }

  // Atualizar endereço
  async update(id, updateData) {
    const response = await fetch(`${this.baseURL}/address/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updateData)
    });
    
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    
    return result.data;
  }

  // Deletar endereço
  async delete(id) {
    const response = await fetch(`${this.baseURL}/address/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    
    return true;
  }

  // Buscar endereços por CEP (exemplo de extensão)
  async searchByCep(cep) {
    const addresses = await this.getAll();
    return addresses.filter(addr => addr.zipCode.includes(cep));
  }

  // Buscar endereços por cidade
  async getByCity(city) {
    const addresses = await this.getAll();
    return addresses.filter(addr => 
      addr.city.toLowerCase().includes(city.toLowerCase())
    );
  }

  // Validar CEP brasileiro
  static validateBrazilianZipCode(zipCode) {
    const cepRegex = /^\d{5}-?\d{3}$/;
    return cepRegex.test(zipCode);
  }

  // Formatar CEP brasileiro
  static formatBrazilianZipCode(zipCode) {
    const numbers = zipCode.replace(/\D/g, '');
    if (numbers.length === 8) {
      return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
    }
    return zipCode;
  }

  // Calcular distância entre dois endereços (se tiverem coordenadas)
  static calculateDistance(address1, address2) {
    if (!address1.latitude || !address1.longitude || 
        !address2.latitude || !address2.longitude) {
      return null;
    }

    const R = 6371; // Raio da Terra em km
    const dLat = (address2.latitude - address1.latitude) * Math.PI / 180;
    const dLon = (address2.longitude - address1.longitude) * Math.PI / 180;
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(address1.latitude * Math.PI / 180) * 
      Math.cos(address2.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distância em km
    
    return distance;
  }
}

// Uso da classe
const addressService = new AddressService();

// Criar endereço
const newAddress = await addressService.create({
  street: "Rua das Flores",
  number: "123",
  city: "São Paulo",
  state: "SP",
  zipCode: "01234-567"
});

// Listar endereços
const addresses = await addressService.getAll();

// Buscar por cidade
const spAddresses = await addressService.getByCity('São Paulo');

// Validar CEP
const isValidCep = AddressService.validateBrazilianZipCode('01234-567'); // true

// Formatar CEP
const formattedCep = AddressService.formatBrazilianZipCode('01234567'); // "01234-567"
```

---

## 🎯 Tipos TypeScript

```typescript
// Interfaces de Request
export interface CreateAddressRequest {
  street: string;
  number: string;
  city: string;
  state: string;
  country?: string;
  zipCode: string;
  longitude?: number;
  latitude?: number;
}

export interface UpdateAddressRequest {
  street?: string;
  number?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  longitude?: number;
  latitude?: number;
}

// Interface de Response
export interface Address {
  id: string;
  street: string;
  number: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  longitude?: number;
  latitude?: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Interface de resposta da API
export interface ApiAddressResponse<T = any> {
  success: boolean;
  message: string;
  code: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Estados brasileiros (enum para validação)
export enum BrazilianStates {
  AC = 'AC', // Acre
  AL = 'AL', // Alagoas
  AP = 'AP', // Amapá
  AM = 'AM', // Amazonas
  BA = 'BA', // Bahia
  CE = 'CE', // Ceará
  DF = 'DF', // Distrito Federal
  ES = 'ES', // Espírito Santo
  GO = 'GO', // Goiás
  MA = 'MA', // Maranhão
  MT = 'MT', // Mato Grosso
  MS = 'MS', // Mato Grosso do Sul
  MG = 'MG', // Minas Gerais
  PA = 'PA', // Pará
  PB = 'PB', // Paraíba
  PR = 'PR', // Paraná
  PE = 'PE', // Pernambuco
  PI = 'PI', // Piauí
  RJ = 'RJ', // Rio de Janeiro
  RN = 'RN', // Rio Grande do Norte
  RS = 'RS', // Rio Grande do Sul
  RO = 'RO', // Rondônia
  RR = 'RR', // Roraima
  SC = 'SC', // Santa Catarina
  SP = 'SP', // São Paulo
  SE = 'SE', // Sergipe
  TO = 'TO'  // Tocantins
}

// Service Class com TypeScript
export class AddressService {
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

  async create(addressData: CreateAddressRequest): Promise<Address> {
    const response = await fetch(`${this.baseURL}/address`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(addressData)
    });
    
    const result: ApiAddressResponse<Address> = await response.json();
    if (!result.success) throw new Error(result.message);
    
    return result.data!;
  }

  async getAll(): Promise<Address[]> {
    const response = await fetch(`${this.baseURL}/address`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    
    const result: ApiAddressResponse<Address[]> = await response.json();
    if (!result.success) throw new Error(result.message);
    
    return result.data!;
  }

  async getById(id: string): Promise<Address> {
    const response = await fetch(`${this.baseURL}/address/${id}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    
    const result: ApiAddressResponse<Address> = await response.json();
    if (!result.success) throw new Error(result.message);
    
    return result.data!;
  }

  async update(id: string, updateData: UpdateAddressRequest): Promise<Address> {
    const response = await fetch(`${this.baseURL}/address/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updateData)
    });
    
    const result: ApiAddressResponse<Address> = await response.json();
    if (!result.success) throw new Error(result.message);
    
    return result.data!;
  }

  async delete(id: string): Promise<boolean> {
    const response = await fetch(`${this.baseURL}/address/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    
    const result: ApiAddressResponse<null> = await response.json();
    if (!result.success) throw new Error(result.message);
    
    return true;
  }

  async searchByCep(cep: string): Promise<Address[]> {
    const addresses = await this.getAll();
    return addresses.filter(addr => addr.zipCode.includes(cep));
  }

  async getByCity(city: string): Promise<Address[]> {
    const addresses = await this.getAll();
    return addresses.filter(addr => 
      addr.city.toLowerCase().includes(city.toLowerCase())
    );
  }

  async getByState(state: BrazilianStates): Promise<Address[]> {
    const addresses = await this.getAll();
    return addresses.filter(addr => addr.state === state);
  }

  static validateBrazilianZipCode(zipCode: string): boolean {
    const cepRegex = /^\d{5}-?\d{3}$/;
    return cepRegex.test(zipCode);
  }

  static formatBrazilianZipCode(zipCode: string): string {
    const numbers = zipCode.replace(/\D/g, '');
    if (numbers.length === 8) {
      return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
    }
    return zipCode;
  }

  static calculateDistance(address1: Address, address2: Address): number | null {
    if (!address1.latitude || !address1.longitude || 
        !address2.latitude || !address2.longitude) {
      return null;
    }

    const R = 6371; // Raio da Terra em km
    const dLat = (address2.latitude - address1.latitude) * Math.PI / 180;
    const dLon = (address2.longitude - address1.longitude) * Math.PI / 180;
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(address1.latitude * Math.PI / 180) * 
      Math.cos(address2.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distância em km
    
    return distance;
  }
}

// Hook React personalizado
export const useAddresses = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addressService = new AddressService();

  const loadAddresses = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await addressService.getAll();
      setAddresses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar endereços');
    } finally {
      setLoading(false);
    }
  }, []);

  const createAddress = useCallback(async (addressData: CreateAddressRequest) => {
    setError(null);
    
    try {
      const newAddress = await addressService.create(addressData);
      setAddresses(prev => [...prev, newAddress]);
      return newAddress;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao criar endereço';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, []);

  const updateAddress = useCallback(async (id: string, updateData: UpdateAddressRequest) => {
    setError(null);
    
    try {
      const updated = await addressService.update(id, updateData);
      setAddresses(prev => prev.map(addr => addr.id === id ? updated : addr));
      return updated;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao atualizar endereço';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, []);

  const deleteAddress = useCallback(async (id: string) => {
    setError(null);
    
    try {
      await addressService.delete(id);
      setAddresses(prev => prev.filter(addr => addr.id !== id));
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao deletar endereço';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, []);

  return {
    addresses,
    loading,
    error,
    loadAddresses,
    createAddress,
    updateAddress,
    deleteAddress
  };
};
```

---

## 🔧 Exemplos de Componentes React

### Listagem de Endereços
```typescript
import React, { useEffect } from 'react';

const AddressList: React.FC = () => {
  const { 
    addresses, 
    loading, 
    error, 
    loadAddresses, 
    deleteAddress 
  } = useAddresses();

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const handleDelete = async (id: string, street: string) => {
    if (window.confirm(`Tem certeza que deseja deletar o endereço "${street}"?`)) {
      try {
        await deleteAddress(id);
        alert('Endereço deletado com sucesso!');
      } catch (error) {
        alert('Erro ao deletar endereço');
      }
    }
  };

  const formatAddress = (address: Address): string => {
    return `${address.street}, ${address.number} - ${address.city}/${address.state} - ${address.zipCode}`;
  };

  if (loading) return <div>Carregando endereços...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <h2>Meus Endereços</h2>
      
      {addresses.length === 0 ? (
        <p>Nenhum endereço cadastrado.</p>
      ) : (
        <ul>
          {addresses.map(address => (
            <li key={address.id} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ddd' }}>
              <div>
                <strong>{formatAddress(address)}</strong>
                {address.country !== 'Brasil' && <span> - {address.country}</span>}
              </div>
              
              {(address.latitude && address.longitude) && (
                <div style={{ fontSize: '0.9em', color: '#666' }}>
                  Coordenadas: {address.latitude}, {address.longitude}
                </div>
              )}
              
              <div style={{ marginTop: '10px' }}>
                <button onClick={() => handleDelete(address.id, address.street)}>
                  Deletar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

### Formulário de Endereço
```typescript
import React, { useState } from 'react';

interface AddressFormProps {
  initialData?: Partial<Address>;
  onSubmit: (data: CreateAddressRequest | UpdateAddressRequest) => Promise<void>;
  submitLabel: string;
}

const AddressForm: React.FC<AddressFormProps> = ({ 
  initialData = {}, 
  onSubmit, 
  submitLabel 
}) => {
  const [formData, setFormData] = useState<CreateAddressRequest>({
    street: initialData.street || '',
    number: initialData.number || '',
    city: initialData.city || '',
    state: initialData.state || '',
    country: initialData.country || 'Brasil',
    zipCode: initialData.zipCode || '',
    longitude: initialData.longitude,
    latitude: initialData.latitude
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validações básicas
    const newErrors: Record<string, string> = {};
    
    if (!formData.street.trim()) newErrors.street = 'Rua é obrigatória';
    if (!formData.number.trim()) newErrors.number = 'Número é obrigatório';
    if (!formData.city.trim()) newErrors.city = 'Cidade é obrigatória';
    if (!formData.state.trim()) newErrors.state = 'Estado é obrigatório';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'CEP é obrigatório';
    
    if (!AddressService.validateBrazilianZipCode(formData.zipCode)) {
      newErrors.zipCode = 'CEP deve ter o formato: 12345-678';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      // Formatar CEP antes de enviar
      const dataToSubmit = {
        ...formData,
        zipCode: AddressService.formatBrazilianZipCode(formData.zipCode)
      };
      
      await onSubmit(dataToSubmit);
      
      if (!initialData.id) {
        // Reset form apenas para criação
        setFormData({
          street: '',
          number: '',
          city: '',
          state: '',
          country: 'Brasil',
          zipCode: '',
          longitude: undefined,
          latitude: undefined
        });
      }
      
      alert('Endereço salvo com sucesso!');
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ general: error.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateAddressRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando usuário digita
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="street">Rua:</label>
        <input
          type="text"
          id="street"
          value={formData.street}
          onChange={(e) => handleInputChange('street', e.target.value)}
          required
        />
        {errors.street && <span className="error">{errors.street}</span>}
      </div>

      <div>
        <label htmlFor="number">Número:</label>
        <input
          type="text"
          id="number"
          value={formData.number}
          onChange={(e) => handleInputChange('number', e.target.value)}
          required
        />
        {errors.number && <span className="error">{errors.number}</span>}
      </div>

      <div>
        <label htmlFor="city">Cidade:</label>
        <input
          type="text"
          id="city"
          value={formData.city}
          onChange={(e) => handleInputChange('city', e.target.value)}
          required
        />
        {errors.city && <span className="error">{errors.city}</span>}
      </div>

      <div>
        <label htmlFor="state">Estado:</label>
        <select
          id="state"
          value={formData.state}
          onChange={(e) => handleInputChange('state', e.target.value)}
          required
        >
          <option value="">Selecione...</option>
          {Object.entries(BrazilianStates).map(([key, value]) => (
            <option key={key} value={value}>{value}</option>
          ))}
        </select>
        {errors.state && <span className="error">{errors.state}</span>}
      </div>

      <div>
        <label htmlFor="zipCode">CEP:</label>
        <input
          type="text"
          id="zipCode"
          value={formData.zipCode}
          onChange={(e) => handleInputChange('zipCode', e.target.value)}
          placeholder="12345-678"
          required
        />
        {errors.zipCode && <span className="error">{errors.zipCode}</span>}
      </div>

      <div>
        <label htmlFor="country">País:</label>
        <input
          type="text"
          id="country"
          value={formData.country}
          onChange={(e) => handleInputChange('country', e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="longitude">Longitude (opcional):</label>
        <input
          type="number"
          step="any"
          id="longitude"
          value={formData.longitude || ''}
          onChange={(e) => handleInputChange('longitude', parseFloat(e.target.value) || undefined)}
        />
      </div>

      <div>
        <label htmlFor="latitude">Latitude (opcional):</label>
        <input
          type="number"
          step="any"
          id="latitude"
          value={formData.latitude || ''}
          onChange={(e) => handleInputChange('latitude', parseFloat(e.target.value) || undefined)}
        />
      </div>

      {errors.general && <div className="error">{errors.general}</div>}

      <button type="submit" disabled={loading}>
        {loading ? 'Salvando...' : submitLabel}
      </button>
    </form>
  );
};

// Componente para criar endereço
const CreateAddress: React.FC = () => {
  const { createAddress } = useAddresses();

  return (
    <AddressForm
      onSubmit={createAddress}
      submitLabel="Criar Endereço"
    />
  );
};

// Componente para editar endereço
const EditAddress: React.FC<{ address: Address }> = ({ address }) => {
  const { updateAddress } = useAddresses();

  const handleUpdate = async (data: UpdateAddressRequest) => {
    await updateAddress(address.id, data);
  };

  return (
    <AddressForm
      initialData={address}
      onSubmit={handleUpdate}
      submitLabel="Atualizar Endereço"
    />
  );
};
```

---

## 🌍 Integração com APIs Externas

### Busca de CEP (ViaCEP)
```typescript
interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

class CepService {
  static async searchCep(cep: string): Promise<ViaCepResponse | null> {
    try {
      const cleanCep = cep.replace(/\D/g, '');
      if (cleanCep.length !== 8) {
        throw new Error('CEP deve ter 8 dígitos');
      }

      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        throw new Error('CEP não encontrado');
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      return null;
    }
  }

  static viaCepToAddressData(viaCepData: ViaCepResponse): Partial<CreateAddressRequest> {
    return {
      street: viaCepData.logradouro,
      city: viaCepData.localidade,
      state: viaCepData.uf,
      zipCode: viaCepData.cep,
      country: 'Brasil'
    };
  }
}

// Componente com busca automática de CEP
const AddressFormWithCepSearch: React.FC = () => {
  const [cepLoading, setCepLoading] = useState(false);
  const [formData, setFormData] = useState<CreateAddressRequest>({
    street: '',
    number: '',
    city: '',
    state: '',
    country: 'Brasil',
    zipCode: ''
  });

  const handleCepBlur = async (cep: string) => {
    if (cep.length >= 8) {
      setCepLoading(true);
      const cepData = await CepService.searchCep(cep);
      
      if (cepData) {
        const addressData = CepService.viaCepToAddressData(cepData);
        setFormData(prev => ({
          ...prev,
          ...addressData,
          zipCode: AddressService.formatBrazilianZipCode(cep)
        }));
      }
      
      setCepLoading(false);
    }
  };

  return (
    <form>
      <div>
        <label htmlFor="zipCode">CEP:</label>
        <input
          type="text"
          id="zipCode"
          value={formData.zipCode}
          onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
          onBlur={(e) => handleCepBlur(e.target.value)}
          placeholder="12345-678"
        />
        {cepLoading && <span>Buscando CEP...</span>}
      </div>

      <div>
        <label htmlFor="street">Rua:</label>
        <input
          type="text"
          id="street"
          value={formData.street}
          onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
          readOnly={cepLoading}
        />
      </div>

      <div>
        <label htmlFor="city">Cidade:</label>
        <input
          type="text"
          id="city"
          value={formData.city}
          onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
          readOnly={cepLoading}
        />
      </div>

      <div>
        <label htmlFor="state">Estado:</label>
        <input
          type="text"
          id="state"
          value={formData.state}
          onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
          readOnly={cepLoading}
        />
      </div>

      {/* Restante dos campos... */}
    </form>
  );
};
```

---

## ⚠️ Códigos de Erro Comuns

| Código HTTP | Código API | Descrição |
|-------------|------------|-----------|
| `400` | `VALIDATION_ERROR` | Dados de entrada inválidos |
| `401` | `UNAUTHORIZED` | Token inválido ou expirado |
| `404` | `NOT_FOUND` | Endereço não encontrado |
| `500` | `INTERNAL_ERROR` | Erro interno do servidor |

---

## 🛡️ Segurança e Boas Práticas

### 1. **Autenticação**
- Todas as rotas requerem token JWT válido
- Usuários só podem acessar seus próprios endereços

### 2. **Validação de Dados**
```javascript
const validateAddressData = (addressData) => {
  const errors = {};
  
  if (!addressData.street?.trim()) errors.street = 'Rua é obrigatória';
  if (!addressData.number?.trim()) errors.number = 'Número é obrigatório';
  if (!AddressService.validateBrazilianZipCode(addressData.zipCode)) {
    errors.zipCode = 'CEP inválido';
  }
  
  return errors;
};
```

### 3. **Coordenadas GPS**
- Longitude e latitude são opcionais
- Úteis para cálculo de distâncias e mapas
- Validar faixas: latitude (-90 a 90), longitude (-180 a 180)

### 4. **Formatação de CEP**
```javascript
// Sempre formatar CEP antes de salvar
const formattedCep = AddressService.formatBrazilianZipCode(inputCep);
```

---

## 📝 Notas Importantes

1. **Escopo de Usuário**: Cada usuário só vê seus próprios endereços
2. **País Padrão**: Brasil é definido como padrão se não informado
3. **Coordenadas**: Longitude e latitude são opcionais para geolocalização
4. **CEP**: Aceita formato com ou sem hífen (01234567 ou 01234-567)
5. **Estados**: Use siglas padrão (SP, RJ, MG, etc.)
6. **Validação**: Todos os campos obrigatórios são validados no servidor
7. **Relacionamento**: Cada endereço pertence a um usuário específico

---

**Última atualização:** 6 de Setembro de 2025
**Versão da API:** 1.0
