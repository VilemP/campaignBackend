# Commands

This directory contains command implementations for modifying domain state. Commands are part of our CQRS implementation, focusing on the write side of operations.

## Design Principles

1. **Self-Contained Execution with Simplified Testing**
   - Each command is a class implementing `Command<TPayload>`
   - No separate handlers needed - command executes itself
   - Dependencies injected through constructor, payload passed to execute
   - This separation simplifies testing by:
     - Avoiding complex constructor mocking and setup
     - Making it easier to test different payload scenarios
     - Allowing reuse of command instance across test cases
     - Keeping test setup focused on the data being tested
   ```typescript
   // Easy to test - create once, test multiple scenarios
   export class CreateCampaignCommand implements Command<CampaignData> {
       constructor(private readonly repository: CampaignRepository) {}

       async execute(data: CampaignData): Promise<void> {
           const payload = campaignSchema.validate(data);
           // Implementation
       }
   }

   // In tests:
   const command = new CreateCampaignCommand(mockRepository);
   await command.execute(scenario1Data);
   await command.execute(scenario2Data);
   // No need to recreate command instance for each test
   ```

2. **Schema Validation**
   - Strict validation on input data
   - Validation happens in execute method
   - Schema defines TypeScript types
   ```typescript
   export const campaignSchema = Schema.object({
       id: Schema.string(),
       name: Schema.string(),
       businessType: Schema.nativeEnum(BusinessType)
   });

   export type CampaignData = InferSchemaType<typeof campaignSchema>;
   ```

3. **Domain Model Interaction**
   - Commands orchestrate business operations
   - Load entities through repositories
   - Call domain methods to make state changes
   - Domain entities handle business rules and event production
   ```typescript
   async execute(data: CampaignData): Promise<void> {
       const payload = campaignSchema.validate(data);
       const id = new CampaignId(payload.id);
       await this.repository.createCampaign(
           id,
           payload.name,
           payload.businessType
       );
   }
   ```

4. **Protocol Independence**
   - Commands are pure business operations
   - No knowledge of transport protocol
   - Allows for multiple invocation methods (HTTP, gRPC, etc.)

   Commands and their endpoints are co-located in feature folders for better developer experience:
   ```typescript
   export const endpoint: CommandHttpEndpoint<CampaignData, CampaignRepository> = {
       method: 'POST',
       path: '/campaigns',
       command: CreateCampaignCommand,
       schema: campaignSchema,
       responses: {
           success: { code: 201, response: { description: 'Campaign created successfully' } }
       }
   };
   ```

## File Organization

Each command is organized in a feature folder:
```
CreateCampaign/
├── Command.ts         - Command implementation
├── Command.test.ts    - Command unit tests
├── endpoint.ts        - HTTP endpoint definition
├── endpoint.test.ts   - Endpoint integration tests
└── index.ts          - Public exports
```

## Testing Approach

Tests are split into multiple layers:
1. **Command Unit Tests** (`Command.test.ts`)
   - Business logic
   - Domain interactions
   - Tries to avoid testing the repository usage but focuses on the outcomes
   
2. **Endpoint Tests** (`endpoint.test.ts`)
   - Command execution verification
   - Tests how the http request is adapted to the command execution



## Common Patterns

1. **Command Structure**
```typescript
export class SomeCommand implements Command<SomeData> {
    constructor(private readonly dependencies: Dependencies) {}

    async execute(data: SomeData): Promise<void> {
        const payload = schema.validate(data);
        // Business logic implementation
    }
}
```

2. **Endpoint Definition**
```typescript
export const endpoint: CommandHttpEndpoint<SomeData, Dependencies> = {
    method: 'POST',
    path: '/resource',
    command: SomeCommand,
    schema: someSchema,
    responses: {
        success: { code: 201, response: { description: 'Success message' } }
    }
};
```

## Anti-Patterns to Avoid

1. ❌ **Don't mix payload and dependencies in constructor**
```typescript
// Bad
constructor(payload: unknown, repository: Repository) {
    this.payload = schema.validate(payload);
}

// Good
constructor(repository: Repository) {}
async execute(data: Data): Promise<void> {
    const payload = schema.validate(data);
}
```

2. ❌ **Don't bypass domain model**
```typescript
// Bad
await this.db.update('campaigns', { id, status: 'PAUSED' });

// Good
const campaign = await this.repository.load(id);
campaign.pause();
await this.repository.save(campaign);
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