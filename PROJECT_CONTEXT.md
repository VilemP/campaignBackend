# Project Context

## Repository Structure
- Nx monorepo structure
- Main application in `apps/campaign-backend`
- Shared libraries in `libs/` (e.g., reporting/link-builder)
- Event sourcing architecture with CQRS

## Development Setup
- Using Vitest instead of Jest
- Pact.io for contract testing
- Node.js v18.17.0 (see .nvmrc)

## MCP GitHub Integration Notes
For file modifications:
- Use `push_files` function instead of `create_or_update_file`
- No need to manually handle base64 encoding
- Example:
```typescript
{
  "files": [{
    "path": "file/path",
    "content": "file content as string"
  }],
  "message": "commit message",
  "branch": "branch name"
}
```

## Important Decisions
1. Using Nx to support:
   - Future microservices
   - Clean separation between apps and libraries
   - Efficient build and test caching
   - Different testing tools per project

2. Chosen Vitest over Jest for:
   - Better performance
   - Native ESM support
   - Better TypeScript integration

3. Event Sourcing Implementation:
   - Pure domain model
   - Events as source of truth
   - Clean separation of domain and infrastructure

4. Dependencies with Reporting:
   - Link builder functionality in `libs/reporting/link-builder`
   - Shared through internal library
   - Clear API boundaries

5. GitHub Integration:
   - Using MCP (Model Context Protocol)
   - Prefer `push_files` over `create_or_update_file`
   - Permissions need: Contents R/W access