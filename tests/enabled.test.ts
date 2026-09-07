import { describe, expect, it } from 'vitest';
import { isLocalEditEnabled } from '../src/lib/enabled';

describe('isLocalEditEnabled', () => {
  it('is true only when DEV is true', () => {
    expect(isLocalEditEnabled({ DEV: true })).toBe(true);
    expect(isLocalEditEnabled({ DEV: false })).toBe(false);
    expect(isLocalEditEnabled({})).toBe(false);
  });
});
