# Domain Library

This library contains core domain building blocks and patterns for Domain-Driven Design (DDD).

## Concepts

### Entity
Base class for domain objects that have a unique identity. The identity defines their equality, not their attributes.

### AggregateRoot
Specialized entity that forms a consistency boundary for a group of related entities and value objects.

### DomainEvent
Represents something meaningful that happened in the domain. Pure business concept with no technical metadata.

### ValueObject
Base class for domain objects that don't have identity - their equality is defined by their attributes.

## Usage

```typescript
import { DomainEvent, Entity, AggregateRoot, ValueObject } from '@domain';

// Define a domain event
class CustomerRegistered implements DomainEvent {
  constructor(
    public readonly customerId: string,
    public readonly email: string
  ) {}
}

// Create an aggregate root
class Customer extends AggregateRoot {
  // Implementation
}
```

## Testing

```bash
nx test domain
```