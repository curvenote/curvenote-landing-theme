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
import {
  ReferencesProvider,
  useBaseurl,
  useGridSystemProvider,
  useLinkProvider,
  useProjectManifest,
  useSiteManifest,
} from '@myst-theme/providers';
import classNames from 'classnames';
import { BusyScopeProvider, ExecuteScopeProvider } from '@myst-theme/jupyter';
import { SourceFileKind } from 'myst-spec-ext';
import type { GenericParent } from 'myst-common';
import { copyNode } from 'myst-common';
import { HashLink } from 'myst-to-react';
import { Section } from './Section';
import { extractThemeParts } from '~/utils/myst';
import { DiscourseWidget } from './DiscourseWidget';
import { DiscourseFeed } from './DiscourseFeed';
import { cn } from '~/utils/cn';

export function PageMain({ article }: { article: PageLoader }) {
  const grid = useGridSystemProvider();

  const siteManifest = useSiteManifest() as SiteManifest;
  const { title, actions } = siteManifest ?? {};
  const { logo, logo_dark, logo_text, topbar_height, topbar_floating, topbar_fixed } =
    siteManifest?.options ?? {};

  const project = useProjectManifest();

  const Link = useLinkProvider();
  const baseurl = useBaseurl();
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
          <main id="main" className={classNames(grid, 'col-screen')}>
            {/* Landing page could be a notebook 🤯  */}
            {compute?.enabled &&
              compute?.features.notebookCompute &&
              article.kind === SourceFileKind.Notebook && <NotebookToolbar showLaunch />}
            <ErrorTray pageSlug={article.slug} />
            {themeParts.hero && (
              <Section className="col-screen subgrid-gap" content={themeParts.hero} />
            )}
            <section className={cn(grid, 'col-screen subgrid-gap')}>
              <div id="skip-to-article" className="py-6" />
              <h1 className="col-page-inset">
                {article.frontmatter.title}
                <HashLink id="main-title" title={`Link to ${title}`} hover className="ml-2" />
              </h1>
              <div className="col-page-inset">
                <FrontmatterParts parts={knownParts} />
              </div>
              <DiscourseFeed
                className="col-page-inset"
                logo="https://cdck-file-uploads-global.s3.dualstack.us-west-2.amazonaws.com/flex002/uploads/qiime21/original/2X/3/32cfb71cfbcecd0d160df5fe08f51014402e7caf.png"
                logoText="Qiime 2"
                forumUrl={'https://forum.qiime2.org'}
                category="announcements"
                limit={10}
              />
              <ContentBlocks mdast={tree as GenericParent} className="col-page-inset" />
              <div className="col-page-inset">
                <BackmatterParts parts={knownParts} />
              </div>
              <div id="skip-to-end" />
              <Footnotes />
              <Bibliography />
              <div className="py-6" />
            </section>
            {themeParts.footer && (
              <ContentBlocks mdast={themeParts.footer} className="col-screen subgrid-gap" />
            )}
            <ConnectionStatusTray />
          </main>
        </ExecuteScopeProvider>
      </BusyScopeProvider>
    </ReferencesProvider>
  );
}
