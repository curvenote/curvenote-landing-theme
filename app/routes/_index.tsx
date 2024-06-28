import {
  getMetaTagsForArticle,
  responseNoArticle,
  responseNoSite,
  ErrorProjectNotFound,
  KatexCSS,
} from '@myst-theme/site';
import Page from '../components/Page';
import { getConfig, getPage } from '../utils/loaders.server';
import type {
  ActionFunction,
  LinksFunction,
  LoaderFunction,
  V2_MetaFunction,
} from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import type { SiteManifest } from 'myst-config';
import { getProject } from '@myst-theme/common';
import fetch from 'node-fetch';
import { applyCustomTransforms } from '~/transforms';

type ManifestProject = Required<SiteManifest>['projects'][0];

export const meta: V2_MetaFunction = ({ data, location }) => {
  if (!data) return [];

  const config: SiteManifest = data.config;
  const project: ManifestProject = data.project;

  return getMetaTagsForArticle({
    origin: '',
    url: location.pathname,
    title: config?.title ?? project.title,
    description: config.description ?? project.description ?? undefined,
    image: (project.thumbnailOptimized || project.thumbnail) ?? undefined,
    keywords: config.keywords ?? project.keywords ?? [],
    twitter: config?.options?.twitter,
  });
};

export const links: LinksFunction = () => [KatexCSS];

export const loader: LoaderFunction = async ({ params, request }) => {
  const config = await getConfig();
  if (!config) throw responseNoSite();
  const project = getProject(config);
  if (!project) throw responseNoArticle();
  if (project.slug) return redirect(`/${project.slug}`);
  const page = await getPage(request, { slug: project.index });

  await applyCustomTransforms(page.mdast);

  return { config, project, page };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'load-json') {
    const url = String(formData.get('url'));

    const resp = await fetch(url);
    if (!resp.ok) {
      return new Response(JSON.stringify({ error: true }), {
        status: resp.status,
        statusText: resp.statusText,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const data = await resp.json();

    return json(data);
  }
  return null;
};

export default Page;

export function CatchBoundary() {
  return (
    <main className="article">
      <ErrorProjectNotFound />;
    </main>
  );
}
