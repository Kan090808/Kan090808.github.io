export type Route =
  | { name: 'profile' }
  | { name: 'works' }
  | { name: 'recs' }
  | { name: 'posts'; slug?: string };

export type ParsedHash = {
  route: Route;
  canonical: string;
  redirected: boolean;
};

export function routeToHash(route: Route): string {
  if (route.name === 'profile') return '#/profile';
  if (route.name === 'works') return '#/works';
  if (route.name === 'recs') return '#/recs';
  if (route.slug) return `#/posts/${route.slug}`;
  return '#/posts';
}

export function parseHash(hash: string): ParsedHash {
  const trimmed = hash.replace(/^#/, '');
  const pathname = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  const parts = pathname.split('/').filter(Boolean);

  if (parts.length === 0) {
    return { route: { name: 'profile' }, canonical: '#/profile', redirected: true };
  }

  if (parts[0] === 'profile' && parts.length === 1) {
    return { route: { name: 'profile' }, canonical: '#/profile', redirected: false };
  }

  if (parts[0] === 'works' && parts.length === 1) {
    return { route: { name: 'works' }, canonical: '#/works', redirected: false };
  }

  if (parts[0] === 'recs' && parts.length === 1) {
    return { route: { name: 'recs' }, canonical: '#/recs', redirected: false };
  }

  if (parts[0] === 'posts' && parts.length === 1) {
    return { route: { name: 'posts' }, canonical: '#/posts', redirected: false };
  }

  if (parts[0] === 'posts' && parts.length === 2 && parts[1].length > 0) {
    return {
      route: { name: 'posts', slug: parts[1] },
      canonical: `#/posts/${parts[1]}`,
      redirected: false
    };
  }

  return { route: { name: 'profile' }, canonical: '#/profile', redirected: true };
}
