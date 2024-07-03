import type { GenericNode, GenericParent } from 'myst-common';

export type User = {
  id: number;
  username: string;
  name: string;
  avatar_template: string;
  admin?: boolean;
  moderator?: boolean;
  trust_level: number;
};

export type Topic = {
  id: number;
  title: string;
  fancy_title: string;
  slug: string;
  posts_count: number;
  reply_count: number;
  highest_post_number: number;
  image_url: string | null;
  created_at: string;
  last_posted_at: string;
  bumped: boolean;
  bumped_at: string;
  archetype: string;
  unseen: boolean;
  pinned: boolean;
  unpinned: string | null;
  excerpt: string;
  visible: boolean;
  closed: boolean;
  archived: boolean;
  bookmarked: string | null;
  liked: string | null;
  tags: string[];
  tags_descriptions: Record<string, string>;
  views: number;
  like_count: number;
  has_summary: boolean;
  last_poster_username: string;
  category_id: number;
  pinned_globally: boolean;
  featured_link: string | null;
  has_accepted_answer: boolean;
  posters: Poster[];
};

export type Poster = {
  extras: string | null;
  description: string;
  user_id: number;
  primary_group_id: string | null;
  flair_group_id: string | null;
  user?: User;
};

export type DiscourseCategoryTopicsJson = {
  users: User[];
  topic_list: {
    can_create_topic: boolean;
    draft: string;
    draft_key: string;
    draft_sequence: number;
    per_page: number;
    draft_title: string;
    draft_category: string;
    draft_tags: string[];
    topics: Topic[];
  };
};

type DiscourseOptions = {
  url: string;
  category: string;
  mode?: string;
  limit?: number;
  pinned?: boolean;
  logoTitle?: string;
  data: {
    identifiers: {
      logo?: string;
      logoDark?: string;
    };
  };
};

export type IncomingDiscourseNode = GenericParent<DiscourseOptions>;
export type TransformedDiscourseNode = {
  mode: 'widget' | 'server' | 'client';
  logo?: string;
  logoDark?: string;
  data: { topics?: any; error?: string };
} & GenericNode<DiscourseOptions>;
