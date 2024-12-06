import { describe, it, expect } from 'vitest';
import { Entity } from './entity';

class TestEntity extends Entity<string> {}

describe('Entity', () => {
  it('should compare entities by id', () => {
    const id = 'test-id';
    const entity1 = new TestEntity(id);
    const entity2 = new TestEntity(id);
    const entity3 = new TestEntity('other-id');

    expect(entity1.equals(entity2)).toBe(true);
    expect(entity1.equals(entity3)).toBe(false);
  });

  it('should expose id through getter', () => {
    const id = 'test-id';
    const entity = new TestEntity(id);

    expect(entity.id).toBe(id);
  });
});
