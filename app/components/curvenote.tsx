import { CurvenoteText } from '@curvenote/icons';
import { ThemeButton } from '@myst-theme/site';

import { useEffect, useState } from 'react';

function useBreakpoint() {
  const [size, setSize] = useState(['base']);

  useEffect(() => {
    const handleResize = () => {
      const bp = ['base'];

      if (window.matchMedia('(min-width: 1280px)').matches) {
        bp.push('xl');
      }
      if (window.matchMedia('(min-width: 1024px)').matches) {
        bp.push('lg');
      }
      if (window.matchMedia('(min-width: 768px)').matches) {
        bp.push('md');
      }
      if (window.matchMedia('(min-width: 640px)').matches) {
        bp.push('sm');
      }

      setSize(bp);
    };

    // Listen to window resize events
    window.addEventListener('resize', handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

export function CurvenoteTag() {
  const breakpoint = useBreakpoint();

  return (
    <div className="bg-[#235F9D] absolute xl:right-4 top-0 right-[60px] flex flex-row px-2">
      <a
        href="https://curvenote.com"
        target="_blank"
        rel="noreferrer"
        className="inline-block py-2"
      >
        <CurvenoteText fill="#FFFFFF" size={breakpoint.includes('sm') ? 18 : 14} />
        <span className="sr-only">Curvenote</span>
      </a>
      <ThemeButton className="self-center inline-block w-5 h-5 ml-2 text-white border-white sm:w-6 sm:h-6" />
    </div>
  );
}

export function PoweredByCurvenote({ message, url }: { message?: string; url?: string }) {
  return (
    <div className="flex items-center gap-1">
      <div aria-hidden="true" className="text-[14px] text-[#235F9D] pointer-events-none">
        {message ?? 'Powered by'}
      </div>
      <a
        href={url ?? 'https://curvenote.com'}
        target="_blank"
        rel="noreferrer"
        className="inline-block"
      >
        <CurvenoteText size={16} />
        <span className="sr-only">Powered by Curvenote</span>
      </a>
    </div>
  );
}
