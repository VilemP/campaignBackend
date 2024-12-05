# CQRS Library

This library provides core interfaces and types for implementing the Command Query Responsibility Segregation (CQRS) pattern.

## Purpose

CQRS separates read and write operations into different models:
- Commands: Change the system state (write operations)
- Queries: Retrieve data (read operations)

This separation allows for:
- Different optimization strategies for reads and writes
- Better scalability
- Clearer domain boundaries
- Simpler command validation and business rules

## Design Decisions

1. **Async by Default**: All operations return Promises to support both sync and async implementations
2. **Minimal Interface**: Core interfaces are kept minimal to allow flexibility in implementation
3. **No Implementation Details**: The library provides only interfaces, leaving implementation details to the consuming application
4. **Framework Agnostic**: No dependencies on specific frameworks or libraries

## Usage

### Commands

Commands represent operations that change the system state. They should be used for write operations.

```typescript
import { Command } from '@libs/cqrs';

export class CreateUserCommand implements Command {
    constructor(private readonly userData: UserData) {}
    
    async execute(): Promise<void> {
        // Implementation
    }
}
```

### Best Practices

Commands should:
- Have a clear, intention-revealing name (e.g., `CreateUserCommand`, not `UserCommand`)
- Be immutable (use readonly properties)
- Validate input in the constructor
- Return void
- Handle one business operation

## Future Considerations

- Query interfaces for read operations
- Command/Query bus abstractions
- Result types for operations that need to return data