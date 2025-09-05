import { useState, useEffect } from 'react';
import { validateTokenClient } from '@/lib/token-validation';

interface UseTokenValidationReturn {
  isValid: boolean | null;
  isLoading: boolean;
  error: string | null;
  validateToken: (token: string) => Promise<boolean>;
}

export function useTokenValidation(): UseTokenValidationReturn {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateToken = async (token: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await validateTokenClient(token);
      setIsValid(result.valid);
      return result.valid;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      setIsValid(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isValid,
    isLoading,
    error,
    validateToken,
  };
}

export function useAutoTokenValidation() {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateStoredToken = async () => {
      try {
        const response = await fetch('/api/auth/me');
        
        if (response.ok) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch (error) {
        console.error('Erro ao validar token armazenado:', error);
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateStoredToken();
  }, []);

  return { isValid, isLoading };
}
