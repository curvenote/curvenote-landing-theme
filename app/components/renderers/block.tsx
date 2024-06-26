import { NodeRenderer } from '@myst-theme/providers';
import { Hero } from './Hero';
import { Footer } from './Footer';
import { GenericParent, toText } from 'myst-common';
import { select, selectAll } from 'unist-util-select';
import type { SocialLink, FooterLink } from '@curvenote/common';

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

function transformFooter(node: GenericMaybeCustomBlockDirective): any {
  const ids = node.data.identifiers;

  const logo = select(`[identifier=${ids.logo}]`, node) as GenericParent;
  const logoDark = select(`[identifier=${ids.logoDark}]`, node) as GenericParent;
  const tagline = select(`[identifier=${ids.tagline}]`, node) as GenericParent;
  const copyright = select(`[identifier=${ids.copyright}]`, node) as GenericParent;

  const social: SocialLink[] = [];
  if (node.data.github) social.push({ kind: 'github', url: node.data.github });
  if (node.data.discord) social.push({ kind: 'discord', url: node.data.discord });
  if (node.data.discourse) social.push({ kind: 'discourse', url: node.data.discourse });
  if (node.data.twitter) social.push({ kind: 'twitter', url: node.data.twitter });
  if (node.data.mastodon) social.push({ kind: 'mastodon', url: node.data.mastodon });
  if (node.data.linkedin) social.push({ kind: 'linkedin', url: node.data.linkedin });
  if (node.data.youtube) social.push({ kind: 'youtube', url: node.data.youtube });
  if (node.data.website) social.push({ kind: 'website', url: node.data.website });
  if (node.data.email) social.push({ kind: 'email', url: node.data.email });

  const footerLinks = [];
  const links1 = selectAll(`[identifier=${ids.linkList1}] [type=link]`, node) as GenericParent[];
  if (links1) footerLinks.push(links1);
  const links2 = selectAll(`[identifier=${ids.linkList2}] [type=link]`, node) as GenericParent[];
  if (links2) footerLinks.push(links2);

  return {
    ...node,
    data: {
      ...node.data,
      logo: logo?.urlOptimized ?? logo.url,
      logoDark: logoDark?.urlOptimized ?? logoDark.url,
      tagline,
      social: social.length > 0 ? social : undefined,
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
        tagline,
        social,
        footerLinks,
        backgroundColor,
        textColor,
        copyright,
      } = footerNode.data;
      return (
        <Footer
          logo={logo}
          logoDark={logoDark}
          tagline={tagline}
          social={social}
          footerLinks={footerLinks}
          backgroundColor={backgroundColor}
          textColor={textColor}
          copyright={copyright}
        />
      );
    }
    default:
      return null;
  }
};
