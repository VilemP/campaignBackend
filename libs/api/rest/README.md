# REST API Library

Core types and utilities for building REST APIs.

## Purpose

This library provides:
- Type definitions for HTTP endpoints
- Integration with validation and CQRS patterns
- Common REST API utilities

## Design Decisions

1. **Current Implementation**:
   - Direct dependencies on validation and CQRS libraries
   - Type-safe endpoint definitions
   - Support for OpenAPI metadata

2. **Planned Improvements**:
   - Remove direct library dependencies using dependency inversion
   - Make interfaces generic over validation and command types
   - Let consumers provide concrete implementations

## Usage

```typescript
import { HttpEndpoint } from '@libs/api-rest';
import { Command } from '@libs/cqrs';
import { Schema } from '@libs/validation';

export const endpoint: HttpEndpoint = {
    method: 'POST',
    path: '/resources',
    command: MyCommand,
    schema: mySchema,
    responses: {
        201: { description: 'Resource created' }
    },
    createPayload: (req) => req.body
};
```

## Future Considerations

- Remove direct dependencies on other libraries
- Add middleware support
- Add request/response utilities
- Improve OpenAPI integration
- Add common REST patterns (HATEOAS, etc.) 