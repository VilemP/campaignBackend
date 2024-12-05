# Domain Layer

This directory contains our core domain model. It represents the business concepts and rules of our campaign management system, implemented following Domain-Driven Design principles.

## Key Design Principles

1. **Pure Domain Model**
   - No infrastructure concerns in domain classes
   - Business logic captured in explicit domain methods
   - Business rules enforced through method validation
   - Domain events represent significant state changes

2. **Domain Events**
   - Events represent significant state changes or business occurrences
   - Events are immutable facts about what happened in the domain
   - Named using past tense, reflecting business language
   - Contain data relevant to the business occurrence

   ```typescript
   // Events capture business facts in domain language
   new CampaignCreated('123', 'Summer Sale', 'RETAIL');
   new BusinessTypeChanged('123', 'RETAIL', 'ECOMMERCE');
   new CampaignPaused('123', 'Budget exceeded');
   ```

3. **State Management and Reconstruction**
   - Entity state can only be modified through business methods
   - Business methods enforce all invariants and rules
   - Each state change produces appropriate domain event

   The domain model faces a fundamental tension between state validity and reconstruction needs:
   ```typescript
   class Campaign extends DomainEntity {
       // Business methods - enforce rules, maintain validity
       changeBusinessType(newType: BusinessType): void {
           if (newType === this.businessType) {
               throw new Error('New business type must be different');
           }
           this.businessType = newType;
           this.emit(new BusinessTypeChanged(this.id, this.businessType, newType));
       }

       // Reconstruction from persistence - must trust the state
       static fromState(state: CampaignState): Campaign {
           return new Campaign(state.id, state.name, state.businessType);
       }
   }
   ```

   This design recognizes that:
   - Domain entities need some way to be reconstructed from persistence
   - This is similar to any ORM or persistence mechanism
   - We must trust that persisted state was valid when it was saved
   - Business rules are enforced on all new changes going forward
   - Applications can implement additional safety in their reconstruction strategy

4. **Factory Methods**
   - `create` for new entities - enforces all business rules
   - `fromState` for reconstruction from persistence state

## Implementation Guidelines

### Entities
- Extend `DomainEntity` for event capabilities
- Use private constructor
- Implement business methods that enforce rules
- Emit events for state changes

### Domain State
```typescript
// Simple interface for state
interface CampaignState {
    id: string;
    name: string;
    businessType: BusinessType;
}

// Application can implement safe state reconstruction
class EventSourcedCampaignState implements CampaignState {
    static fromEvents(events: CampaignEvent[]): CampaignState {
        // Build state safely through event application
    }
}
```

### Events
- Named in past tense
- Include only essential data
- Represent completed state changes
- Include timestamp from base class

## Common Patterns

1. **State Changes through Business Methods**
```typescript
public pause(reason: string): void {
    if (this.status !== 'ACTIVE') {
        throw new Error('Can only pause active campaigns');
    }
    this.status = 'PAUSED';
    this.emit(new CampaignPaused(this.id, reason));
}
```

2. **Business Rules in Methods**
```typescript
public addBudget(amount: Money): void {
    if (amount.value <= 0) {
        throw new Error('Budget increase must be positive');
    }
    this.budget = this.budget.add(amount);
    this.emit(new BudgetAdded(this.id, amount));
}
```

## Anti-Patterns to Avoid

1. ❌ **Don't expose behavior as data**
```typescript
// Bad
public getStatus(): CampaignStatus {
    return this.status;
}
public setStatus(status: CampaignStatus) {
    this.status = status;
}

// Good
public pause(reason: string): void {
    if (!this.canBePaused()) {
        throw new Error('Campaign cannot be paused in current state');
    }
    this.status = 'PAUSED';
    this.emit(new CampaignPaused(this.id, reason));
}
```

2. ❌ **Don't depend on infrastructure**
```typescript
// Bad
class Campaign extends DomainEntity {
    constructor(
        private validator: HttpClient,  // Infrastructure dependency
    ) {
        super();
    }

    async changeBusinessType(newType: BusinessType): Promise<void> {
        const isValid = await this.validator.post('/validate', { type: newType });
        if (isValid) {
            this.businessType = newType;
        }
    }
}

// Good
class Campaign extends DomainEntity {
    changeBusinessType(newType: BusinessType): void {
        if (newType === this.businessType) {
            throw new Error('New business type must be different');
        }
        this.businessType = newType;
        this.emit(new BusinessTypeChanged(this.id, this.businessType, newType));
    }
}
```

3. ❌ **Don't mix domain and application concerns**
```typescript
// Bad
public pause(): void {
    this.notificationService.notify('Campaign pausing...'); // Application concern
    this.status = 'PAUSED';
}

// Good
public pause(): void {
    this.status = 'PAUSED';
    this.emit(new CampaignPaused(this.id));
    // Let application layer handle notifications through event handlers
}
```