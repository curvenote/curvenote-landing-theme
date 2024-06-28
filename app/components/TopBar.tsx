import classNames from 'classnames';
import { useSiteManifest } from '@myst-theme/providers';
import { ExternalOrInternalLink, ThemeButton } from '@myst-theme/site';
import { DownloadLinksArea } from './Downloads';
import { ActionMenu } from './myst/ActionMenu';
import { HomeLink } from './myst/HomeLink';

const DEFAULT_HEIGHT = 60;

export function TopBar() {
  const config = useSiteManifest();
  const { title, actions } = config ?? {};
  const { logo, logo_dark, logo_text, topbar_height, topbar_floating, topbar_fixed } =
    config?.options ?? {};

  const height = topbar_height ?? DEFAULT_HEIGHT;

  return (
    <div style={{ height: topbar_fixed || !topbar_floating ? height : 0 }}>
      <div
        className={classNames('flex top-0 z-30 w-full p-3 backdrop-blur md:px-8', {
          fixed: topbar_fixed,
          'absolute z-10': topbar_floating && !topbar_fixed,
          'border-b-[1px] border-stone-300 dark:border-stone-600 bg-white/80 dark:bg-stone-900/80':
            !topbar_floating,
        })}
        style={{ height: topbar_height ?? DEFAULT_HEIGHT }}
      >
        <nav className="flex-grow flex items-center justify-between flex-wrap max-w-[1440px] mx-auto">
          <div className="flex flex-row xl:min-w-[19.5rem] mr-2 sm:mr-7 justify-start items-center">
            <HomeLink name={title} logo={logo} logoDark={logo_dark} logoText={logo_text} />
          </div>
          <div className="flex items-center flex-grow w-auto">
            <div className="flex-grow block"></div>
            <ThemeButton />
            <div className="block sm:hidden">
              <ActionMenu actions={actions} />
              {/* this will not work as is, but we need some consolidated actions / downloads component */}
              <DownloadLinksArea />
            </div>
            <div className="hidden sm:block">
              {actions?.map((action, index) => (
                <ExternalOrInternalLink
                  key={action.url || index}
                  className="inline-block px-4 py-2 mx-1 mt-0 leading-none border rounded text-md border-stone-700 dark:border-white text-stone-700 dark:text-white hover:text-stone-500 dark:hover:text-neutral-800 hover:bg-neutral-100"
                  to={action.url}
                >
                  {action.title}
                </ExternalOrInternalLink>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
