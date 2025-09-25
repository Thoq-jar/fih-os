import React, { useState, useEffect } from 'react';
import * as fs from '../filesystem';

const FileExplorer: React.FC = () => {
  const [cwd, setCwd] = useState('/home/user');
  const [entries, setEntries] = useState<string[]>([]);

  useEffect(() => {
    setEntries(fs.readdir(cwd));
  }, [cwd]);

  const handleDoubleClick = (entry: string) => {
    const newPath = `${cwd}/${entry}`.replace('//', '/');
    if (fs.isDirectory(newPath)) {
      setCwd(newPath);
    } else {
      alert(fs.readFile(newPath));
    }
  };

  const goUp = () => {
    if (cwd === '/') return;
    const newPath = cwd.substring(0, cwd.lastIndexOf('/')) || '/';
    setCwd(newPath);
  };

  return (
    <div style={{ color: 'white', fontFamily: 'monospace', padding: '10px', height: '100%' }}>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={goUp} disabled={cwd === '/'}>Up</button>
        <span style={{ marginLeft: '10px' }}>{cwd}</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {entries.map(entry => (
          <div
            key={entry}
            onDoubleClick={() => handleDoubleClick(entry)}
            style={{
              padding: '10px',
              margin: '5px',
              cursor: 'pointer',
              backgroundColor: fs.isDirectory(`${cwd}/${entry}`.replace('//', '/')) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              border: '1px solid transparent',
            }}
          >
            {fs.isDirectory(`${cwd}/${entry}`.replace('//', '/')) ? '📁' : '📄'} {entry}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileExplorer;
