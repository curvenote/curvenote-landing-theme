import { useGridSystemProvider } from '@myst-theme/providers';
import { ExternalOrInternalLink } from '@myst-theme/site';
import type { GenericParent } from 'myst-common';
import { MyST } from 'myst-to-react';
import { cn } from '~/utils/cn';

export function Hero({
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
}) {
  const grid = useGridSystemProvider();
  const ctaClasses = [
    'inline-block px-8 py-4 text-lg font-semibold tracking-wide no-underline bg-white border-white rounded-lg border-1 opacity-90 hover:opacity-100',
    'inline-block px-8 py-4 rounded-lg bg-transparent border-1 text-white no-underline text-lg font-semibold tracking-wide hover:bg-gray-50/20',
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
