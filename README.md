# ☕ Coffee Machine Project

> A hands-on TDD kata — implement the logic that translates customer orders into drink maker protocol commands.

## Overview

The **Coffee Machine Project** is a progressive kata designed to learn and practice **Test Driven Development (TDD)**.  
The rules are simple and non-negotiable:

1. **All production code is written to make a failing test pass**
2. **Do the simplest thing that could work for the current iteration**

## What You're Building

You implement the **business logic** that converts customer orders into commands for the **drink maker**.  
Think of it as a translator: customer intent → drink maker protocol.

> ℹ️ You do **not** implement the customer UI.  
> ℹ️ You do **not** implement the drink maker itself — it's an imaginary engine.  
> ✅ You **only** build the message-building logic in between.

## Tech Stack

| Tool | Purpose |
|------|---------|
| **Node.js** | Runtime |
| **TypeScript** | Language |
| **Vitest** | Test runner (TDD-first) |

## TDD Rules (Strict)

- 🔴 **Red** — Write a failing test first. No exception.
- 🟢 **Green** — Write the minimum production code to make it pass.
- 🔵 **Refactor** — Clean up, keeping all tests green.

Never write production code without a failing test calling for it.

## Iterations

The project grows feature by feature through 5 iterations (~110 min total):

| # | Name | Estimated Time | Focus |
|---|------|---------------|-------|
| 1 | **Making Drinks** | ~30 min | Translate orders to drink maker commands |
| 2 | **Going into Business** | ~20 min | Add pricing and money handling |
| 3 | **Extra Hot** | ~20 min | Support extra-hot drink options |
| 4 | **Making Money** | ~20 min | Handle insufficient funds |
| 5 | **Running Out** | ~20 min | Handle out-of-stock drinks |

> 🔗 Full iteration specs: [simcap.github.io/coffeemachine](https://simcap.github.io/coffeemachine/)

## Project Structure

```
coffee-machine/
├── src/
│   └── __tests__       # Test files (written first, always)
│   └── ...             # Production code (written only to pass a test)
├── .package.json
├── .tsconfig.json
├── .vitest.config.ts
├── .prettierrc         # linter file
├── .prettierignore     # linter file
├── .eslintrc.json      # linter file
├── .eslintignore       # linter file
└── README.md
```

## Getting Started

```bash

# install dependencies
pnpm install

# run lint
pnpm run format
pnpm run lint
pnpm run lint:fix

# run tests in watch mode (your TDD loop)
pnpm run test:watch

# run tests once
pnpm run test your-file.spec.ts

# run tests coverage
pnpm run test:coverage
```

## Guiding Principles

- **One test at a time.** Focus on the red → green → refactor cycle.
- **No gold plating.** Implement only what the current test demands.
- **Intention-revealing names.** Code should read like a spec.
- **Tests are documentation.** A passing test suite = a living spec of the system.

***

*Ready? Start with iteration 1. Your product owner is waiting.* 🚀