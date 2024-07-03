import type { GenericNode } from 'myst-common';
import { select, selectAll } from 'unist-util-select';
import pLimit from 'p-limit';
import type {
  DiscourseCategoryTopicsJson,
  IncomingDiscourseNode,
  TransformedDiscourseNode,
} from './discourseTypes';
import { formatDiscourseTopics } from '~/components/renderers/discourse';

function transformNodeSimple(node: IncomingDiscourseNode & TransformedDiscourseNode) {
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

  let mode: 'widget' | 'server' | 'client' = 'server';
  if (node.mode === 'widget') mode = 'widget';
  else if (node.mode === 'client') mode = 'client';

  node.mode = mode;
  node.logo = logoNode?.urlOptimized ?? logoNode?.url;
  node.logoDark = logoDarkNode?.urlOptimized ?? logoDarkNode?.url;
  node.children = [];
}

async function fetchDiscourseFeedIfNecessary(node: TransformedDiscourseNode) {
  if (node.mode !== 'server') {
    return;
  }

  const resp = await fetch(`${node.url.replace(/\/$/, '')}/c/${node.category}.json`);
  if (resp.ok) {
    const data = (await resp.json()) as DiscourseCategoryTopicsJson;

    node.data.topics = formatDiscourseTopics(data.topic_list?.topics ?? [], data.users, {
      pinned: node.pinned,
      limit: node.limit,
    });
  } else {
    node.data.error = `Failed to fetch discourse feed - ${resp.status} ${resp.statusText}`;
  }
}

/**
 * Transforms any discourse nodes and when mode=feed, fetches the remote feed
 * Processed the mdast tree inplace with side effects
 *
 * @param node
 */
export async function transformDiscourse(
  node: IncomingDiscourseNode & TransformedDiscourseNode
): Promise<void> {
  // find any discourse nodes
  const nodes = selectAll('discourse', node) as (IncomingDiscourseNode &
    TransformedDiscourseNode)[];
  const limit = pLimit(5);
  await Promise.all(
    nodes.map(async (node) =>
      limit(async () => {
        transformNodeSimple(node);
        return fetchDiscourseFeedIfNecessary(node);
      })
    )
  );
}
