import type { PageLoader } from '@myst-theme/common';
import { getProject } from '@myst-theme/common';
import { getMetaTagsForArticle, responseNoArticle, responseNoSite } from '@myst-theme/site';
import type { LoaderFunction, V2_MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import type { SiteManifest } from 'myst-config';
import Page from '~/components/Page';
import { applyCustomTransforms } from '~/transforms';
import { api404 } from '~/utils/404';
import { getConfig, getPage } from '~/utils/loaders.server';

type ManifestProject = Required<SiteManifest>['projects'][0];

export const meta: V2_MetaFunction = ({ data, location }) => {
  if (!data) return [];

  const config: SiteManifest = data.config;
  const project: ManifestProject = data.project;
  const page: PageLoader = data.page;

  const title = `${page.frontmatter?.title ?? page.slug} | ${config?.title ?? project.title}`;

  return getMetaTagsForArticle({
    origin: '',
    url: location.pathname,
    title,
    description:
      page.frontmatter?.description ?? config.description ?? project.description ?? undefined,
    image:
      (page.frontmatter?.thumbnailOptimized || page.frontmatter?.thumbnail) ??
      (project.thumbnailOptimized || project.thumbnail) ??
      undefined,
    keywords: page.frontmatter?.keywords ?? config.keywords ?? project.keywords ?? [],
    twitter: config?.options?.twitter,
  });
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const config = await getConfig();
  if (!config) throw responseNoSite();
  const project = getProject(config);
  if (!project) throw responseNoArticle();
  const { slug } = params;
  const page = await getPage(request, { slug }).catch(() => null);
  if (!page) throw api404('No page found at this URL.');

  await applyCustomTransforms(page.mdast);

  return json({ config, project, page });
};

export default Page;
