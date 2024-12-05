# Campaign Management Backend

This backend application provides a RESTful API for managing advertising campaigns. It uses event sourcing for maintaining campaign state and history.

## Getting Started

### Prerequisites
- Node.js >= 18
- pnpm >= 8.0
- Docker (for local development)

### Development Setup
```bash
# Install dependencies from monorepo root
pnpm install

# Start the development server
nx serve campaign-backend

# Run tests
nx test campaign-backend

# Run e2e tests
nx e2e campaign-backend
```

## Project Structure

```
src/
├── api/           # API layer (commands and queries)
├── domain/        # Domain model and business logic
├── persistence/   # Event sourcing persistence
└── test/         # Test files
```

## Documentation

### Implementation Guides
- [Command Implementation Guide](./docs/Command%20Implementation%20Guide.md)
- [Query Design and Implementation Guide](./docs/Query%20Design%20and%20Implementation%20Guide.md)
- [HTTP Types and Endpoint Configuration](./docs/HTTP%20Types%20and%20Endpoint%20Configuration.md)
- [Schema Validation and OpenAPI Integration](./docs/Schema%20Validation%20and%20OpenAPI%20Integration.md)

## Deployment

The application supports multiple deployment strategies:
- Containerized service (Kubernetes/ECS)
- Serverless functions (AWS Lambda)

For deployment instructions, see [Deployment Guide](./docs/deployment.md)