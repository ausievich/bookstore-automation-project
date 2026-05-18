# bookstore-automation-project

Playwright + TypeScript test automation for the **Online Bookstore** mock application.

## Stack

- Playwright Test, TypeScript (strict)
- Page Object Model + Steps layer
- Allure reporting
- Axios API clients (Controller / Builder / Flow)
- ESLint + `eslint-plugin-playwright`
- Mock app: static HTML UI + Express REST API

## Quick start

```bash
npm install
npx playwright install chromium
npm test
```

## Allure report

**Prerequisite:** [JDK 17+](https://adoptium.net/) (required by `allure-commandline` to build the HTML report).  
`npm run allure:*` auto-detects a local JDK if `JAVA_HOME` is missing or invalid. If you see `JAVA_HOME is set to an invalid directory`, remove the broken user/system `JAVA_HOME` variable in Windows environment settings (a bad value like `= 1>&2` breaks the Allure CLI).

Run tests, generate the report, and open it in the browser:

```bash
npm run report
```

Or step by step (e.g. re-open an existing report without re-running tests):

```bash
npm test
npm run allure:generate
npm run allure:open
```

| Output | Description |
|--------|-------------|
| `allure-results/` | Raw results from the last `npm test` (gitignored) |
| `allure-report/` | Generated HTML report (gitignored) |

Tests attach **owner** and **feature** labels via `allure` in `@automation/main/common/annotations` — use the **Behaviors** tab in the report to browse by feature.

## Demo application

| URL | Description |
|-----|-------------|
| http://localhost:3000/login.html | Login (`user@bookstore.test` / `password123`) |
| http://localhost:3000/catalog.html | Book catalog |
| http://localhost:3000/cart.html | Shopping cart |
| http://localhost:3000/checkout.html | Multi-step checkout |

API base: `http://localhost:3000/api/*`

Start server only: `npm run server`

## Project layout

```
automation/src/main/ui/     # Pages, Steps, Locators, Models
automation/src/main/api/    # Clients, Controllers, Builders, Flows
automation/src/test/        # Specs + fixtures
demo/                       # Static UI
mock-server/                # Express API + in-memory store
```

Path alias: `@automation/*` → `automation/src/*`

## Tests

- **UI** (4 specs): login, search/filter, cart, checkout
- **API** (3 specs): books CRUD, cart, orders

Test state is reset via `POST /api/test/reset` before each test.

## Architecture

```mermaid
flowchart LR
  subgraph tests
    UI[UI Specs]
    API[API Specs]
  end
  subgraph framework
    Steps[Steps]
    POM[Page Objects]
    Ctrl[API Controllers]
  end
  subgraph app
    HTML[Demo HTML]
    SRV[Express API]
  end
  UI --> Steps --> POM --> HTML
  API --> Ctrl --> SRV
  HTML --> SRV
```

## Remaining / bonus (optional)

- [ ] GitHub Actions CI
- [ ] Docker Compose
- [ ] Visual regression
- [ ] TestRail reporter (live integration)
