import { DiscoursePlaceholder } from './DiscourseWidget';
import { formatDistanceToNow, format } from 'date-fns';
import type { Topic } from '../../transforms/discourseTypes';
import { Pin } from 'lucide-react';

function DiscourseFeedItem({ topic, url }: { topic: Topic; url: string }) {
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
    pinned,
  } = topic;

  const replies = reply_count > 1000 ? `${(reply_count / 1000).toFixed()}k` : reply_count;
  const views = view_count > 1000 ? `${(view_count / 1000).toFixed(1)}k` : view_count;

  return (
    <tr>
      <td>
        <a
          className="cursor-pointer not-prose group"
          href={`${url}/t/${slug}/${id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="relative text-lg group-hover:underline">
            {pinned && <Pin className="inline-block w-4 h-4 mb-1 mr-1" />}
            {fancy_title ?? title}
          </div>
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
                  backgroundImage: `url(${url}${imgUrl})`,
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
  url,
  category,
  topics,
  error,
  className,
  logo,
  logoDark,
  logoTitle,
  isDark,
}: {
  url: string;
  category: string;
  topics: Topic[];
  error?: string;
  className?: string;
  logo?: string;
  logoDark?: string;
  logoTitle?: string;
  isDark?: boolean;
}) {
  if (error || !topics) {
    return (
      <section className={className}>
        <DiscoursePlaceholder placeholder={<span className="text-red-300">{error}</span>} />
      </section>
    );
  }

  return (
    <section className={className}>
      {topics.length === 0 && <DiscoursePlaceholder placeholder={<span>no topics found</span>} />}
      {(topics.length ?? 0) > 0 && (
        <div>
          <div className="flex justify-between w-full ">
            <div className="flex items-center justify-center p-1 rounded dark:bg-gray-100">
              {!isDark && logo && <img src={logo} alt={logoTitle} className="w-auto h-8 m-0" />}
              {isDark && <img src={logoDark ?? logo} alt={logoTitle} className="w-auto h-8 m-0" />}
            </div>
            <a
              className="cursor-pointer not-prose hover:underline"
              href={`${url}/c/${category}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2 className="m-0 text-lg font-bold text-gray-400 capitalize">{category}</h2>
            </a>
          </div>
          <table className="mt-2 table-auto">
            <thead className="border-b-4 border-gray-200">
              <tr>
                <th className="text-gray-400">Topic</th>
                <th className="text-gray-400"></th>
                <th className="text-center text-gray-400">Replies</th>
                <th className="text-center text-gray-400">Views</th>
                <th className="text-center text-gray-400">Activity</th>
              </tr>
            </thead>
            <tbody>
              {topics.map((t) => (
                <DiscourseFeedItem key={t.id} topic={t} url={url} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
