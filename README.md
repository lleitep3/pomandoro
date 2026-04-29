# PoMandoro 🍅

App Pomodoro de exemplo para testes, labs e estudos.

Este projeto foi recentemente reescrito utilizando tecnologias modernas para ser um modelo ideal de arquitetura escalável e bem testada no frontend.

## 🚀 Stack Tecnológica

- **Framework**: [Svelte 5](https://svelte.dev/) (usando runes: `$state`, `$derived`)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Testes Unitários**: [Vitest](https://vitest.dev/) (Cobertura > 90%)
- **Testes E2E**: [Playwright](https://playwright.dev/)
- **CI/CD**: GitHub Actions e GitHub Pages

## 📦 Estrutura do Projeto

O projeto segue uma arquitetura orientada a componentes, com lógica de estado extraída em Svelte 5 stores:
- `src/lib/components`: Componentes visuais do timer e lista de tarefas.
- `src/lib/stores`: Regras de negócio, timer e persistência de dados.
- `e2e/`: Testes fim-a-fim cobrindo toda a jornada do usuário.

## 🛠️ Comandos de Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Fazer build de produção
npm run build

# Validação de Tipos e Svelte Check
npm run check

# Executar Testes Unitários
npm run test
npm run test:coverage     # Relatório de cobertura

# Executar Testes E2E (Playwright)
npm run test:e2e
npm run test:e2e:ui       # Modo interface gráfica
```

## 🤝 Contribuição e Padrões

Temos diretrizes rigorosas para IA e humanos contribuírem com este projeto. Antes de enviar código, por favor leia o nosso documento de referência técnica:

**[📄 Leia o AGENTS.md](./AGENTS.md)** para entender regras de:
- Svelte 5 Runes
- Convenções de Commit (Husky + lint-staged)
- CI/CD checks (lint, test, build)
