# Campaign Management System

An event-sourced backend service for campaign management using CQRS principles.

## Project Structure

```
campaign-management/
├── apps/
│   └── campaign-backend/       # Main campaign management service
│       ├── src/
│       │   ├── domain/        # Domain model and events
│       │   ├── infrastructure/# Event sourcing and persistence
│       │   ├── api/          # HTTP API and validation
│       │   └── index.ts      # Application entry point
│       ├── test/
│       └── project.json
├── libs/
│   └── reporting/            # Shared reporting functionality
│       └── link-builder/     # Campaign link building library
└── nx.json
```

## Getting Started

### Prerequisites

- Node.js 18.17.0 or higher
- npm 9.x.x

### Installation

```bash
npm install
```

### Development

```bash
# Start the development server
npm run start

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Format code
npm run format
```

### Project Graph

To visualize the project dependency graph:

```bash
npm run graph
```

## Testing

The project uses Vitest for testing and includes:
- Unit tests
- Integration tests
- Contract tests (Pact.io)

### Running Contract Tests

```bash
npm run test:pact
```

## Architecture

### Event Sourcing

The system uses event sourcing for state management:
- All state changes are captured as events
- Events are the source of truth
- State is reconstructed from event stream

### CQRS

The system follows Command Query Responsibility Segregation:
- Commands modify state
- Queries read state
- Separate models for reading and writing

### Domain-Driven Design

The project structure follows DDD principles:
- Rich domain model
- Bounded contexts
- Aggregates and entities
- Domain events

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Create a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details
