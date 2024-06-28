import { useTheme, type NodeRenderer } from '@myst-theme/providers';
import { DiscourseFeed } from './DiscourseFeed';
import { DiscourseWidget } from './DiscourseWidget';
import type { TransformedDiscourseNode } from '~/transforms/discourseTypes';

export const DiscourseRenderer: NodeRenderer = ({ node }: { node: TransformedDiscourseNode }) => {
  const { mode, url, category, limit, logo, logoDark, logoTitle, data } = node;

  const { isDark } = useTheme();
  if (mode === 'widget') {
    return <DiscourseWidget url={url} category={category} limit={limit} />;
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
