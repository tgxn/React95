import React, { useEffect, useState } from 'react';

import { Tooltip } from '../Tooltip/Tooltip';
import { tooltip } from './TaskBar.css';

function formatAMPM(date: Date, amPmFormat = false) {
  function checkTime(i: number) {
    return i < 10 ? `0${i}` : i;
  }

  const h = date.getHours();
  const m = date.getMinutes();

  if (!amPmFormat) {
    return `${checkTime(h)}:${checkTime(m)}`;
  }

  const isPM = h >= 12;
  const hour12 = h % 12 || 12;
  return `${hour12}:${checkTime(m)} ${isPM ? 'PM' : 'AM'}`;
}

export type ClockProps = {
  clockAmPm: boolean;
  onClick?: () => void;
};

export const Clock = ({ clockAmPm, onClick }: ClockProps) => {
  const [timer, setTimer] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTimer(formatAMPM(now, clockAmPm));
    });

    return () => clearInterval(interval);
  }, []);

  return (
    <Tooltip className={tooltip} onClick={onClick}>
      {timer}
    </Tooltip>
  );
};
