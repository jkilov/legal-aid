# CI_CD.md

## Overview

This project uses Continuous Integration (CI) and Continuous Deployment (CD) to automatically verify code quality and deploy changes.

### CI Goals

Before code is merged into `main`:

- Install dependencies
- Run linting
- Run a production build
- Prevent broken code from being merged

### CD Goals

After code is merged into `main`:

- Automatically deploy the latest version of the application
- Ensure production always reflects the latest approved code

---

# Continuous Integration (CI)

## Workflow Location

```text
.github/workflows/ci.yml
```

## Trigger Events

The CI workflow runs when:

- A pull request is opened
- A pull request is updated
- Code is pushed to a branch

## CI Steps

### 1. Checkout Repository

Downloads the repository code into the GitHub Actions runner.

### 2. Setup Node.js

Installs Node.js version 24.

### 3. Install Dependencies

```bash
npm ci
```

Installs dependencies using the lock file.

### 4. Run Linter

```bash
npm run lint
```

Checks for code quality issues and linting errors.

### 5. Run Production Build

```bash
npm run build
```

Verifies that TypeScript compilation and Vite production build complete successfully.

---

# Branch Protection

The `main` branch is protected.

Requirements before merging:

- CI workflow must pass
- Pull request must be created
- Pull request must be approved (if enabled)

This helps prevent broken code from reaching production.

---

# Continuous Deployment (CD)

## Deployment Platform

Vercel

## Deployment Trigger

A deployment is automatically created when changes are merged into `main`.

## Deployment Process

1. GitHub receives merge to `main`
2. Vercel detects new commit
3. Vercel installs dependencies
4. Vercel builds application
5. Vercel deploys application

---

# Local Verification

Developers should run the same checks locally before opening a pull request.

Install dependencies:

```bash
npm install
```

Run linting:

```bash
npm run lint
```

Run production build:

```bash
npm run build
```

Start development server:

```bash
npm run dev
```

---

# Development Workflow

1. Create feature branch

```bash
git checkout -b feature/my-feature
```

2. Make changes

3. Commit changes

```bash
git add .
git commit -m "add feature"
```

4. Push branch

```bash
git push origin feature/my-feature
```

5. Open Pull Request

6. Wait for CI checks to pass

7. Merge Pull Request

8. Vercel deploys automatically

---

# Environment Variables

Required environment variables:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Production values are managed through Vercel project settings.

---

# Future Improvements

Potential CI/CD improvements:

- Automated testing
- Preview deployment validation
- End-to-end testing
- Security scanning
- Dependency vulnerability checks
- Automated release notes
