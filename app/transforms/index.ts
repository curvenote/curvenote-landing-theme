import type { GenericParent } from 'myst-common';
import { transformDiscourse } from './discourse.server';

export async function applyCustomTransforms(tree: GenericParent<any>) {
  await transformDiscourse(tree);
}
