# Fintech Flow — Frontend

Frontend em **React + Vite** que consome a API [`backend-sa`](https://github.com/Marcus-Verissimo-Bastos/backend-sa) (Express + JWT + PostgreSQL).
Identidade visual baseada em [`fintech-flow`](https://github.com/naiarafarrell/fintech-flow), agora integrada ao backend real, com gráficos, feedbacks e deploy.

## Como rodar

```bash
# 1) backend (outro terminal): siga o README do backend-sa  -> http://localhost:3001
# 2) frontend
cp .env.example .env        # ajuste VITE_API_URL se necessário
npm install
npm run dev                 # http://localhost:5173
```

| Script | O que faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | build de produção em `dist/` |
| `npm run preview` | serve o build localmente |
| `npm run lint` | ESLint |

## Checklist

| Item | Onde está |
|---|---|
| Projeto React com Vite | `package.json`, `vite.config.js`, `index.html` |
| Logo | `src/components/ui/Logo.jsx` (escudo + linha de crescimento) e `public/favicon.svg` |
| Rotas de leitura, gravação e atualização | `src/services/transactionService.js` — `list`/`get` (GET), `create` (POST), `update` (PUT), `remove` (DELETE) |
| Login com autenticação | `src/pages/AuthPage.jsx` (login + cadastro), `src/context/AuthContext.jsx` (JWT), `ProtectedRoute.jsx` |
| Criação do dashboard | `src/pages/DashboardPage.jsx`, `components/dashboard/SummaryCards.jsx` |
| Consumo do dashboard + gráficos | `src/utils/dashboard.js` (agregações) + `MonthlyChart.jsx` (barras + linha) e `CategoryChart.jsx` (donut) com Recharts |
| Tabelas, busca e filtros componentizados | `components/transactions/` — `TransactionTable`, `TransactionRow`, `TransactionFilters`, `Pagination`, `TransactionFormModal` |
| Toasts, loaders e modais de erro | `ToastContext.jsx`, `ui/Loader.jsx` (spinner/skeletons), `ui/ErrorModal.jsx`, `ui/ConfirmModal.jsx`, `ui/ErrorBoundary.jsx` |
| Otimização, memoização e responsividade | ver abaixo |
| Deploy e build de produção | `vercel.json`, `netlify.toml`, seção "Deploy" |

> O backend não possui rota de dashboard. Os totais e gráficos são calculados no cliente a partir de `GET /api/transactions` (com `useMemo`).

## Otimização

- **Code-splitting por rota** (`React.lazy`) e **gráficos em chunks separados** (Recharts só baixa quando o dashboard abre).
- **`React.memo`** em linhas, tabela, filtros, cards e gráficos; **`useCallback`** nos handlers para manter props estáveis.
- **`useMemo`** em filtragem, ordenação, paginação e agregações.
- **Debounce** de 250 ms na busca.
- **Estado compartilhado** (`TransactionsContext`): a API é consultada uma vez; criar/editar/excluir atualizam a lista local sem refetch.
- **Responsividade**: sidebar vira menu lateral no mobile, tabela vira lista de cards, botão flutuante para "Nova transação", grids fluidos.

## Tratamento de erros e sessão

- Erros do backend (`{ "error": "..." }`) viram `ApiError` com a mensagem original, exibida no formulário, em toast ou em modal.
- Falha de rede → mensagem amigável; falha ao carregar dados → modal com **Tentar novamente**.
- `401` em rota autenticada (token expirado, 7 dias) → logout automático e aviso na tela de login.

## Deploy

1. Publique o backend (Render, Railway, Fly…) e anote a URL, ex.: `https://fintechflow-api.onrender.com`.
2. Defina a variável **`VITE_API_URL`** no provedor do frontend (é lida em *build time*).
3. **Vercel**: importe o repositório → framework *Vite* (já configurado em `vercel.json`).
   **Netlify**: importe o repositório (`netlify.toml` já configurado) ou `npx netlify deploy --prod --dir=dist`.
   **S3 + CloudFront**: `npm run build`, envie `dist/` ao bucket e configure *error document* = `index.html` (fallback SPA).
4. O arquivo de rewrite (`vercel.json` / `netlify.toml`) garante que rotas como `/transactions` funcionem ao recarregar a página.

> O backend usa `cors()` aberto. Em produção, restrinja a origem ao domínio do frontend.

## Estrutura

```
src/
├── components/{layout,ui,dashboard,transactions}
├── context/    Auth, Toast, Transactions
├── hooks/      useDebounce
├── pages/      AuthPage, DashboardPage, TransactionsPage, NotFoundPage
├── services/   api (fetch + JWT), authService, transactionService
└── utils/      format, dashboard (agregações)
```
