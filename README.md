# @curvenote/myst-landing-theme

A simple MyST landing page theme for projects and communities

## Usage with the `curvenote` or `myst` CLI

To use this template locally, update your site template make sure your project's local dependencies are installed:

```sh
site:
  template: landing-theme
```

OR

```sh
site:
  template: ./path/to/landing-theme
```

Then start the local server:

```sh
myst start
```

Open up [http://localhost:3000](http://localhost:3000) and you should be ready to go!

## Development

```bash
npm install
npm run dev
```

## Deployment

```sh
make deploy
```

Will bundle the theme and deploy it to https://github.com/myst-themes/landing-theme for download by the `mystmd` cli
