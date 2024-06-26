export const getContrastColor = (hex: string): string => {
  let color = hex.replace(/#/g, '');
  // rgb values
  var r = parseInt(color.slice(0, 2), 16);
  var g = parseInt(color.slice(2, 4), 16);
  var b = parseInt(color.slice(4, 6), 16);
  var yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#000000' : '#FFFFFF';
};

export const getRGBColor = (hex: string) => {
  let color = hex.replace(/#/g, '');
  // rgb values
  var r = parseInt(color.slice(0, 2), 16);
  var g = parseInt(color.slice(2, 4), 16);
  var b = parseInt(color.slice(4, 6), 16);

  return `${r}, ${g}, ${b}`;
};

export function generateFontFaceRules(config: any): { imports: string; rules: string } {
  if (!config.fonts) return { imports: '', rules: '' };

  const imports: string[] = [];
  const vars: string[] = [];

  Object.entries(config.fonts ?? {}).forEach(([key, { name, src }]) => {
    imports.push(`@import url('${src}');`);
    vars.push(`--theme-font-${key}:'${name}';`);
  });

  const styles = config.styles as { body?: string } | undefined; // TODO remove after @curvenote/common is updated
  let rules = `:root {${vars.join('')}}`;
  if (styles?.body?.includes('font-one'))
    rules += `body { font-family: var(--theme-font-one), serif; }`;
  if (styles?.body?.includes('font-two'))
    rules += `body { font-family: var(--theme-font-two), serif; }`;
  if (styles?.body?.includes('font-three'))
    rules += `body { font-family: var(--theme-font-three), serif; }`;

  return { imports: imports.join('\n'), rules };
}
