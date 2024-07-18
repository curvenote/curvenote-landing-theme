import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { applyCustomTransforms } from '~/transforms';
import { api404 } from '~/utils/404';
import { getMystXrefJson, getPage } from '~/utils/loaders.server';

export const loader: LoaderFunction = async ({ request, params }) => {
  const { slug } = params;
  // Handle /myst.xref.json as slug
  if (slug === 'myst.xref') {
    const xref = await getMystXrefJson();
    if (!xref) return new Response('myst.xref.json not found', { status: 404 });
    return json(xref);
  }
  const data = await getPage(request, { slug }).catch(() => null);
  if (!data) return api404('No page found at this URL.');

  await applyCustomTransforms(data.mdast);

  return json(data, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
};
