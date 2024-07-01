import { GridSystemProvider, type NodeRenderer } from '@myst-theme/providers';
import { Hero } from './Hero';
import { JournalFooter } from '@curvenote/footers';
import type { GenericParent } from 'myst-common';
import { toText } from 'myst-common';
import { select, selectAll } from 'unist-util-select';
import type { SocialLink, FooterLink } from '@curvenote/common';
import { MyST } from 'myst-to-react';

export interface GenericMaybeCustomBlockDirective {
  type: string;
  kind: string;
  data: {
    identifiers: Record<string, string>;
  } & Record<string, any>;
  children: GenericParent[];
}

function transformHero(node: GenericMaybeCustomBlockDirective): any {
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

function transformFooter(node: GenericMaybeCustomBlockDirective) {
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

export const CustomBlockRenderer: NodeRenderer = ({
  node,
}: {
  node: GenericMaybeCustomBlockDirective;
}) => {
  switch (node.kind) {
    case 'hero': {
      // TODO move to loader
      const heroNode = transformHero(node);
      return (
        <Hero
          title={heroNode.data.title}
          tagline={heroNode.data.tagline}
          description={heroNode.data.description}
          backgroundImageUrl={heroNode.data.backgroundImage}
          backgroundColor={heroNode.data.backgroundColor}
          textColor={heroNode.data.textColor}
          padding={heroNode.data.padding}
          ctas={heroNode.data.ctas}
        />
      );
    }
    case 'footer': {
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
    default:
      return null;
  }
};
