import { marked } from 'marked';

const renderer = new marked.Renderer();
renderer.html = () => '';

export function renderMarkdown(source: string): string {
  return marked.parse(source, {
    async: false,
    gfm: true,
    breaks: false,
    renderer
  }) as string;
}
