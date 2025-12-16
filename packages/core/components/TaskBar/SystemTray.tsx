import React from 'react';

import { Frame, FrameProps } from '../Frame/Frame';

import { Clock } from './Clock';

export type SystemTrayProps = {
  trayIcons?: React.ReactNode;
  showClock?: boolean;
  clockAmPm?: boolean;
  clockOnClick?: () => void;
} & FrameProps<'div'>;

// `system tray` container: renders optional icons (children) and the `Clock`
export const SystemTray = ({
  trayIcons,
  showClock = true,
  clockAmPm = false,
  clockOnClick,
  ...props
}: SystemTrayProps) => {
  return (
    <Frame
      boxShadow="$in"
      px="$6"
      py="$2"
      display="flex"
      justifyContent="center"
      alignItems="center"
      gap="$2"
      {...props}
    >
      <span style={{ display: 'flex' }}>{trayIcons}</span>
      {showClock && (
        <span>
          <Clock onClick={clockOnClick} clockAmPm={clockAmPm} />
        </span>
      )}
    </Frame>
  );
};

export default SystemTray;
