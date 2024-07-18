import React from 'react';
import type { GenericMaybeCustomBlockDirective } from './Hero';
import type { GenericParent } from 'myst-common';
import { toText } from 'myst-common';
import { select, selectAll } from 'unist-util-select';
import type { SocialLink, FooterLink } from '@curvenote/common';
import { CurvenoteFooterSupport, JournalFooter } from '@curvenote/footers';
import { MyST } from 'myst-to-react';
import { CurvenoteLinks, SocialIcons } from '@curvenote/social';
import { CurvenoteText } from '@curvenote/icons';

function toFooterLink(link: GenericParent): FooterLink {
  return {
    title: toText(link),
    url: link.url,
    external: link.url?.match(/^http[s]*:/) ?? false,
  };
}

function toSocialLink(link: GenericParent): SocialLink {
  return {
    kind: link.children[0]?.value ?? 'unknown',
    url: link.url,
  };
}

export function transformFooter(node: GenericMaybeCustomBlockDirective) {
  const ids = node.data.identifiers;

  const logo = select(`[identifier=${ids.logo}]`, node) as GenericParent;
  const logoDark = select(`[identifier=${ids.logoDark}]`, node) as GenericParent;
  const tagline = select(`[identifier=${ids.tagline}]`, node) as GenericParent;
  const copyright = select(`[identifier=${ids.copyright}]`, node) as GenericParent;

  const socialParent = select(`[identifier=${ids.social}]`, node) as GenericParent | null;
  const social: SocialLink[] =
    socialParent?.children?.map((i) => toSocialLink(i as GenericParent)) ?? [];

  const footerLinks: FooterLink[][] = [];
  const links1 = selectAll(`[identifier=${ids.linkList1}] [type=link]`, node) as GenericParent[];
  if (links1) footerLinks.push(links1.map(toFooterLink));
  const links2 = selectAll(`[identifier=${ids.linkList2}] [type=link]`, node) as GenericParent[];
  if (links2) footerLinks.push(links2.map(toFooterLink));

  return {
    ...node,
    data: {
      ...node.data,
      logoTitle: node.data.logoTitle,
      logoUrl: node.data.logoUrl,
      backgroundColor: node.data.backgroundColor,
      textColor: node.data.textColor,
      logo: logo?.urlOptimized ?? logo.url,
      logoDark: logoDark?.urlOptimized ?? logoDark.url,
      tagline,
      social: social && social.length > 0 ? social : undefined,
      footerLinks,
      copyright,
    },
    children: [],
  };
}

export function PoweredByFooter() {
  return (
    <div className="col-screen article-center-grid bg-[#2A5F9D] py-3 px-6">
      <div className="grid grid-cols-1 gap-2 col-screen-inset md:grid-cols-12">
        <div className="text-center md:text-left md:col-span-6">
          <span className="text-sm text-white">Supported by </span>
          <a href="https://curvenote.com" target="_blank" rel="noreferrer">
            <CurvenoteText className="inline-block -translate-y-px" fill="#FFF" size={18} />
            <span className="sr-only">Curvenote</span>
          </a>
        </div>

        <div className="m-auto text-white md:mx-0 md:col-span-6">
          <SocialIcons
            links={CurvenoteLinks}
            containerClass="md:float-right text-white"
            iconClass="h-4 w-4 text-white"
          />
        </div>
      </div>
    </div>
  );
}

export function Footer({ node }: { node: GenericMaybeCustomBlockDirective }) {
  const footerNode = transformFooter(node);
  const {
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
  } = footerNode.data;

  return (
    <JournalFooter
      className="not-prose article-center-grid"
      logo={logo}
      logoDark={logoDark}
      logoTitle={logoTitle}
      logoUrl={logoUrl}
      tagline={<MyST ast={tagline} />}
      social={social}
      links={footerLinks}
      brandFooter={<PoweredByFooter />}
      gutter={
        <div className="col-page-inset">
          <MyST ast={copyright} />
        </div>
      }
      style={{ backgroundColor, color: textColor }}
    />
  );
}
