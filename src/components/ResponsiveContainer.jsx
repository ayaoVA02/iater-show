import React, { useEffect, useState } from 'react';

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

const ResponsiveContainer = ({ children }) => {
  const [deviceType, setDeviceType] = useState(null);

  useEffect(() => {
    const type = getDeviceType();
    setDeviceType(type);
  }, []);

  if (!deviceType) return null; // Optional loading state

  let containerStyle = {
    margin: '0 auto',
    height: '100vh',
    backgroundColor: '#ffff',
    overflow: 'auto',
    padding: 16,
  };

  if (deviceType === 'desktop') {
    containerStyle.width = '1024px';
  } else if (deviceType === 'mobile') {
    containerStyle.width = '390px';
  } else if (deviceType === 'tablet') {
    containerStyle.width = '768px';
  }

  return (
    <div style={containerStyle}>
      {/* Hide this block only for mobile */}
      {/* {deviceType !== 'mobile' && (
        <div style={{ backgroundColor: '#ddd', padding: 10, marginBottom: 20 }}>
          <h3>This content is hidden on mobile devices.</h3>
        </div>
      )} */}

      <div>
        {/* <h1>{`Device: ${deviceType.toUpperCase()}`}</h1> */}
        {children}
      </div>
    </div>
  );
};

export default ResponsiveContainer;
