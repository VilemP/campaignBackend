# Commands

This directory contains command implementations for modifying domain state. Commands are part of our CQRS implementation, focusing on the write side of operations.

## Design Principles

1. **Self-Contained Execution**
   - Each command is a class implementing `Command<TResult>`
   - No separate handlers needed - command executes itself
   - Dependencies injected through constructor
   ```typescript
   export class CreateCampaignCommand implements Command<void> {
       constructor(
           payload: unknown,
           private readonly campaignRepository: CampaignRepository
       ) {
           this.payload = schema.validate(payload);
       }

       async execute(): Promise<void> {
           // Implementation
       }
   }
   ```

2. **Schema Validation**
   - Strict validation on both input and output
   - Validation happens in constructor
   - Schema defines TypeScript types
   ```typescript
   const schema = Schema.object({
       name: Schema.string().min(3).max(100),
       businessType: Schema.enum(['RETAIL', 'ECOMMERCE', 'SERVICE'])
   });

   type CreateCampaignPayload = Schema.infer<typeof schema>;
   ```

3. **Domain Model Interaction**
   - Commands orchestrate business operations
   - Load entities through repositories
   - Call domain methods to make state changes
   - Domain entities handle business rules and event production
   ```typescript
   async execute(): Promise<void> {
       const campaign = Campaign.create(
           this.idGenerator.generate(),
           this.payload.name,
           this.payload.businessType
       );
       await this.repository.save(campaign);
   }
   ```

4. **Protocol Independence**
   - Commands are pure business operations
   - No knowledge of transport protocol
   - Allows for multiple invocation methods (HTTP, gRPC, etc.)

   While commands themselves are protocol-agnostic, we co-locate endpoint definitions with commands for better developer experience:
   ```typescript
   export const endpoint: HttpEndpoint = {
       method: 'POST',
       path: '/campaigns',
       command: CreateCampaignCommand,
       schema
   };
   ```

   This co-location is purely for developer convenience:
   - Single file to update when working on a command
   - No need to jump between files for related changes
   - Practical approach since commands typically have one primary way of being called
   - Simpler maintenance when command and its invocation change together

## File Organization

Each command consists of two files:
- `CommandName.ts` - Implementation
- `CommandName.spec.ts` - Tests

## Testing Approach

Tests should cover:
1. Input validation
2. Business rules
3. Domain interactions
4. Error conditions

Example test structure:
```typescript
describe('CreateCampaignCommand', () => {
    describe('validation', () => {
        it('should validate required fields', () => {
            expect(() => new CreateCampaignCommand({
                // missing required fields
            })).toThrow(ValidationError);
        });
    });

    describe('execute', () => {
        it('should create campaign with valid data', async () => {
            const command = new CreateCampaignCommand({
                name: 'Test Campaign',
                businessType: 'RETAIL'
            });
            await command.execute();
            // Verify repository was called correctly
        });
    });
});
```

## Common Patterns

1. **Entity Creation**
```typescript
async execute(): Promise<void> {
    const campaign = Campaign.create(
        this.idGenerator.generate(),
        this.payload.name,
        this.payload.businessType
    );
    await this.repository.save(campaign);
}
```

2. **Entity Update**
```typescript
async execute(): Promise<void> {
    const campaign = await this.repository.load(this.payload.id);
    if (!campaign) {
        throw new EntityNotFoundError('Campaign', this.payload.id);
    }
    
    campaign.update(this.payload);
    await this.repository.save(campaign);
}
```

3. **Error Handling**
```typescript
if (!this.authorizationService.canUpdate(campaign)) {
    throw new NotAuthorizedError('Cannot update campaign');
}
```

## Anti-Patterns to Avoid

1. ❌ **Don't bypass domain model**
```typescript
// Bad
await this.db.update('campaigns', { id, status: 'PAUSED' });

// Good
const campaign = await this.repository.load(id);
campaign.pause();
await this.repository.save(campaign);
```

2. ❌ **Don't mix command and query responsibilities**
```typescript
// Bad
async execute(): Promise<CampaignDetails> {
    await this.repository.save(campaign);
    return this.campaignQuery.getDetails(campaign.getId());
}

// Good
async execute(): Promise<void> {
    await this.repository.save(campaign);
}
```

3. ❌ **Don't skip validation**
```typescript
// Bad
constructor(payload: CreateCampaignPayload) {
    this.payload = payload;
}

// Good
constructor(payload: unknown) {
    this.payload = schema.validate(payload);
}
```

4. ❌ **Don't handle events in commands**
```typescript
// Bad
campaign.on('businessTypeChanged', event => {
    this.notificationService.notify(event);
});

// Good
// Let the domain events be handled by proper subscribers
```

## Further Reading
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Command Pattern](https://en.wikipedia.org/wiki/Command_pattern)