import type { PostDraft, Profile, Recommendations, Works } from '../lib/schema';

async function request<T>(url: string, method: string, body?: unknown): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: body === undefined ? undefined : { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const data = (await response.json().catch(() => ({}))) as { error?: string } & T;
  if (!response.ok) {
    throw new Error(data.error ?? '儲存失敗');
  }
  return data;
}

export function putProfile(profile: Profile): Promise<{ profile: Profile }> {
  return request('/__local-cms/profile', 'PUT', profile);
}

export function putRecommendations(
  recommendations: Recommendations
): Promise<{ recommendations: Recommendations }> {
  return request('/__local-cms/recommendations', 'PUT', recommendations);
}

export function putWorks(works: Works): Promise<{ works: Works }> {
  return request('/__local-cms/works', 'PUT', works);
}

export function createPost(post: PostDraft): Promise<{ post: PostDraft }> {
  return request('/__local-cms/posts', 'POST', post);
}

export function updatePost(slug: string, post: PostDraft): Promise<{ post: PostDraft }> {
  return request(`/__local-cms/posts/${encodeURIComponent(slug)}`, 'PUT', post);
}

export function deletePost(slug: string): Promise<void> {
  return request(`/__local-cms/posts/${encodeURIComponent(slug)}`, 'DELETE');
}
