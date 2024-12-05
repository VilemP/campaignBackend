# Validation Library

Type-safe validation library for runtime data validation with compile-time type inference.

## Purpose

This library provides a unified way to:
- Validate input data at runtime
- Infer TypeScript types from validation schemas
- Handle validation errors consistently
- Support both input and output validation

## Design Decisions

1. **Abstraction over Zod**
   - While Zod is used internally, this library provides its own interface
   - This abstraction protects our codebase from direct dependency on third-party code
   - Makes it possible to switch validation libraries without affecting consuming code
   - Allows us to add domain-specific validation rules and behaviors
   - Provides a more focused API for our specific needs

2. **Input/Output Separation**
   - Inputs: More lenient (coercion, extra properties allowed)
   - Outputs: Strict (exact matches required)

3. **Type Inference**: Automatic TypeScript type inference from schemas

4. **Cross-Cutting Concern**: Validation is treated as a core cross-cutting concern, not tied to any specific layer

## Usage

### Creating Schemas

```typescript
import { Schema } from '@libs/validation';

const userSchema = Schema.input(Schema.object({
    name: Schema.string().min(3).max(100),
    age: Schema.number().min(0),
    email: Schema.string().email()
}));

// TypeScript will infer the correct type
type User = (typeof userSchema)['type'];
```

### Validating Data

```typescript
// Throws if validation fails
const validatedData = userSchema.validate({
    name: "John",
    age: "25", // Will be coerced to number
    email: "john@example.com"
});
```

### Best Practices

1. Always use this library for validation instead of direct Zod usage
2. Define schemas close to where they're used
3. Use input validation for external data
4. Use output validation for API responses
5. Keep validation rules simple and focused

## Error Handling

Validation errors are thrown as exceptions with:
- Clear error messages
- Path to invalid field
- Expected vs received values
- Multiple errors collected when possible

## Future Considerations

- Custom domain-specific validation rules
- Async validation support
- Schema composition utilities
- Integration with OpenAPI/Swagger
- Performance optimizations for large objects 