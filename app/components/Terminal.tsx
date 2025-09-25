import React, { useState, useRef, useEffect } from 'react';
import { nekofetch } from '../commands/nekofetch';

const Terminal: React.FC = () => {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [output, setOutput] = useState<React.ReactNode[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCommand = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setHistory([...history, command]);
      if (command === 'nekofetch') {
        const info = await nekofetch();
        setOutput([
          ...output,
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={info.cat} alt="cat" width="200" style={{ marginRight: '20px' }} />
            <div>
              <p><span style={{ color: '#a855f7' }}>OS:</span> <span style={{ color: 'white' }}>{info.os}</span></p>
              <p><span style={{ color: '#a855f7' }}>Browser:</span> <span style={{ color: 'white' }}>{info.browser}</span></p>
              <p><span style={{ color: '#a855f7' }}>CPU:</span> <span style={{ color: 'white' }}>{info.cpu}</span></p>
              <p><span style={{ color: '#a855f7' }}>GPU:</span> <span style={{ color: 'white' }}>{info.gpu}</span></p>
              <p><span style={{ color: '#a855f7' }}>RAM:</span> <span style={{ color: 'white' }}>{info.ram}</span></p>
              <p><span style={{ color: '#a855f7' }}>Resolution:</span> <span style={{ color: 'white' }}>{info.resolution}</span></p>
              <p><span style={{ color: '#a855f7' }}>Language:</span> <span style={{ color: 'white' }}>{info.language}</span></p>
            </div>
          </div>
        ]);
      } else {
        setOutput([...output, <p>Command not found: {command}</p>]);
      }
      setCommand('');
    }
  };

  return (
    <div style={{ backgroundColor: 'transparent', color: 'white', height: '100%', padding: '10px', overflowY: 'auto' }} onClick={() => inputRef.current?.focus()}>
      {history.map((cmd, i) => (
        <div key={i}>
          <p>&gt; {cmd}</p>
          {output[i]}
        </div>
      ))}
      <div style={{ display: 'flex' }}>
        <span>&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleCommand}
          style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
        />
      </div>
    </div>
  );
};

export default Terminal;
