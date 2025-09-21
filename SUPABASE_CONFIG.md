# Configuração do Supabase para Sistema de Leads

## Resumo das Configurações Realizadas

### 1. Estrutura da Tabela Supabase
A tabela `leads-duque` no Supabase deve ter as seguintes colunas:
- `id` (string/text) - Chave primária
- `nome` (string/text) - Nome do lead
- `numero` (string/text, nullable) - Telefone do lead
- `valorConta` (number/numeric, nullable) - Valor da conta de energia
- `cep` (string/text, nullable) - CEP do lead
- `canal` (string/text, nullable) - Canal de origem (website, social, referral, campaign)
- `created_at` (timestamp, opcional) - Data de criação
- `updated_at` (timestamp, opcional) - Data de atualização

### 2. Configuração do Ambiente (.env)
```env
VITE_SUPABASE_URL=https://hacuqhrpbqvmhkgdfuzr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_LEADS_TABLE=leads-duque
```

### 3. Alterações Realizadas

#### 3.1 Types (src/types.ts)
- Adicionado campos `valorConta?: number` e `cep?: string` à interface `Lead`

#### 3.2 LeadsContext (src/context/LeadsContext.tsx)
- Atualizado `DbLeadRow` para mapear corretamente as colunas da tabela
- Função `dbRowToLead` agora inclui os campos específicos da tabela leads-duque
- Funções `addLead` e `updateLead` agora salvam os novos campos no Supabase
- Mapeamento entre campos da interface Lead e colunas da tabela

#### 3.3 LeadsTable (src/components/Leads/LeadsTable.tsx)
- Adicionadas colunas "Valor da Conta" e "CEP" na tabela
- Formatação adequada dos valores monetários

#### 3.4 LeadModal (src/components/Leads/LeadModal.tsx)
- Adicionados campos de formulário para "Valor da Conta" e "CEP"
- Validação e conversão adequada dos tipos de dados

#### 3.5 LeadDetail (src/components/Leads/LeadDetail.tsx)
- Exibição dos novos campos na tela de detalhes do lead

### 4. Funcionalidades Implementadas
- ✅ Conexão com Supabase
- ✅ Leitura de dados da tabela leads-duque
- ✅ Criação de novos leads com todos os campos
- ✅ Atualização de leads existentes
- ✅ Exclusão de leads
- ✅ Mapeamento correto entre interface Lead e colunas da tabela
- ✅ Exibição formatada dos dados na interface
- ✅ Formulários com validação para todos os campos

### 5. Teste de Conexão
Use o utilitário em `src/utils/testConnection.ts` para verificar:
- Conexão com o Supabase
- Estrutura da tabela
- Dados de exemplo

### 6. Próximos Passos
1. Verificar se a tabela `leads-duque` existe no Supabase com a estrutura correta
2. Testar a aplicação criando, editando e visualizando leads
3. Verificar se os dados estão sendo salvos corretamente no banco

### 7. Comandos para Teste
```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Verificar erros de TypeScript
npm run type-check
```
