import React, { useState, useEffect } from 'react';
import Window from './Window';
import Terminal from './Terminal';
import AppLauncher from './AppLauncher';
import FileExplorer from './FileExplorer';

interface WindowInfo {
  id: number;
  type: 'Terminal' | 'File Explorer';
}

const TilingWindowManager: React.FC = () => {
  const [windows, setWindows] = useState<WindowInfo[]>([]);
  const [isAppLauncherOpen, setIsAppLauncherOpen] = useState(false);

  const addWindow = (type: 'Terminal' | 'File Explorer') => {
    setWindows(prevWindows => [...prevWindows, { id: prevWindows.length + 1, type }]);
    setIsAppLauncherOpen(false);
  };

  const removeWindow = () => {
    setWindows(prevWindows => prevWindows.slice(0, -1));
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'c') {
        removeWindow();
      } else if (event.ctrlKey && event.code === 'Space') {
        event.preventDefault();
        setIsAppLauncherOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', height: '100vh' }}>
      <AppLauncher isOpen={isAppLauncherOpen} onClose={() => setIsAppLauncherOpen(false)} onAppSelect={addWindow} />
      {windows.map((windowInfo) => (
        <Window key={windowInfo.id}>
          {windowInfo.type === 'Terminal' && <Terminal />}
          {windowInfo.type === 'File Explorer' && <FileExplorer />}
        </Window>
      ))}
    </div>
  );
};

export default TilingWindowManager;
