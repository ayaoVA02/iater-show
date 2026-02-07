// src/hooks/useDeviceType.js
import { useEffect, useState } from 'react';

const getDeviceType = () => {
  const ua = navigator.userAgent;

  if (/iPad|Tablet|PlayBook|Silk/i.test(ua) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(ua))) {
    return 'tablet';
  }

  if (/Android|iPhone|iPod/i.test(ua)) {
    return 'mobile';
  }

  return 'desktop';
};

const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState('desktop');

  useEffect(() => {
    setDeviceType(getDeviceType());
  }, []);

  return deviceType;
};

export default useDeviceType;
