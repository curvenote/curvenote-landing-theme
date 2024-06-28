import { useEffect, useState } from 'react';
import DiscourseIcon from '@scienceicons/react/24/solid/DiscourseIcon';

export function DiscoursePlaceholder({ placeholder }: { placeholder: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center p-6 border-4 border-gray-200 dark:border-gray-600">
      <div className="flex flex-col items-center text-gray-500 dark:text-gray-300">
        <span className="flex items-end text-xl font-black">
          <DiscourseIcon className="inline-block w-8 h-8" />
          iscourse
        </span>
        {placeholder}
      </div>
    </div>
  );
}

export function DiscourseWidget({
  url,
  category,
  limit,
}: {
  url: string;
  category: string;
  limit?: number;
}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `${url}/javascripts/embed-topics.js`;
    script.async = true;
    script.onload = () => {
      console.debug('Discourse script loaded successfully');
    };
    script.onerror = () => {
      console.error('Script failed to load');
    };

    document.body.appendChild(script);
    setLoaded(true);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      {!loaded && (
        <DiscoursePlaceholder placeholder={<span className="animate-pulse">loading</span>} />
      )}
      {loaded && (
        <div className="border-4 norder-gray-200 dark:border-gray-600 min-h-[60px]">
          <d-topics-list discourse-url={url} category={category} per-page={limit}></d-topics-list>
        </div>
      )}
    </div>
  );
}
