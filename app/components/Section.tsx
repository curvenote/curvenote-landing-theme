import { ContentBlocks } from '@myst-theme/site';
import { GenericParent } from 'myst-common';

export function Section({ content }: { content?: GenericParent }) {
  if (!content) return null;
  return (
    <section className="col-screen article-center-grid">
      <ContentBlocks mdast={content} className="col-screen" />
    </section>
  );
}
