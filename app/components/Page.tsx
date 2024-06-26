import { type PageLoader } from '@myst-theme/common';
import { useLoaderData } from '@remix-run/react';
import { PageFrame } from './PageFrame';
import { TopBar } from './TopBar';
import { GridSystemProvider } from '@myst-theme/providers';
import { PageMain } from './PageMain';

export default function Page() {
  const { page: article } = useLoaderData() as { page: PageLoader };

  return (
    <PageFrame>
      <TopBar />
      <GridSystemProvider gridSystem="article-center-grid">
        <article className="article article-center-grid subgrid-gap">
          <PageMain article={article} />
        </article>
      </GridSystemProvider>
    </PageFrame>
  );
}
