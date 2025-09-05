# Página de Gerenciamento de Descartes

## Descrição
A página `/wastes` permite aos usuários visualizar, gerenciar e monitorar todos os seus descartes cadastrados no sistema.

## Funcionalidades

### 1. Listagem de Descartes
- Exibe todos os descartes do usuário em formato de cards
- Mostra informações essenciais: tipo, data, endereço, peso, quantidade
- Status visual com badges coloridas baseadas na data de agendamento

### 2. Status Inteligente
- **Concluído**: Para descartes já realizados (data/hora passada)
- **Hoje**: Para descartes agendados para hoje (com animação)
- **Esta Semana**: Para descartes nos próximos 7 dias
- **Agendado**: Para descartes futuros

### 3. Ícones por Tipo de Resíduo
- Ícones específicos baseados no tipo de resíduo:
  - 🖥️ Eletrônicos (computador, celular)
  - 🔋 Baterias e pilhas
  - 💡 Lâmpadas
  - 💧 Óleos
  - 📚 Papel e livros
  - ♻️ Plásticos e PET
  - 🍷 Vidros e garrafas
  - 👕 Têxteis e roupas
  - 🍃 Orgânicos
  - ⚡ Resíduos perigosos
  - 📦 Outros tipos

### 4. Modal de Detalhes
- Visualização completa de informações do descarte
- Dados organizados em seções:
  - Informações do Resíduo
  - Agendamento
  - Endereço de Coleta
  - Informações do Solicitante
  - Metadados (ID, datas de criação/atualização)

### 5. Ações Disponíveis
- **Ver Detalhes**: Abre modal com informações completas
- **Excluir**: Remove o descarte (com confirmação)
- **Atualizar**: Recarrega a lista de descartes
- **Novo Descarte**: Redireciona para página de cadastro

## Componentes Criados

### 1. `/src/app/(private)/wastes/page.tsx`
Página principal com:
- Estado de carregamento com skeletons
- Gerenciamento de estado dos descartes
- Funções para buscar, excluir e atualizar
- Layout responsivo com grid de cards

### 2. `/src/components/features/wastes/waste-details-modal.tsx`
Modal para exibição detalhada:
- Interface organizada em cards
- Formatação de datas e valores
- Status badges
- Informações completas do descarte

### 3. `/src/components/features/wastes/waste-status-badge.tsx`
Badges de status inteligentes:
- Análise automática de data/hora
- Cores e animações condicionais
- Ícones apropriados por status

### 4. `/src/components/features/wastes/waste-type-icon.tsx`
Ícones dinâmicos por tipo:
- Mapeamento inteligente de tipos para ícones
- Suporte a variações de nomenclatura
- Ícone padrão para tipos não mapeados

### 5. `/src/components/ui/dialog.tsx`
Componente base Dialog:
- Baseado em Radix UI
- Estilização consistente com design system
- Acessibilidade integrada

## Navegação
- Adicionado item no sidebar: "Meus Descartes" em "Gerenciar Coletas"
- Breadcrumbs para orientação do usuário
- Links para criação de novos descartes

## Integração com API
- Utiliza `WasteService` para operações CRUD
- Tratamento de erros com toast notifications
- Loading states durante operações

## Estados da Interface

### Loading
- Skeletons animados durante carregamento inicial
- Indicador de loading no botão de atualizar

### Empty State
- Mensagem amigável quando não há descartes
- Call-to-action para primeiro cadastro
- Ícone ilustrativo

### Error Handling
- Toast notifications para erros
- Mensagens de erro contextuais
- Fallbacks para operações falhadas

## Responsividade
- Grid adaptativo: 1 coluna (mobile), 2 colunas (tablet), 3 colunas (desktop)
- Modal responsivo com scroll vertical
- Botões adaptativos para diferentes tamanhos de tela

## Acessibilidade
- Componentes baseados em Radix UI
- Labels descritivos
- Navegação por teclado
- Contrast ratios adequados
- Screen reader friendly

## Próximas Melhorias Possíveis
1. Filtros por status, tipo de resíduo, data
2. Ordenação por diferentes critérios
3. Busca/pesquisa por texto
4. Exportação de dados
5. Edição inline de informações
6. Notificações push para lembretes
7. Integração com calendário
8. Histórico de alterações
