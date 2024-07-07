import type { GenericMaybeCustomBlockDirective } from './Hero';
import type { GenericParent } from 'myst-common';
import { toText } from 'myst-common';
import { select, selectAll } from 'unist-util-select';
import type { SocialLink, FooterLink } from '@curvenote/common';
import { JournalFooter } from '@curvenote/footers';
import { MyST } from 'myst-to-react';
import React from 'react';

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
      brandFooter={false}
      gutter={
        <div className="col-page-inset">
          <MyST ast={copyright} />
        </div>
      }
      style={{ backgroundColor, color: textColor }}
    />
  );
}
