import React from 'react';

interface WindowProps {
  children: React.ReactNode;
}

const Window: React.FC<WindowProps> = ({ children }) => {
  return (
    <div style={{
      border: '1px solid white',
      padding: '10px',
      margin: '5px',
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(10px)',
    }}>
      {children}
    </div>
  );
};

export default Window;
