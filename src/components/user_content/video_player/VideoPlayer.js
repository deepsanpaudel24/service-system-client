import React from "react";
import {
  Player,
  ControlBar,
  ReplayControl,
  ForwardControl,
  CurrentTimeDisplay,
  TimeDivider,
  PlaybackRateMenuButton,
  VolumeMenuButton,
  BigPlayButton,
  LoadingSpinner
} from "video-react";
import "../../../../node_modules/video-react/dist/video-react.css";

const VideoPlayer = (props) => {
  const { source } = props
  return (
    <Player src={`http://127.0.0.1:5000/${source}`}>
      <BigPlayButton position="center" />
      <LoadingSpinner />
      <ControlBar>
        <ReplayControl seconds={5} order={1.1} />
        <ForwardControl seconds={5} order={1.2} />
        <CurrentTimeDisplay order={4.1} />
        <TimeDivider order={4.2} />
        <PlaybackRateMenuButton rates={[5, 2, 1, 0.5, 0.1]} order={7.1} />
        <VolumeMenuButton disabled />
      </ControlBar>
    </Player>
  );
};
export default VideoPlayer;