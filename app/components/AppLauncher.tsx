import React from 'react';
import './AppLauncher.css';

interface AppLauncherProps {
  isOpen: boolean;
  onClose: () => void;
}

const AppLauncher: React.FC<AppLauncherProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="app-launcher-overlay" onClick={onClose}>
      <div className="app-launcher" onClick={(e) => e.stopPropagation()}>
        <h2>App Launcher</h2>
        <input type="text" placeholder="Search for apps..." />
      </div>
    </div>
  );
};

export default AppLauncher;
