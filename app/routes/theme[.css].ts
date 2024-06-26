import { type LoaderFunction } from '@remix-run/node';
import { generateFontFaceRules, getContrastColor, getRGBColor } from '~/utils/stylesheet';

function colors(theme: JournalTheme) {
  // return Object.entries(theme.config?.colors ?? {}).reduce(
  //   (acc, [name, color]: [string, string]) => {
  //     return `${acc}--theme-color-${name}:${getRGBColor(
  //       color,
  //     )};--theme-color-${name}-contrast:${getRGBColor(getContrastColor(color))};`;
  //   },
  //   '',
  // );
  return '';
}

function sheet(config: any /*SiteManifest*/) {
  return '';
  // const { imports, rules } = generateFontFaceRules(theme);

  // return (
  //   imports +
  //   `
  // :root {${colors(theme)}}
  // ` +
  //   rules
  // );
}

export const loader: LoaderFunction = async ({ request }): Promise<Response> => {
  const site = await getJournalSite(request);
  const theme = makeSiteTheme(site);

  // return new Response(sheet(theme), {
  return new Response('', {
    headers: {
      'Content-Type': 'text/css',
      'Cache-Control': 'no-cache',
    },
  });
};
