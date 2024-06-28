import { CustomBlockRenderer } from './block';
import { DiscourseRenderer } from './discourse';
import { ScienceIconRenderer } from './scienceicons';

export const renderers = {
  block: CustomBlockRenderer,
  scienceicon: ScienceIconRenderer,
  discourse: DiscourseRenderer,
};
