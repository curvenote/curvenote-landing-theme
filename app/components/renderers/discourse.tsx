import { useTheme, type NodeRenderer } from '@myst-theme/providers';
import { DiscourseFeed } from './DiscourseFeed';
import { DiscourseWidget } from './DiscourseWidget';
import type { Topic, TransformedDiscourseNode, User } from '~/transforms/discourseTypes';
import { DiscourseClient } from './DiscourseClient';

export function formatDiscourseTopics(
  topics: Topic[],
  users: User[],
  opts: { pinned?: boolean; limit?: number }
) {
  const composed = topics.map((t) => {
    t.posters =
      t.posters?.map((p) => {
        return {
          ...p,
          user: users.find((u) => u.id === p.user_id),
        };
      }) ?? [];
    return t;
  });

  return composed
    ?.filter((t) => (opts.pinned ? true : !t.pinned))
    .filter((t) => t.visible && !t.archived)
    .slice(0, opts.limit);
}

export const DiscourseRenderer: NodeRenderer = ({ node }: { node: TransformedDiscourseNode }) => {
  const { mode, url, category, pinned, limit, logo, logoDark, logoTitle, data } = node;

  const { isDark } = useTheme();
  if (mode === 'widget') {
    return <DiscourseWidget url={url} category={category} limit={limit} />;
  } else if (mode === 'client') {
    return (
      <DiscourseClient
        url={url}
        category={category}
        pinned={pinned}
        limit={limit}
        logo={logo}
        logoDark={logoDark}
        logoTitle={logoTitle}
        isDark={isDark}
      />
    );
  }

  return (
    <DiscourseFeed
      topics={data.topics}
      error={data.error}
      logo={logo}
      logoDark={logoDark}
      logoTitle={logoTitle}
      url={url}
      category={category}
      isDark={isDark}
    />
  );
};
