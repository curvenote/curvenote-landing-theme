import { useEffect, useState } from 'react';
import { DiscourseLoading } from './DiscourseWidget';
import { useFetcher } from '@remix-run/react';
import { formatDistanceToNow, format } from 'date-fns';

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

export type DiscourseJsonResponse = {
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

function DiscourseFeedItem({ topic, forumUrl }: { topic: Topic; forumUrl: string }) {
  const {
    id,
    slug,
    fancy_title,
    title,
    tags,
    posters,
    reply_count,
    views: view_count,
    last_posted_at,
  } = topic;

  const replies = reply_count > 1000 ? `${(reply_count / 1000).toFixed()}k` : reply_count;
  const views = view_count > 1000 ? `${(view_count / 1000).toFixed(1)}k` : view_count;

  return (
    <tr>
      <td>
        <a
          className="cursor-pointer not-prose group"
          href={`${forumUrl}/t/${slug}/${id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="text-lg group-hover:underline">{fancy_title ?? title}</div>
          {tags && <div className="font-mono text-xs text-gray-500">{tags.join('·')}</div>}
        </a>
      </td>
      <td className="align-middle">
        <div className="flex flex-wrap gap-1 max-w-[100px] items-center">
          {posters.map((p) => {
            const imgUrl = p.user?.avatar_template.replace('{size}', '24');
            return (
              <div
                key={`${id}-${p.user_id}`}
                className="w-6 h-6 bg-gray-400 rounded-full"
                title={p.user?.username}
                style={{
                  backgroundImage: `url(${forumUrl}${imgUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              ></div>
            );
          })}
        </div>
      </td>
      <td className="font-semibold text-center text-gray-400 align-middle">{replies}</td>
      <td className="font-semibold text-center text-gray-400 p-auto">{views}</td>
      <td
        className="text-center text-gray-400 p-auto"
        title={format(new Date(), 'yyyy MM dd, HH:SS')}
      >
        {formatDistanceToNow(new Date(last_posted_at), { addSuffix: true })}
      </td>
    </tr>
  );
}

export function DiscourseFeed({
  className,
  logo,
  logoDark,
  logoTitle,
  forumUrl,
  category,
  pinned,
  limit,
  isDark,
}: {
  className?: string;
  logo?: string;
  logoDark?: string;
  logoTitle?: string;
  forumUrl: string;
  category: string;
  pinned?: boolean;
  limit?: number;
  isDark?: boolean;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const fetcher = useFetcher<any>();

  useEffect(() => {
    fetcher.submit(
      { intent: 'load-json', url: `${forumUrl.replace(/\/$/, '')}/c/${category}.json` },
      { method: 'POST' }
    );
    setLoading(false);
  }, []);

  const busy = loading || fetcher.state !== 'idle';
  const users = fetcher.data?.users as User[];
  const topics = fetcher.data?.topic_list
    ? (fetcher.data?.topic_list?.topics as Topic[]).map((t) => {
        t.posters = t.posters.map((p) => {
          return {
            ...p,
            user: users.find((u) => u.id === p.user_id),
          };
        });
        return t;
      })
    : undefined;
  const filteredTopics = topics
    ?.filter((t) => (!pinned ? !t.pinned : true))
    .filter((t) => t.visible && !t.archived)
    .slice(0, limit);

  return (
    <section className={className}>
      {busy && <DiscourseLoading />}
      {!busy && topics?.length === 0 && <div>No topics found</div>}
      {!busy && (topics?.length ?? 0) > 0 && (
        <div>
          <div className="flex justify-between w-full ">
            <div className="flex items-center justify-center p-1 rounded dark:bg-gray-100">
              {!isDark && logo && <img src={logo} alt={logoTitle} className="w-auto h-8 m-0" />}
              {isDark && <img src={logoDark ?? logo} alt={logoTitle} className="w-auto h-8 m-0" />}
            </div>
            <a
              className="cursor-pointer not-prose hover:underline"
              href={`${forumUrl}/c/${category}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2 className="m-0 text-lg font-bold text-gray-400 capitalize">{category}</h2>
            </a>
          </div>
          <table className="mt-2 table-auto">
            <thead className="[&>*]:text-gray-400 border-b-4 border-gray-200">
              <tr>
                <th>Topic</th>
                <th></th>
                <th className="text-center">Replies</th>
                <th className="text-center">Views</th>
                <th className="text-center">Activity</th>
              </tr>
            </thead>
            <tbody>
              {filteredTopics?.map((t) => (
                <DiscourseFeedItem key={t.id} topic={t} forumUrl={forumUrl} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
