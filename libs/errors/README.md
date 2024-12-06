# Error Handling Library

This library provides a foundational approach to error handling across the system. It establishes a clear distinction between client-caused errors and internal system errors, while promoting actionable error messages.

## Design Decisions

1. **Error Classification**
   - Errors are explicitly classified as either `ClientError` or `InternalError`
   - This maps naturally to HTTP status codes (4xx vs 5xx) but is generic enough for non-HTTP contexts
   - Clear distinction helps with error handling, logging, and monitoring strategies

2. **Actionable Errors**
   - All errors can include a `suggestedAction`
   - This guides developers on how to handle or fix the error
   - Keeps error handling documentation close to where it's needed

3. **Error Causality**
   - Optional `cause` property allows error chaining
   - Preserves error context when transforming errors between layers
   - Helps with debugging by maintaining the error trail

4. **Type Safety**
   - Type guards enable safe error handling in TypeScript
   - No inheritance-based approach to avoid common pitfalls with Error classes
   - Interface-based design for better composability

## Usage Example

```typescript
class DatabaseConnectionError implements InternalError {
    readonly kind = 'internal_error';
    
    constructor(cause: Error) {
        this.message = 'Failed to connect to database';
        this.cause = cause;
        this.suggestedAction = 'Check database connection settings and ensure database is running';
    }
}

// In error handling code
if (isInternalError(error)) {
    logger.error(error.message, { cause: error.cause });
    // Handle system error...
}
``` 