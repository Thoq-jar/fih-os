import React, { useState, useEffect } from 'react';
import Window from './Window';
import Terminal from './Terminal';

const TilingWindowManager: React.FC = () => {
  const [windows, setWindows] = useState<number[]>([1]);

  const addWindow = () => {
    setWindows(prevWindows => [...prevWindows, prevWindows.length + 1]);
  };

  const removeWindow = () => {
    setWindows(prevWindows => prevWindows.slice(0, -1));
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'q') {
        addWindow();
      } else if (event.ctrlKey && event.key === 'c') {
        removeWindow();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', height: '100vh' }}>
      {windows.map(windowId => (
        <Window key={windowId}>
          <Terminal />
        </Window>
      ))}
    </div>
  );
};

export default TilingWindowManager;
