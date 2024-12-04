# Queries

This directory contains query implementations for retrieving data from our domain. Queries are part of our CQRS implementation, focusing on the read side of operations.

## Design Principles

1. **Self-Contained Execution**
   - Each query is a class implementing `Query<TResult>`
   - No separate handlers needed - query executes itself
   - Dependencies injected through constructor
   ```typescript
   export class GetCampaignQuery implements Query<CampaignResponse> {
       constructor(
           payload: unknown,
           private readonly campaignRepository: CampaignRepository,
           private readonly linkBuilder: LinkBuilder
       ) {
           this.payload = inputSchema.validate(payload);
       }

       async execute(): Promise<CampaignResponse> {
           // Implementation
       }
   }
   ```

2. **Schema Validation**
   - Input validation is permissive (allows evolution)
   - Output validation is strict (ensures consistency)
   ```typescript
   // Input schema - more forgiving
   const inputSchema = new InputSchema(
       Schema.object({
           id: Schema.string().uuid()
       })
   );

   // Output schema - strict
   const outputSchema = new OutputSchema(
       Schema.object({
           id: Schema.string().uuid(),
           name: Schema.string().min(1),
           status: Schema.enum(['ACTIVE', 'PAUSED', 'ENDED'])
       })
   );
   ```

3. **Hypermedia-Driven Responses**
   - Each response includes `_links` section
   - Links are conditional based on state
   - URLs are never hardcoded
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

4. **Domain Boundaries**
   - Each domain owns its URL structure
   - Cross-domain links handled through interfaces
   - Implementation details hidden from queries

## File Organization

Each query consists of two files:
- `QueryName.ts` - Implementation
- `QueryName.spec.ts` - Tests

## Testing Approach

Tests should cover:
1. Input validation
2. Output validation
3. Domain logic
4. Link generation
5. Error handling

Example test structure:
```typescript
describe('GetCampaignQuery', () => {
    describe('input validation', () => {
        // Input validation tests
    });

    describe('execute', () => {
        // Core functionality tests
    });

    describe('output validation', () => {
        // Response structure tests
    });
});
```

## Common Patterns

1. **Response Building**
```typescript
private buildResponse(campaign: Campaign): CampaignResponse {
    return {
        id: campaign.getId(),
        name: campaign.getName(),
        _links: {
            self: { 
                href: this.linkBuilder.buildResourceLink('campaign', { id: campaign.getId() })
            }
        }
    };
}
```

2. **Error Handling**
```typescript
if (!campaign) {
    throw new EntityNotFoundError('Campaign', id);
}
```

3. **Conditional Links**
```typescript
if (campaign.status === 'ACTIVE') {
    response._links.metrics = { 
        href: this.linkBuilder.buildResourceLink('campaign.metrics', { id: campaign.getId() })
    };
}
```

## Anti-Patterns to Avoid

1. ❌ **Don't expose domain internals**
```typescript
// Bad
return {
    ...campaign.toJSON() // Leaks internal structure
};

// Good
return {
    id: campaign.getId(),
    name: campaign.getName()
};
```

2. ❌ **Don't hardcode URLs**
```typescript
// Bad
_links: {
    metrics: { href: `/api/metrics/${id}` }
}

// Good
_links: {
    metrics: { 
        href: this.linkBuilder.buildResourceLink('campaign.metrics', { id })
    }
}
```

3. ❌ **Don't skip validation**
```typescript
// Bad
return this.buildResponse(campaign);

// Good
const response = this.buildResponse(campaign);
return outputSchema.validate(response);
```

4. ❌ **Don't use validation libraries directly**
```typescript
// Bad
import { z } from 'zod';
const schema = z.object({...});

// Good
import { Schema } from '@campaign-backend/api/core';
const schema = Schema.object({...});
```

## Further Reading
- [Hypermedia as the Engine of Application State (HATEOAS)](https://en.wikipedia.org/wiki/HATEOAS)
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)
- [Input Validation Best Practices](https://owasp.org/www-project-web-security-testing-guide/v41/4-Web_Application_Security_Testing/07-Input_Validation_Testing/README)