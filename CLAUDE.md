# Claude Ralph Loop

Autonomous AI agent orchestration system for executing PRDs (Product Requirements Documents).

## Key Directories

- `scripts/ralph/` - Ralph agent runner and configuration
- `scripts/ralph/prds/<name>/` - Isolated PRD instances (prd.json, progress.txt)
- `docs/prds/` - PRD source markdown files

## Running Ralph

```bash
cd scripts/ralph
./ralph.sh --prd <name> [max_iterations]

# Examples:
./ralph.sh --prd testing 10
./ralph.sh --prd mateo-site 5
```

Each PRD runs in complete isolation with its own state, logs, and archives.

## Project Structure

This is a Next.js application with:
- Prisma for database
- TypeScript throughout
- Playwright for testing
