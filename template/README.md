# curvenote-landing

A professional landing page theme by Curvenote

## Features

- Hero and Footer parts enable content to be pulled out or full width at desired positions
- Options to adjust TopBar height and styling
- Hide or show Known MyST parts like footnote, bibliography
- Honors standard MyST options for logos and analytics (google & plausible)
- Supports the [Curvenote Website Components](https://github.com/myst-ext/myst-ext-curvenote-web) and [Discourse](https://github.com/myst-ext/myst-ext-discourse) custom directives.

## Usage

### Parts

Use the hero and footer parts to identify the repective content, this will be pulled out tf the normal document flow and applied full width a the top and bottom of the page.

Recommended using this in conjunction with the `hero` and `footer` directives from the [Curvenote Website Components Package](https://github.com/myst-ext/myst-ext-curvenote-web). For example:

```
---
title: My Project Landing Page
---

+++ { "part": "hero" }
:::{hero} My New Project
banner: hero.png
tagline: cool as a berg!
:::
+++

This is the main body of content in the site.

+++ { "part": "footer" }
:::{footer}
:logo: logo.png
:background-color: #666
:text-color: #eee

[{scienceicon}`website`](https://curvenote.com)
[{scienceicon}`twitter`](https://x.com/curvnote)
[{scienceicon}`github`](https://github.com/curvenote)

- - [Learn](https://docs.curvenote.com)
  - [Discover](https://library.curvenote.com)
  - [Extend](https://develop.curvenote.com)
- - [About](https://curvenote.com/about)
  - [Contributors](https://github.com/curvenote)

:::
```

## Options

<dl>
  <dt>topbar_height</dt>
  <dd>(Number) Height of the top bar area in pixels.</dd>
  <dt>topbar_floating</dt>
  <dd>(Boolean) Top bar will be transparent, borderless and will overlay content.</dd>
  <dt>topbar_fixed</dt>
  <dd>(Boolean) Top bar will be fixed.</dd>
  <dt>curvenote_tag</dt>
  <dd>(Boolean) Show the Curvenote tag in the top navigation area</dd>
  <dt>curvenote_footer</dt>
  <dd>(Enum) Choose the type of footer to display `full`, `support` or `design`(default).</dd>
  <dt>show_bibliography</dt>
  <dd>(Boolean) A Bibliography will be rendered at the foot of the page.</dd>
  <dt>show_footnotes</dt>
  <dd>(Boolean) A list of footnotes will be rendered at the foot of the page. Footnotes will continue work as expected within the main content, irrespective of this option.</dd>
  <dt>favicon</dt>
  <dd>(Boolean) Local path to favicon image.</dd>
  <dt>logo</dt>
  <dd>(Boolean) Local path to logo image.</dd>
  <dt>logo_dark</dt>
  <dd>(Boolean) Local path to logo image for dark mode.</dd>
  <dt>logo_text</dt>
  <dd>(Boolean) Short text to display next to logo at the top of all pages.</dd>
  <dt>analytics_google</dt>
  <dd>(Boolean) Google analytics key.</dd>
  <dt>analytics_plausible</dt>
  <dd>(Boolean)  Plausible analytics key.</dd>   
</dl>
