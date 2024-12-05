# REST API Library

Core types and utilities for building REST APIs with HATEOAS support.

## Purpose

This library provides:
- Type definitions for HTTP endpoints
- HATEOAS (Hypermedia as the Engine of Application State) support
- Integration with validation and CQRS patterns
- Common REST API utilities

## Design Decisions

1. **HATEOAS Support**:
   - Links in responses for resource navigation
   - Standardized link relations
   - Resource-oriented responses

2. **Type Safety**:
   - Generic interfaces for payloads
   - Type-safe endpoint definitions
   - Support for OpenAPI metadata

3. **Dependency Abstraction**:
   - Interfaces for validation and commands
   - No direct dependency on implementation details
   - Flexible integration points

## Usage

### Defining Endpoints

```typescript
import { HttpEndpoint } from '@libs/api-rest';

export const endpoint: HttpEndpoint<CreateResourcePayload> = {
    method: 'POST',
    path: '/resources',
    command: CreateResourceCommand,
    schema: createResourceSchema,
    responses: {
        201: {
            description: 'Resource created',
            links: [
                {
                    rel: 'self',
                    href: '/resources/{id}',
                    method: 'GET'
                }
            ]
        }
    },
    createPayload: (req) => req.body
};
```

### Resource Responses

```typescript
interface ResourceResponse<T> {
    data: T;
    links: Link[];  // HATEOAS links
}
```

## Best Practices

1. Always include HATEOAS links in responses
2. Use standard link relations where possible
3. Make endpoints type-safe with generics
4. Document responses with OpenAPI metadata
5. Keep payload transformation simple in createPayload

## Future Considerations

- Middleware support for common patterns
- Request/response utilities
- Enhanced OpenAPI integration
- Link relation registry
- Resource composition utilities 