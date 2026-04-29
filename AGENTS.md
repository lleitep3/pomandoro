# PoMandoro — Agent Guidelines

> Arquivo de referência para IAs trabalharem neste projeto.
> Mantenha este arquivo atualizado quando mudar a arquitetura ou stack.

---

## Stack Tecnológica

| Categoria  | Tecnologia                             |
| ---------- | -------------------------------------- |
| Framework  | Svelte 5 (runes: `$state`, `$derived`) |
| Linguagem  | TypeScript 5.5+ (strict mode)          |
| Build Tool | Vite 5                                 |
| Testing    | Vitest (unit) + Playwright (E2E)       |
| Deploy     | GitHub Pages                           |

### Estrutura de Diretórios

```
/home/lleite/projects/pomandoro/
├── src/
│   ├── lib/
│   │   ├── components/     # Componentes Svelte
│   │   │   ├── PomodoroTimer.svelte
│   │   │   └── TodoList.svelte
│   │   ├── stores/         # Stores com Svelte 5 runes
│   │   │   ├── pomodoro.svelte.ts
│   │   │   └── todos.svelte.ts
│   │   └── types.ts        # Types/interfaces compartilhados
│   ├── App.svelte          # Root component
│   └── main.ts             # Entry point
├── e2e/                    # Testes E2E (Playwright)
├── .github/workflows/       # CI/CD GitHub Actions
├── vitest.config.ts
├── playwright.config.ts
└── package.json
```

---

## Padrões de Código

### Svelte 5

Use **runes** (não stores clássicos do Svelte 4):

```typescript
// ✅ Correto: Svelte 5 runes
let count = $state(0);
const doubled = $derived(count * 2);

// ❌ Errado: Stores Svelte 4
import { writable } from "svelte/store";
const count = writable(0);
```

### TypeScript

- **Strict mode obrigatório**
- Type annotations explícitas em funções públicas
- Interfaces para props de componentes

```typescript
// ✅ Correto
interface Task {
  id: string;
  title: string;
  pomodoros: number;
  done: boolean;
}

function addTask(title: string): Task {
  // ...
}
```

### Componentes Svelte

1. **Co-locate styles**: Estilos scoped dentro do `<style>`
2. **Props tipadas**: Use interfaces para props
3. **Event handlers**: Arrow functions inline para simples, funções nomeadas para complexos
4. **Acessibilidade**: Sempre inclua `aria-label` em botões icon-only

```svelte
<script lang="ts">
  interface Props {
    title: string
    onAction: () => void
  }

  let { title, onAction }: Props = $props()
</script>

<button aria-label="Descrição da ação" onclick={onAction}>
  {title}
</button>

<style>
  button { /* ... */ }
</style>
```

### Stores (Estado)

- Use `*.svelte.ts` para stores com runes
- Stores são singletons criados via factory function
- Persistência via `localStorage` apenas em stores de dados

```typescript
// pomodoro.svelte.ts
function createPomodoroStore() {
  let mode = $state<TimerMode>("work");
  let remaining = $state(DURATIONS["work"]);
  // ...
  return {
    get mode() {
      return mode;
    },
    // métodos...
  };
}

export const pomodoro = createPomodoroStore();
```

---

## Convenções de Commit

Formato: `<type>(<scope>): <descrição>`

| Type       | Uso                               |
| ---------- | --------------------------------- |
| `feat`     | Nova funcionalidade               |
| `fix`      | Correção de bug                   |
| `docs`     | Documentação                      |
| `style`    | Formatação, sem mudança de lógica |
| `refactor` | Refatoração                       |
| `test`     | Testes                            |
| `chore`    | Build, CI, dependências           |

### Exemplos

```
feat(timer): add sound notification on complete
fix(todo): prevent empty task submission
test(stores): add unit tests for pomodoro store
chore(ci): add PR check workflow
```

### Regras

- Máximo 72 caracteres na linha de assunto
- Use imperativo: "add" não "added"
- Sem ponto final

---

## Git Flow

### Branches

```
main                    # Produção (deploy automático)
  └── feature/x         # Features
  └── fix/x             # Correções
  └── chore/x           # Infra/tooling
```

### Regras

1. **Nunca commit direto na `main`**
2. **Nomes de branch**: kebab-case com prefixo
   - `feature/task-priority`
   - `fix/timer-reset-bug`
   - `chore/upgrade-svelte`
3. **Separação de Escopos**: Nunca misture escopos diferentes (ex: `docs` e `ci`) na mesma branch/PR. O fluxo correto é criar uma branch separada para cada finalidade a partir da `main`.
4. **PR obrigatório** para merge na `main`
5. **Delete branch** após merge

### Antes de Criar PR

