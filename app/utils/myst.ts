import { GenericNode, GenericParent, extractPart } from 'myst-common';

/**
 * This returns the contents of a part that we want to render (not the root or block, which are already wrapped)
 * This also fixes a bug that the key is not defined on a block.
 */
export function getChildren(content?: GenericParent): GenericNode | GenericNode[] {
  if (
    content?.type === 'root' &&
    content.children?.length === 1 &&
    content.children[0].type === 'block'
  ) {
    return content.children[0].children as GenericNode[];
  }
  return content as GenericNode;
}

export function extractThemeParts(tree: GenericParent) {
  const hero = extractPart(tree, 'hero', { requireExplicitPart: true });
  const footer = extractPart(tree, 'footer', { requireExplicitPart: true });
  return { hero, footer };
}
