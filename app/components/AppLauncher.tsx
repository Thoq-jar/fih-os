import React from 'react';
import './AppLauncher.css';

interface AppLauncherProps {
  isOpen: boolean;
  onClose: () => void;
  onAppSelect: (app: "Terminal" | "File Explorer") => void;
}

const AppLauncher: React.FC<AppLauncherProps> = ({ isOpen, onClose, onAppSelect }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="app-launcher-overlay" onClick={onClose}>
      <div className="app-launcher" onClick={(e) => e.stopPropagation()}>
        <h2>App Launcher</h2>
        <input type="text" placeholder="Search for apps..." />
        <div className="app-grid">
          <div className="app-item" onClick={() => onAppSelect('Terminal')}>
            <span>Terminal</span>
          </div>
          <div className="app-item" onClick={() => onAppSelect('File Explorer')}>
            <span>File Explorer</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLauncher;
