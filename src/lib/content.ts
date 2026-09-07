import { collectPublishedPosts, type Post, type PostWarning } from './posts';
import {
  normalizeProfile,
  normalizeRecommendations,
  normalizeWorks,
  type Profile,
  type Recommendations,
  type Works
} from './schema';

export type SiteContent = {
  profile: Profile | null;
  works: Works;
  recommendations: Recommendations;
  posts: Post[];
  warnings: PostWarning[];
};

const profileModules = import.meta.glob('../../content/profile.json', {
  eager: true,
  import: 'default'
});
const recModules = import.meta.glob('../../content/recommendations.json', {
  eager: true,
  import: 'default'
});
const workModules = import.meta.glob('../../content/works.json', {
  eager: true,
  import: 'default'
});
const postModules = import.meta.glob('../../content/posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
}) as Record<string, string>;

export function loadSite(): SiteContent {
  const profileRaw = Object.values(profileModules)[0];
  const recRaw = Object.values(recModules)[0];
  const workRaw = Object.values(workModules)[0];
  const files = Object.entries(postModules).map(([path, raw]) => ({ path, raw }));
  const { posts, warnings } = collectPublishedPosts(files);
  return {
    profile: normalizeProfile(profileRaw),
    works: normalizeWorks(workRaw),
    recommendations: normalizeRecommendations(recRaw),
    posts,
    warnings
  };
}
