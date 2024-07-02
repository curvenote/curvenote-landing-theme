import type { PageLoader } from '@myst-theme/common';
import {
  Bibliography,
  Footnotes,
  ContentBlocks,
  extractKnownParts,
  FrontmatterParts,
  BackmatterParts,
} from '@myst-theme/site';
import {
  ConnectionStatusTray,
  ErrorTray,
  NotebookToolbar,
  useComputeOptions,
} from '@myst-theme/jupyter';
import type { SiteManifest } from 'myst-config';
import { ReferencesProvider, useGridSystemProvider, useSiteManifest } from '@myst-theme/providers';
import { BusyScopeProvider, ExecuteScopeProvider } from '@myst-theme/jupyter';
import { SourceFileKind } from 'myst-spec-ext';
import type { GenericParent } from 'myst-common';
import { copyNode } from 'myst-common';
import { HashLink } from 'myst-to-react';
import { Section } from './Section';
import { extractThemeParts } from '~/utils/myst';
import { cn } from '~/utils/cn';

export function PageMain({ article }: { article: PageLoader }) {
  const grid = useGridSystemProvider();

  const siteManifest = useSiteManifest() as SiteManifest;
  const { title } = siteManifest ?? {};
  const compute = useComputeOptions();

  const tree = copyNode(article.mdast);
  const knownParts = extractKnownParts(tree);
  const themeParts = extractThemeParts(tree);

  return (
    <ReferencesProvider
      references={{ ...article.references, article: article.mdast }}
      frontmatter={article.frontmatter}
    >
      <BusyScopeProvider>
        <ExecuteScopeProvider enable={compute?.enabled ?? false} contents={article}>
          {/* Landing page could be a notebook 🤯  */}
          {compute?.enabled &&
            compute?.features.notebookCompute &&
            article.kind === SourceFileKind.Notebook && <NotebookToolbar showLaunch />}
          <ErrorTray pageSlug={article.slug} />
          {themeParts.hero && (
            <Section className="col-screen subgrid-gap" content={themeParts.hero} />
          )}
          <main id="main" className={cn(grid, 'col-screen grid-gap')}>
            <div id="skip-to-article" className="py-6" />
            {!themeParts.hero && (
              <h1 className="my-0 col-page-inset">
                {article.frontmatter.title}
                <HashLink id="main-title" title={`Link to ${title}`} hover className="ml-2" />
              </h1>
            )}
            <FrontmatterParts parts={knownParts} containerClassName="col-page-inset" />
            <ContentBlocks mdast={tree as GenericParent} className="col-page-inset" />
            <BackmatterParts parts={knownParts} containerClassName="col-page-inset" />
            <Footnotes innerClassName="col-page-inset" />
            <Bibliography innerClassName="col-page-inset" />
            <div className="py-6" />
          </main>
          {themeParts.footer && (
            <ContentBlocks mdast={themeParts.footer} className="col-screen subgrid-gap" />
          )}
          <ConnectionStatusTray />
        </ExecuteScopeProvider>
      </BusyScopeProvider>
    </ReferencesProvider>
  );
}
