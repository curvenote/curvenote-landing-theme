import { useGridSystemProvider } from '@myst-theme/providers';
import { ExternalOrInternalLink } from '@myst-theme/site';
import type { GenericParent } from 'myst-common';
import { MyST } from 'myst-to-react';
import { cn } from '~/utils/cn';
import { toText } from 'myst-common';
import { select } from 'unist-util-select';

export interface GenericMaybeCustomBlockDirective {
  type: string;
  kind: string;
  data: {
    identifiers: Record<string, string>;
  } & Record<string, any>;
  children: GenericParent[];
}

export function transformHero(node: GenericMaybeCustomBlockDirective): any {
  const ids = node.data.identifiers;

  const title = select(`[identifier=${ids.title}]`, node);
  const tagline = select(`[identifier=${ids.tagline}]`, node);
  const description = select(`[identifier=${ids.description}]`, node);
  const backgroundImage = select(`[identifier=${ids.backgroundImage}]`, node) as GenericParent;

  const ctas = [];
  const cta1 = select(`[identifier=${ids.cta}]`, node) as GenericParent;
  if (cta1) ctas.push({ title: toText(cta1), url: cta1.url });
  const cta2 = select(`[identifier=${ids.cta2}]`, node) as GenericParent;
  if (cta2) ctas.push({ title: toText(cta2), url: cta2.url });

  return {
    ...node,
    data: {
      ...node.data, // backgroundColor, padding
      title,
      tagline,
      description,
      backgroundImage: backgroundImage?.urlOptimized ?? backgroundImage?.url,
      ctas,
    },
    children: [],
  };
}

export function HeroComponent({
  containerClassName,
  innerClassName = 'col-page-inset',
  title,
  tagline,
  description,
  backgroundImageUrl,
  backgroundColor,
  textColor,
  padding,
  ctas,
  ctaStyle = 'light',
}: {
  containerClassName?: string;
  innerClassName?: string;
  title?: GenericParent;
  tagline?: GenericParent;
  description?: GenericParent;
  backgroundImageUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  padding?: string;
  ctas?: { title: string; url: string }[];
  ctaStyle?: 'light' | 'dark';
}) {
  const grid = useGridSystemProvider();
  if (ctaStyle !== 'light' && ctaStyle !== 'dark') ctaStyle = 'light';
  const ctaClasses = [
    cn(
      'inline-block px-6 py-3 font-semibold tracking-wide no-underline rounded-lg border-1 hover:opacity-100',
      {
        'bg-white dark:text-stone-900 border-white opacity-90': ctaStyle === 'light',
        'bg-stone-900 text-white border-stone-900 opacity-80': ctaStyle === 'dark',
      }
    ),
    cn(
      'inline-block px-6 py-3 rounded-lg bg-transparent no-underline font-semibold tracking-wide ',
      {
        'border-[1px] border-white text-white hover:bg-gray-50/20': ctaStyle === 'light',
        'border-[1px] border-stone-900 text-stone-900 hover:bg-gray-800/10': ctaStyle === 'dark',
      }
    ),
  ];
  return (
    <div
      className={cn(grid, 'grid-gap', containerClassName)}
      style={{
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : undefined,
        backgroundColor,
        color: textColor,
        padding,
      }}
    >
      <div className={innerClassName}>
        {title && (
          <h1 className="mb-0 hero-heading" style={{ color: textColor }}>
            <MyST ast={title.children} />
          </h1>
        )}
        {tagline && (
          <div className="text-xl font-extralight hero-tagline smallcaps">
            <MyST ast={tagline.children} />
          </div>
        )}
        {description && (
          <div className="mt-4 italic font-light hero-description">
            <MyST ast={description} />
          </div>
        )}
        {ctas && ctas.length > 0 && (
          <div
            className={cn('flex flex-col sm:flex-row gap-4 mt-12 items-center', {
              // 'justify-center': hero.layout === 'center',
            })}
          >
            {ctas.map((cta, i) => {
              return (
                <div
                  key={`${encodeURIComponent(cta.url)}-${i}`}
                  aria-roledescription={`call to action ${i}`}
                >
                  <ExternalOrInternalLink
                    to={cta.url}
                    className={ctaClasses[i % ctaClasses.length]}
                  >
                    {cta.title}
                  </ExternalOrInternalLink>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export function Hero({ node }: { node: GenericMaybeCustomBlockDirective }) {
  const heroNode = transformHero(node);
  return (
    <HeroComponent
      title={heroNode.data.title}
      tagline={heroNode.data.tagline}
      description={heroNode.data.description}
      backgroundImageUrl={heroNode.data.backgroundImage}
      backgroundColor={heroNode.data.backgroundColor}
      textColor={heroNode.data.textColor}
      padding={heroNode.data.padding}
      ctas={heroNode.data.ctas}
      ctaStyle={heroNode.data.ctaStyle}
    />
  );
}
