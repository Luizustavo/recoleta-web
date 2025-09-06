# 📍 Guia de Migração - Coordenadas Obrigatórias na API de Waste

## ⚠️ Mudanças Importantes

A partir desta versão, **latitude e longitude são OBRIGATÓRIOS** no cadastro de resíduos.

### O que mudou:
- ✅ **Coordenadas obrigatórias**: `latitude` e `longitude` são campos obrigatórios
- ✅ **Formato string**: Coordenadas devem ser enviadas como string (ex: `"-23.5505"`)
- ✅ **Validação automática**: API valida limites automaticamente
- ✅ **Utilitários prontos**: Funções helper para obter e validar coordenadas

## 🚀 Como usar as novas funcionalidades

### 1. Importar utilitários

```typescript
import { 
  createWasteWithLocation,
  getCurrentPosition,
  validateCoordinates,
  handleFormSubmission
} from '@/lib/waste-form-adapter';
import { CreateWasteRequest } from '@/types/waste-api';
```

### 2. Criar resíduo com coordenadas automáticas

```typescript
// Exemplo mais simples - coordenadas obtidas automaticamente
const wasteData = {
  wasteType: 'ELECTRONICS',
  weight: 2.5,
  quantity: 1,
  unit: 'KG' as const,
  condition: 'USED' as const,
  hasPackaging: true,
  discardDate: new Date().toISOString(),
  additionalDescription: 'Smartphone antigo'
};

const addressData = {
  street: 'Rua das Flores',
  number: '123',
  neighborhood: 'Centro',
  city: 'São Paulo',
  state: 'SP',
  zipCode: '01234-567'
  // latitude e longitude serão obtidas automaticamente
};

try {
  const result = await createWasteWithLocation(wasteData, addressData);
  console.log('Resíduo criado com sucesso:', result);
} catch (error) {
  if (error.message.includes('Geolocalização')) {
    alert('É necessário permitir acesso à localização para cadastrar o resíduo');
  } else {
    console.error('Erro:', error.message);
  }
}
```

### 3. Integração com formulário existente

```typescript
// Se você já tem um formulário como o atual, use o adapter
import { handleFormSubmission } from '@/lib/waste-form-adapter';

const onSubmitForm = async (wasteFormData: WasteFormData, addressFormData: AddressData) => {
  const result = await handleFormSubmission(wasteFormData, addressFormData);
  
  if (result.success) {
    toast.success(result.message);
    // Redirecionar ou atualizar UI
  } else {
    toast.error(result.message);
  }
};
```

### 4. Validar coordenadas manualmente

```typescript
import { validateCoordinates } from '@/lib/waste-api-utils';

const latitude = "-23.5505";
const longitude = "-46.6333";

const validation = validateCoordinates(latitude, longitude);
if (!validation.isValid) {
  console.error('Coordenadas inválidas:', validation.errors);
}
```

### 5. Obter localização atual

```typescript
import { getCurrentPosition } from '@/lib/waste-api-utils';

try {
  const position = await getCurrentPosition();
  const coordinates = {
    latitude: position.coords.latitude.toString(),
    longitude: position.coords.longitude.toString()
  };
  console.log('Coordenadas obtidas:', coordinates);
} catch (error) {
  console.error('Erro ao obter localização:', error.message);
}
```

## 🔧 Tratamento de Erros

### Erro de permissão de geolocalização
```typescript
try {
  await createWasteWithLocation(wasteData, addressData);
} catch (error) {
  if (error.message.includes('Permissão para acessar localização foi negada')) {
    // Mostrar modal explicando a necessidade da localização
    showLocationPermissionModal();
  }
}
```

### Erro de validação de coordenadas
```typescript
// A API retornará erro 400 se as coordenadas estiverem inválidas
{
  "success": false,
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "errors": [
    {
      "property": "latitude",
      "constraints": {
        "IsCoordinate": "Latitude deve estar entre -90 e 90"
      }
    }
  ]
}
```

## 📱 Exemplos Práticos para Componentes React

### Componente com solicitação de permissão
```tsx
const WasteFormWithLocation = () => {
  const [locationPermission, setLocationPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  
  useEffect(() => {
    // Verificar se geolocalização está disponível
    if (!navigator.geolocation) {
      setLocationPermission('denied');
      return;
    }
    
    // Solicitar permissão
    navigator.permissions?.query({ name: 'geolocation' }).then(result => {
      setLocationPermission(result.state === 'granted' ? 'granted' : 'denied');
    });
  }, []);
  
  const handleSubmit = async (formData) => {
    if (locationPermission !== 'granted') {
      toast.error('É necessário permitir acesso à localização para cadastrar resíduos');
      return;
    }
    
    const result = await handleFormSubmission(formData.waste, formData.address);
    // ... handle result
  };
  
  return (
    <div>
      {locationPermission === 'denied' && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Localização necessária</AlertTitle>
          <AlertDescription>
            Para cadastrar resíduos, é necessário permitir acesso à sua localização.
            Isso nos ajuda a conectar você com outros usuários próximos.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Seu formulário aqui */}
    </div>
  );
};
```

### Hook personalizado para geolocalização
```tsx
const useGeolocation = () => {
  const [location, setLocation] = useState<{latitude: string, longitude: string} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const getCurrentLocation = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const position = await getCurrentPosition();
      setLocation({
        latitude: position.coords.latitude.toString(),
        longitude: position.coords.longitude.toString()
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { location, error, loading, getCurrentLocation };
};

// Uso no componente
const MyComponent = () => {
  const { location, error, loading, getCurrentLocation } = useGeolocation();
  
  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);
  
  if (loading) return <div>Obtendo localização...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!location) return <div>Localização não disponível</div>;
  
  return <div>Sua localização: {location.latitude}, {location.longitude}</div>;
};
```

## 🎯 Checklist de Migração

Para atualizar seu código existente:

- [ ] ✅ Importar novos utilitários: `waste-api-utils.ts` e `waste-form-adapter.ts`
- [ ] ✅ Atualizar tipos: usar `CreateWasteRequest` da nova API
- [ ] ✅ Substituir chamadas diretas por `createWasteWithLocation()`
- [ ] ✅ Adicionar tratamento de erros de geolocalização
- [ ] ✅ Testar fluxo completo com permissão de localização
- [ ] ✅ Adicionar fallback para coordenadas manuais (opcional)
- [ ] ✅ Atualizar validações de formulário
- [ ] ✅ Testar com coordenadas inválidas

## 📚 Referências

- [Documentação completa da API](./waste-api-routes.md)
- [Tipos TypeScript](../src/types/waste-api.ts)
- [Utilitários de geolocalização](../src/lib/waste-api-utils.ts)
- [Adapter para formulários](../src/lib/waste-form-adapter.ts)

---

**💡 Dica**: Use o `handleFormSubmission()` se você já tem um formulário funcionando - ele faz toda a conversão e tratamento de erros automaticamente!
