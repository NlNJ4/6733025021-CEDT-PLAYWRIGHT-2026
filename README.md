# 6733025021-CEDT-PLAYWRIGHT-2026

## Assignment 3: Page Object Model

- Added `assignment/EX03-pom.spec.ts` for **make appointment success** using Page Object Model.
- Base URL is configured with environment variable `BASE_URL` in `playwright.config.ts`.

### Run locally

1. Copy `.env.example` to `.env` and update `BASE_URL` if needed.
2. Run tests:

```bash
pnpm test
```

## Assignment 4: Continuous Testing (GitHub Actions)

- Workflow file: `.github/workflows/playwright.yml`
- Trigger: push / pull request
- Action: installs dependencies, installs Playwright browsers, runs all specs, uploads report artifact

### Push to your remote repository

```bash
git remote add origin <your-repository-url>
git add .
git commit -m "Add EX03 POM test and CI workflow"
git push -u origin main
```
