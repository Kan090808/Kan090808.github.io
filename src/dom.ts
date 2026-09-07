type Attrs = Record<string, string | boolean | number | ((event: Event) => void) | undefined>;

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Attrs = {},
  ...kids: Array<Node | string | null | undefined | false>
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === undefined || value === false) continue;
    if (key.startsWith('on') && typeof value === 'function') {
      node.addEventListener(key.slice(2).toLowerCase(), value);
      continue;
    }
    if (value === true) {
      node.setAttribute(key, '');
      continue;
    }
    node.setAttribute(key, String(value));
  }
  for (const kid of kids) {
    if (!kid) continue;
    node.append(kid);
  }
  return node;
}

export function clear(node: HTMLElement): void {
  node.replaceChildren();
}
