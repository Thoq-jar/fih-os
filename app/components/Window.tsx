import React from 'react';
import './Window.css';

interface WindowProps {
  children: React.ReactNode;
}

const Window: React.FC<WindowProps> = ({ children }) => {
  return (
    <div className="window">
      <div className="window-content">
        {children}
      </div>
    </div>
  );
};

export default Window;