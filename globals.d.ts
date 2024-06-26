import React from 'react';

interface TopicsListProps extends React.HTMLAttributes<HTMLElement> {
  'discourse-url': string;
  category: string;
  'per-page': string;
  // Add other props as needed
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'd-topics-list': TopicsListProps;
    }
  }
}