```bash
# 1. Atualize com main
git fetch origin
git rebase origin/main

# 2. Rode verificações locais
npm run check      # TypeScript/Svelte check
npm run test       # Unit tests
npm run build      # Build

# 3. Commit com mensagem adequada
git commit -m "feat(scope): description"
```

---

## CI/CD

### Workflows

| Workflow       | Gatilho        | Descrição               |
| -------------- | -------------- | ----------------------- |
| `pr-check.yml` | PR para `main` | Validações obrigatórias |
| `deploy.yml`   | Push na `main` | Deploy GitHub Pages     |

### PR Checks (obrigatórios para merge)

1. **Version Check**: Versão do PR deve ser > versão da `main`
2. **Unit Tests**: `npm run test -- --run`
3. **E2E Tests**: `npm run test:e2e`
4. **Build Check**: `npm run build && npm run check`

### Deploy

Automático no push para `main` via GitHub Pages.

---

## Comandos de Desenvolvimento

```bash
# Instalação
npm install

# Dev server
npm run dev

# Build
npm run build

# Type/Svelte check
npm run check

# Unit tests
npm run test              # Watch mode
npm run test -- --run     # CI mode (single run)
npm run test:coverage     # Coverage check (90% threshold)

# E2E tests
npm run test:e2e          # Headless
npm run test:e2e:ui       # UI mode
```

## Cobertura de Testes

**Threshold obrigatório: 90%** em todas as métricas:

- Statements: 90%
- Branches: 90%
- Functions: 90%
- Lines: 90%

### O que testar

| Tipo            | Exemplos                                                        | Status          |
| --------------- | --------------------------------------------------------------- | --------------- |
| **Stores**      | Lógica pura, cálculos, persistência, edge cases                 | ✅ Implementado |
| **Componentes** | Renderização, interações — **limitado devido a Svelte 5 runes** | ⚠️ Complexo     |
| **E2E**         | Fluxos completos via Playwright                                 | ✅ Recomendado  |

> **Nota sobre testes de componentes:** Componentes Svelte 5 que usam runes (`$state`, `$derived`) não podem ser testados facilmente fora do ambiente Svelte. Prefira testar a **lógica pura** extraída em funções e use **Playwright E2E** para testar a UI.

### O que NÃO conta para coverage

- Arquivos de teste (`*.spec.ts`, `*.test.ts`)
- Entry point (`main.ts`)
- Arquivos de configuração
- `node_modules/` e `dist/`

---

## Hooks de Pre-commit

O projeto usa **husky** + **lint-staged** para validações automáticas.

### Instalação

```bash
npm install --save-dev husky lint-staged
npx husky init
```

### Configuração

**`package.json`:**

```json
{
  "lint-staged": {
    "*.{ts,svelte}": ["svelte-check --tsconfig ./tsconfig.json"],
    "*.{ts,js,svelte}": ["vitest related --run"]
  }
}
```

**`.husky/pre-commit`:**

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Verificar vulnerabilidades (npm audit)
echo "🔍 Checking for vulnerabilities..."
npm audit --audit-level=moderate || exit 1

# Type check e testes relacionados aos arquivos staged
echo "🧠 Running type check and related tests..."
npx lint-staged

# Build de verificação
echo "🔨 Verifying build..."
npm run build

echo "✅ Pre-commit checks passed!"
```

### O que é validado no pre-commit

1. ✅ `npm audit` — vulnerabilidades de segurança
2. ✅ `svelte-check` — type checking TypeScript/Svelte
3. ✅ `vitest related --run` — testes unitários dos arquivos modificados
4. ✅ `npm run build` — build de produção

> **Nota:** Cobertura de testes (90%) é verificada apenas no CI, não no pre-commit, para manter o fluxo de desenvolvimento ágil.

---

## Decisões Arquiteturais

### Por que Svelte 5 runes em vez de stores?

- Menos boilerplate
- Reactividade fine-grained
- Melhor integração TypeScript
- Código mais explícito

### Por que localStorage para persistência?

- App é single-user
- Dados são pequenos (lista de tarefas)
- Sem backend necessário
- Funciona offline

### Por que scoped CSS em componentes?

- Co-location de estilo e estrutura
- Sem conflitos de nome de classe
- Tree-shaking automático

---

## Checklist para IAs

Antes de propor qualquer mudança:

- [ ] Stack compatível com Svelte 5 + TypeScript strict?
- [ ] Segue padrão de componentes e stores?
- [ ] Inclui testes unitários (Vitest) com cobertura 90%+?
- [ ] E2E tests atualizados se houver mudança de UI?
- [ ] Version no `package.json` incrementada?
- [ ] Commit message segue conventional commits?
- [ ] Não quebra build (`npm run build`)?
- [ ] Não quebra checks (`npm run check`)?
- [ ] Cobertura de testes mantida em 90%+ (`npm run test:coverage`)?

---

_Última atualização: 2026-04-29_
