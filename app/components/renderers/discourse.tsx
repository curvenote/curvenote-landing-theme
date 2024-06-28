import { useTheme, type NodeRenderer } from '@myst-theme/providers';
import type { GenericNode, GenericParent } from 'myst-common';
import { DiscourseFeed } from './DiscourseFeed';
import { DiscourseWidget } from './DiscourseWidget';
import { select } from 'unist-util-select';

type DiscourseOptions = {
  url: string;
  category: string;
  mode?: string;
  limit?: number;
  pinned?: boolean;
  logoTitle?: string;
  data: {
    identifiers: {
      logo?: string;
      logoDark?: string;
    };
  };
};

type IncomingDiscourseNode = GenericParent<DiscourseOptions>;
type OutgoingDiscourseNode = {
  mode: 'widget' | 'feed';
  logo?: string;
  logoDark?: string;
  data: { items?: any[]; error?: string };
} & GenericNode<DiscourseOptions>;

function transformDiscourse(node: IncomingDiscourseNode): OutgoingDiscourseNode {
  const ids = node.data.identifiers;

  const logoNode = ids.logo
    ? (select(`[identifier=${ids.logo}]`, node) as GenericNode<{
        url: string;
        urlOptimized: string;
      }> | null)
    : undefined;

  const logoDarkNode = ids.logoDark
    ? (select(`[identifier=${ids.logoDark}]`, node) as GenericNode<{
        url: string;
        urlOptimized: string;
      }> | null)
    : undefined;

  // TODO async + fetch

  let mode: 'widget' | 'feed' = 'feed';
  if (node.mode === 'widget') {
    mode = 'widget';
  }

  return {
    ...node,
    mode,
    logo: logoNode?.urlOptimized ?? logoNode?.url,
    logoDark: logoDarkNode?.urlOptimized ?? logoDarkNode?.url,
    children: [],
  };
}

export const DiscourseRenderer: NodeRenderer = ({
  node,
}: {
  node: GenericParent<DiscourseOptions>;
}) => {
  const tnode = transformDiscourse(node);
  const { mode, url, category, limit, pinned, logo, logoDark, logoTitle } = tnode;

  const { isDark } = useTheme();
  if (mode === 'widget') {
    return <DiscourseWidget url={url} category={category} limit={limit} />;
  }

  console.log('discourse', node);
  console.log('transformed', { mode, url, category, limit, pinned, logo, logoDark, logoTitle });

  return (
    <DiscourseFeed
      logo={logo}
      logoDark={logoDark}
      logoTitle={logoTitle}
      forumUrl={url}
      category={category}
      limit={limit}
      isDark={isDark}
      pinned={pinned}
    />
  );
};
