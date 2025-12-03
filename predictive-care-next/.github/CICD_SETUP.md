# CI/CD Setup Guide

This project uses GitHub Actions for continuous integration and deployment to Vercel.

## Pipeline Overview

The CI/CD pipeline includes:

1. **Code Quality** - Runs ESLint and TypeScript type checking
2. **Build Test** - Ensures the application builds successfully
3. **Preview Deployment** - Deploys PR branches to preview URLs
4. **Production Deployment** - Deploys main branch to production

## Required GitHub Secrets

You need to configure the following secrets in your GitHub repository:

### 1. Get Vercel Token

1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Name it (e.g., "GitHub Actions")
4. Copy the token

### 2. Get Vercel Project & Org IDs

Run this command locally in your project directory:

```bash
vercel link
```

This creates a `.vercel/project.json` file with your IDs:

```json
{
  "orgId": "your-org-id",
  "projectId": "your-project-id"
}
```

### 3. Add Secrets to GitHub

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add the following secrets:

| Secret Name | Description |
|-------------|-------------|
| `VERCEL_TOKEN` | Your Vercel API token |
| `VERCEL_ORG_ID` | Your Vercel organization/team ID |
| `VERCEL_PROJECT_ID` | Your Vercel project ID |

## Workflow Triggers

- **Push to `main`**: Triggers production deployment
- **Push to `develop`**: Triggers code quality and build checks
- **Pull Request to `main`**: Triggers preview deployment with URL comment

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run linting
npm run lint

# Build for production
npm run build
```

## Environment Variables

For local development, create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production, configure environment variables in Vercel dashboard.
