# Painel de Inscrições - Conexão Ateliê

Painel administrativo para gerenciar as inscrições da campanha promocional do Conexão Ateliê.

## 🚀 Tecnologias Utilizadas

- **React 19** com **Vite**
- **TypeScript**
- **Tailwind CSS v4** (design system via `@theme`)
- **React Query (TanStack Query)** para cache e estado do servidor
- **React Hook Form** + **Zod** para validação de formulários
- **Vitest** + **Testing Library** para testes automatizados

## 💻 Como rodar o projeto

### Pré-requisitos
- **Node.js**: Versão `^20.19.0` ou `>=22.12.0` (exigência do Vite). O ambiente utilizado no desenvolvimento rodou na versão `24.12.0`.
- **npm**

### Instalação e Execução
1. Clone o repositório.
2. Instale as dependências:
   npm install
3. Inicie o servidor de desenvolvimento:
   npm run dev
4. Acesse http://localhost:5173 no navegador.

### Rodando os Testes
Para executar os testes automatizados:
npm run test

## 🧠 Decisões Técnicas

- **Componentização**: Componentes visuais (StatCard, StatusBadge, InscricoesToolbar) e de fluxo (InscricoesList, CadastrarForm, ModalDetalhes).
- **Validação com Zod**: Usado tanto na leitura da API (inscricoesListSchema) quanto no formulário (cadastroFormSchema), garantindo integridade e mensagens de erro em português.
- **Responsividade Híbrida**: A tabela é exibida apenas em telas maiores que 1351px (breakpoint customizado) para evitar que o layout quebre em notebooks. Abaixo disso, o layout vira uma lista de cards (mobile).
- **Acessibilidade**: Modal com role="dialog", foco inicial, fechamento com ESC, restauração de foco, contenção de foco por teclado (Focus Trap) e bloqueio de scroll. Inputs com aria-label, aria-describedby e aria-invalid. Botões com anéis de foco visíveis.

## 🛠️ Simulação de Cenários (API)
Você pode forçar estados da API adicionando o parâmetro na URL:
- http://localhost:5173/?cenario=erro (Força um erro de rede e exibe o botão "Tentar novamente").
- http://localhost:5173/?cenario=lento (Simula uma resposta lenta da API, atrasando o carregamento).
- http://localhost:5173/?cenario=conflito (Ao tentar cadastrar qualquer e-mail, a API simula um erro 409 de conflito, mantendo os dados no formulário e exibindo a mensagem de e-mail já cadastrado).

# Painel de Inscrições - Conexão Ateliê

> 🚀 **Aplicação em Produção:** [https://atelie-propaganda.vercel.app/](https://atelie-propaganda.vercel.app/)
> 
> 🧪 **Testar Cenários de Erro:** [https://atelie-propaganda.vercel.app/?cenario=erro](https://atelie-propaganda.vercel.app/?cenario=erro)
> 
> ⏳ **Testar Carregamento Lento:** [https://atelie-propaganda.vercel.app/?cenario=lento](https://atelie-propaganda.vercel

## ⏳ Tempo Dedicado
Aproximadamente **4 horas** (distribuídas entre estruturação, design system, lógica de negócios, testes e refinamentos de acessibilidade).

## 🤖 Declaração de Uso de IA
A IA foi utilizada como assistente para:
- Configuração inicial do Tailwind v4 e design system.
- Auxílio na estruturação do React Hook Form + Zod.
- Escrita dos testes com Vitest.
- Sugestões de acessibilidade (Focus Trap e ARIA).
Todo o código foi revisado e adaptado para atender aos requisitos.

## ✅ Concluído / ⏳ Pendente
**Concluído:**
- Listagem, busca, filtros e paginação visual.
- Cadastro com validação de formulário.
- Modal de detalhes com acessibilidade (Focus Trap).
- Tratamento de estados vazios e de erro.
- Testes de validação, busca, sucesso e falha no cadastro.

**Pendente / Melhorias Futuras:**
- Importação de CSV.
- Paginação real no backend (se o volume de dados crescer).