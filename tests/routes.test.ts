import { describe, expect, it } from 'vitest';
import { parseHash, routeToHash } from '../src/lib/routes';

describe('parseHash', () => {
  it('parses the four tabs and post slugs', () => {
    expect(parseHash('#/profile')).toEqual({
      route: { name: 'profile' },
      canonical: '#/profile',
      redirected: false
    });
    expect(parseHash('#/works').route).toEqual({ name: 'works' });
    expect(parseHash('#/recs').route).toEqual({ name: 'recs' });
    expect(parseHash('#/posts').route).toEqual({ name: 'posts' });
    expect(parseHash('#/posts/first-note').route).toEqual({ name: 'posts', slug: 'first-note' });
  });

  it('redirects unknown and empty hashes to profile', () => {
    expect(parseHash('')).toEqual({
      route: { name: 'profile' },
      canonical: '#/profile',
      redirected: true
    });
    expect(parseHash('#/nope').redirected).toBe(true);
    expect(parseHash('#/nope').canonical).toBe('#/profile');
  });
});

describe('routeToHash', () => {
  it('round-trips tab names', () => {
    expect(routeToHash({ name: 'profile' })).toBe('#/profile');
    expect(routeToHash({ name: 'works' })).toBe('#/works');
    expect(routeToHash({ name: 'recs' })).toBe('#/recs');
    expect(routeToHash({ name: 'posts' })).toBe('#/posts');
    expect(routeToHash({ name: 'posts', slug: 'first-note' })).toBe('#/posts/first-note');
  });
});
