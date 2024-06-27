import { useGridSystemProvider } from '@myst-theme/providers';
import { ContentBlocks } from '@myst-theme/site';
import type { GenericParent } from 'myst-common';
import { cn } from '~/utils/cn';

export function Section({ className, content }: { className?: string; content?: GenericParent }) {
  const grid = useGridSystemProvider();
  if (!content) return null;
  return (
    <section className={cn(grid, className)}>
      <ContentBlocks mdast={content} className="col-screen" />
    </section>
  );
}
