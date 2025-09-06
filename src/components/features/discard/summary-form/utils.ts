export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function formatTime(timeString: string): string {
  try {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  } catch {
    return timeString;
  }
}

export function formatCep(cep: string): string {
  try {
    // Remove qualquer formatação existente
    const cleanCep = cep.replace(/\D/g, '');
    
    // Aplica a formatação XXXXX-XXX
    if (cleanCep.length === 8) {
      return `${cleanCep.slice(0, 5)}-${cleanCep.slice(5)}`;
    }
    
    return cep;
  } catch {
    return cep;
  }
}
