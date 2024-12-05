# Enterprise Monorepo

This is a monorepo powered by Nx build system, hosting enterprise microservices and shared libraries. The repository is structured to promote code reuse while maintaining clear boundaries between different parts of the system.

## Project Structure

```
├── apps/                      # Application projects
│   └── campaign-backend/      # Example: Campaign management service
├── libs/                      # Shared libraries
│   ├── api/                  # API related utilities and contracts
│   ├── event-sourcing/       # Event sourcing infrastructure
│   └── reporting/           # Reporting and analytics utilities
├── tools/                    # Development and build tools
└── nx.json                   # Nx configuration
```

### Applications
- [Campaign Management Backend](./apps/campaign-backend/README.md) - Event-sourced campaign management service

## Technical Stack

### Core Technologies
- **Nx**: Monorepo build system providing efficient build orchestration and dependency management
- **TypeScript**: Primary development language
- **Vitest**: Modern, ESM-first test runner chosen for its speed and Nx integration
- **Zod**: Schema validation and type inference
- **OpenAPI**: API documentation and contract definition
- **Pact.io**: Consumer-driven contract testing

### Development Tools
- **pnpm**: Fast, disk space efficient package manager
- **ESLint**: TypeScript-aware linting
- **Prettier**: Code formatting
- **Husky**: Git hooks for code quality

## Library Design Principles

1. **Library Independence**
   - Libraries should be as independent as possible
   - Dependencies between libraries should be minimized
   - Cross-library dependencies must be explicitly documented

2. **Application Dependencies**
   - Applications should depend on libraries, not other applications
   - Direct dependencies between applications are discouraged
   - Use shared libraries for common functionality

3. **Library Categories**
   - **api**: Contracts, DTOs, and API-related utilities
   - **event-sourcing**: Event sourcing primitives and infrastructure
   - **reporting**: Analytics and reporting tools
   - Consider creating new categories for distinct domains

## Development Workflow

### Prerequisites
- Node.js >= 18
- pnpm >= 8.0

### Getting Started
```bash
# Install dependencies
pnpm install

# Generate a new library
nx g @nx/node:lib new-lib-name

# Generate a new application
nx g @nx/node:app new-app-name

# Run tests
nx test lib-name
nx test app-name

# Build specific project
nx build project-name

# Run affected tests
nx affected:test
```

## Testing Strategy

We use Vitest as our primary testing framework for:
- Fast execution with native ESM support
- Watch mode with instant feedback
- Seamless Nx integration
- Built-in coverage reporting

### Contract Testing
Contract testing with Pact.io ensures API compatibility:
```bash
# Run contract tests
nx run-many --target=pact

# Verify contracts
nx run-many --target=pact-verify
```

## Creating New Libraries

When creating a new library:
1. Identify the appropriate category
2. Use Nx generators for consistency
3. Document public API
4. Include README.md with usage examples
5. Add appropriate test coverage

Example:
```bash
# Generate new library in the api category
nx g @nx/node:lib my-feature --directory=libs/api/my-feature

# Generate new library in a new category
nx g @nx/node:lib my-feature --directory=libs/new-category/my-feature
```

## Deployment

Projects support multiple deployment strategies:

### Container-based
- Multi-stage Dockerfile provided
- Docker Compose for local development
- Kubernetes configurations available

### Serverless
- AWS Lambda compatible
- Serverless Framework configurations
- API Gateway integration

## Further Reading

- [Library Development Guide](./docs/lib-development.md)
- [Application Development Guide](./docs/app-development.md)
- [Testing Best Practices](./docs/testing.md)
- [Deployment Guide](./docs/deployment.md)