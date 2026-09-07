export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug);
}

export const SLUG_ERROR = '網址代稱只能使用小寫英文字母、數字與連字號';
