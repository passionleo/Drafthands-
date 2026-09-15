import React from 'react';
import { AppWalkthroughVideo } from './AppWalkthroughVideo';

interface LandingVideoPlayerProps {
  onLaunchTopic?: (topicId: string) => void;
  autoPlay?: boolean;
}

export function LandingVideoPlayer({ onLaunchTopic, autoPlay = true }: LandingVideoPlayerProps) {
  return (
    <AppWalkthroughVideo
      autoPlay={autoPlay}
      onLaunchTopic={onLaunchTopic}
      className="w-full shadow-2xl"
    />
  );
}

