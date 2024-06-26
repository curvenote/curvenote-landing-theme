import { GridSystemProvider, TabStateProvider, UiStateProvider } from '@myst-theme/providers';
import { ComputeOptionsProvider } from '@myst-theme/jupyter';
import { ProjectProvider, useBaseurl } from '@myst-theme/providers';
import { ThebeLoaderAndServer } from '@myst-theme/jupyter';

export function PageFrame({ children }: { children: React.ReactNode }) {
  const baseurl = useBaseurl();
  return (
    <UiStateProvider>
      <TabStateProvider>
        <ProjectProvider>
          <ComputeOptionsProvider
            features={{ notebookCompute: false, figureCompute: true, launchBinder: true }}
          >
            <ThebeLoaderAndServer baseurl={baseurl ?? ''}>{children}</ThebeLoaderAndServer>
          </ComputeOptionsProvider>
        </ProjectProvider>
      </TabStateProvider>
    </UiStateProvider>
  );
}
