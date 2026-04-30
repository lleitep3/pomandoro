# PoMandoro 🍅

App Pomodoro simples e útil pra me auxiliar no dia a dia.

🌍 **Live Demo:** [https://lleitep3.github.io/pomandoro/](https://lleitep3.github.io/pomandoro/)
📊 **Relatórios:** [Cobertura de Testes](https://lleitep3.github.io/pomandoro/reports/coverage/) | [Testes E2E (Playwright)](https://lleitep3.github.io/pomandoro/reports/e2e/)

O App foi reescrito com tecnologias atuais como forma de estudo.

## 🚀 Stack Tecnológica

- **Framework**: [Svelte 5](https://svelte.dev/) (usando runes: `$state`, `$derived`)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Testes Unitários**: [Vitest](https://vitest.dev/) (Cobertura > 90%)
- **Testes E2E**: [Playwright](https://playwright.dev/)
- **CI/CD**: GitHub Actions e GitHub Pages
- **Acessibilidade**: Atalhos de teclado (ESC) e navegação lógica.

## ✨ Principais Funcionalidades

- **Cronômetro Pomodoro**: Sessões de foco e pausas customizáveis.
- **Gestão de Tarefas**: CRUD completo com níveis de prioridade e reordenação.
- **Persistência Total**: Suas tarefas, configurações e até o estado do timer em execução sobrevivem ao refresh da página.
- **Design Responsivo**: Interface otimizada para Desktop e dispositivos Mobile.
- **Internacionalização**: Suporte para Português (PT-BR), Inglês (EN) e Espanhol (ES).
- **Temas**: Suporte a modo Escuro/Claro com sincronização de preferência do sistema.
- **Visualização Flexível**: Modo de visão compacta para minimizar distrações.
- **Histórico de Atividades**: Acompanhamento de todas as sessões concluídas.
- **Modo Zen**: Interface minimalista focada apenas no timer e na tarefa atual.

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
