import { CurvenoteText } from '@curvenote/icons';
import { ThemeButton } from '@myst-theme/site';
import { CurvenoteLinks, SocialIcons } from '@curvenote/social';

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

export function SupportedByFooter() {
  return (
    <div className="col-screen article-center-grid bg-[#2A5F9D] py-3 px-6">
      <div className="grid grid-cols-1 gap-2 col-screen-inset md:grid-cols-12">
        <div className="text-center md:text-left md:col-span-6">
          <span className="text-sm text-white align-middle" aria-hidden="true">
            Supported by{' '}
          </span>
          <a href="https://curvenote.com" target="_blank" rel="noreferrer" className="align-middle">
            <CurvenoteText className="inline-block -translate-y-px" fill="#FFF" size={18} />
            <span className="sr-only">Supported by Curvenote</span>
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

export function DesignedByFooter() {
  return (
    <div className="px-6 pt-1 pb-[6px] bg-gray-400 dark:bg-stone-900 col-screen article-center-grid">
      <div className="grid grid-cols-1 gap-2 col-screen-inset md:grid-cols-12">
        <div className="text-center md:text-left md:col-span-6">
          <span className="text-sm text-white align-middle" aria-hidden="true">
            Theme designed by{' '}
          </span>
          <a href="https://curvenote.com" target="_blank" rel="noreferrer" className="align-middle">
            <CurvenoteText className="inline-block -translate-y-px" fill="#FFF" size={18} />
            <span className="sr-only">Theme designed by Curvenote</span>
          </a>
        </div>
      </div>
    </div>
  );
}
