import { type NodeRenderer } from '@myst-theme/providers';
import type { GenericMaybeCustomBlockDirective } from './Hero';
import { Hero } from './Hero';
import { Footer } from './Footer';

export const CustomBlockRenderer: NodeRenderer = ({
  node,
}: {
  node: GenericMaybeCustomBlockDirective;
}) => {
  switch (node.kind) {
    case 'hero': {
      return <Hero node={node} />;
    }
    case 'footer': {
      return <Footer node={node} />;
    }
    default:
      return null;
  }
};
