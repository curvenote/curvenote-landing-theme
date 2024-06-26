import { SocialIcons } from '@curvenote/social';
import type { SocialLink, FooterLink } from '@curvenote/common';
import { GenericParent } from 'myst-common';
import { MyST } from 'myst-to-react';
import { cn } from '~/utils/cn';

// TODO could this be ported back to @curvenote/footers?
export function Footer({
  logo,
  logoDark,
  logoTitle,
  logoUrl,
  tagline,
  social,
  footerLinks,
  backgroundColor,
  textColor,
  copyright,
  children,
}: {
  logo?: string;
  logoDark?: string;
  logoTitle?: string;
  logoUrl?: string;
  tagline?: GenericParent;
  social?: SocialLink[];
  footerLinks?: GenericParent[][];
  children?: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
  copyright?: GenericParent;
}) {
  return (
    <div className="article-center-grid" style={{ backgroundColor, color: textColor }}>
      {children}
      <div className={cn('col-page')}>
        <div className="flex flex-col items-center w-full py-2 my-4 sm:py-5 lg:flex-row lg:flex-wrap">
          <div>
            <a href={logoUrl ?? '/'} className="inline-block">
              <img
                src={logo}
                className={cn('h-[80px] my-0', { 'dark:hidden': !!logoDark })}
                alt={logoTitle}
              />
              {logoDark && (
                <img src={logoDark} className="h-[80px] my-0 hidden dark:block" alt={logoTitle} />
              )}
              <span className="sr-only">{logoTitle}</span>
            </a>
            {tagline && (
              <div className={cn('font-light')} style={{ color: textColor }}>
                <MyST ast={tagline.children} />
              </div>
            )}
            {social && (
              <SocialIcons
                links={social}
                containerClass={cn('my-2 opacity-70 w-fit grid-cols-9 items-center')}
                iconClass="h-5 w-5"
              />
            )}
          </div>
          <div className={cn('mt-6 lg:mt-0 lg:pl-12 grow text-md font-light')}>
            <div className="flex flex-row space-x-2">
              <div className="hidden ml-10 grow lg:block"></div>
              {footerLinks?.map((linkChildren, i) => (
                <ul
                  key={i}
                  className="space-y-1 leading-loose lg:px-4"
                  style={{ color: textColor }}
                >
                  {linkChildren.map((item, ii) => (
                    <div>
                      <MyST ast={item} />
                    </div>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </div>
        {copyright && (
          <div className="py-1 text-sm col-page">
            <MyST ast={copyright} />
          </div>
        )}
      </div>
    </div>
  );
}
