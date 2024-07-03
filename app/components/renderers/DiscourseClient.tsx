import { useEffect, useState } from 'react';
import { DiscourseFeed } from './DiscourseFeed';
import { DiscoursePlaceholder } from './DiscourseWidget';
import { formatDiscourseTopics } from './discourse';
import { Topic } from '~/transforms/discourseTypes';

export function DiscourseClient({
  url,
  category,
  limit,
  className,
  logo,
  logoDark,
  logoTitle,
  isDark,
}: {
  url: string;
  category: string;
  limit?: number;
  className?: string;
  logo?: string;
  logoDark?: string;
  logoTitle?: string;
  isDark?: boolean;
}) {
  const [topics, setTopics] = useState<Topic[] | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetch(`${url.replace(/\/$/, '')}/c/${category}.json`)
      .then(async (resp) => {
        if (resp.ok) {
          const data = await resp.json();
          const dto = formatDiscourseTopics(data.topic_list.topics, data.users, { limit });
          setTopics(dto);
        } else {
          setError('Could not fetch topics.');
          console.error(`response not ok: ${resp.status} ${resp.statusText}`);
        }
      })
      .catch((e) => {
        setError('Could not fetch topics.');
        console.error(e);
      });
  }, []);

  return (
    <div>
      {!topics && !error && (
        <DiscoursePlaceholder placeholder={<span className="animate-pulse">loading</span>} />
      )}
      {(topics || error) && (
        <DiscourseFeed
          url={url}
          category={category}
          topics={topics ?? []}
          error={error}
          className={className}
          logo={logo}
          logoDark={logoDark}
          logoTitle={logoTitle}
          isDark={isDark}
        />
      )}
    </div>
  );
}
