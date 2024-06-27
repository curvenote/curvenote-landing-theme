const mystTheme = require('@myst-theme/styles');

module.exports = {
  darkMode: 'class',
  content: [
    ...mystTheme.content,
    'node_modules/@curvenote/social/{src,dist}/**/*.{js,ts,jsx,tsx}',
    'node_modules/@curvenote/footers/{src,dist}/**/*.{js,ts,jsx,tsx}',
    'node_modules/@scienceicons/react/{src,dist}/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: mystTheme.themeExtensions,
  },
  plugins: [require('@tailwindcss/typography')],
  safelist: mystTheme.safeList,
};
