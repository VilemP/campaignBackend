# API Layer

This layer implements the application's public API following Command Query Responsibility Segregation (CQRS) principles. Commands and queries are handled differently to optimize for their distinct requirements - commands for consistency and business rules enforcement, queries for flexibility and evolution.

## Command Side Design

The write side of our API is implemented using self-contained command objects.

### Command-Based API
Each business operation is encapsulated in a standalone command class that:
- Has a clear, single responsibility
- Validates its input using a schema
- Produces domain events rather than directly mutating state
- Is protocol-agnostic and can be invoked through different transport mechanisms

Example structure:
```typescript
// CreateCampaignCommand.ts
export class CreateCampaignCommand {
    constructor(payload: ValidatedPayload, repository: CampaignRepository) {
        schema.validate(payload);
    }
    async execute(): Promise<void> {
        // Business logic
    }
}
```

### Protocol Independence
While we currently expose our commands via HTTP endpoints, the commands themselves are unaware of the transport protocol. The HTTP endpoint definitions are maintained alongside commands for developer convenience, but this is purely an organizational choice.

This separation allows us to:
- Add new transport protocols (like gRPC) without modifying commands
- Change how we organize code without affecting the architecture
- Test commands independently of the transport layer
- Potentially move endpoint definitions if a different organization makes more sense

Example of protocol-specific configuration:
```typescript
// http/endpoints/campaign.ts
export const endpoints: HttpEndpoint[] = [{
    method: 'POST',
    path: '/campaigns',
    command: CreateCampaignCommand,
    schema,
    createPayload: (req) => ({
        // HTTP-specific request mapping
    })
}];
```

### Schema-Driven Development
Each command defines its input schema which serves three purposes:
1. Runtime validation of incoming requests
2. TypeScript type inference for compile-time safety
3. OpenAPI documentation generation

This ensures our API documentation is always in sync with the implementation and provides strong type safety throughout the request handling flow.

## Query Side Design

The read side follows different patterns optimized for data retrieval and API evolution:

### Query Objects
Each query is a standalone class with a simple interface:
```typescript
interface Query<TResult> {
    execute(): Promise<TResult>;
}
```

### Flexible Input Validation
Queries use a more permissive validation approach for inputs to allow API evolution:
```typescript
const inputSchema = Schema.input({
    id: Schema.string().uuid().build()
});
```

This uses our own Schema abstraction which encapsulates the underlying validation library, making it easier to:
- Maintain consistent validation patterns across the application
- Change validation libraries without touching business logic
- Keep validation error messages consistent

### Hypermedia-Driven Responses
Query responses include _links sections to enable API discovery and evolution:
```typescript
{
    "id": "123",
    "name": "Summer Campaign",
    "status": "ACTIVE",
    "_links": {
        "self": { "href": "/campaigns/123" },
        "metrics": { "href": "/campaign-metrics/123" }
    }
}
```

### Domain Boundaries
Each domain owns its URL structure, with cross-domain links handled through interfaces:
```typescript
interface LinkBuilder {
    buildResourceLink(resource: string, params: Record<string, string>): string;
}
```

## Directory Structure
```
api/
├── commands/              # Command implementations with schemas
├── queries/              # Query implementations with output schemas
├── http/                 # HTTP-specific configuration and server setup
└── validation/           # Shared validation infrastructure
```

## Key Benefits

### Command Side
- Clear separation between transport protocols and business logic
- Guaranteed API documentation accuracy
- Strong type safety from client to domain
- Easy to add new commands without touching existing code

### Query Side
- Evolvable API through hypermedia controls
- Clear domain boundaries and ownership
- Flexible input validation for backward compatibility
- Discoverable API structure

### Shared Benefits
- Clean separation of read and write concerns
- Protocol independence through proper abstractions
- Support for contract testing and verification
- Easy to modify or extend without breaking clients