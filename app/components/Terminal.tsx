import React, { useState, useRef, useEffect } from 'react';
import { nekofetch } from '~/commands/nekofetch';
import * as fs from '../filesystem';

const Terminal: React.FC = () => {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [output, setOutput] = useState<React.ReactNode[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [cwd, setCwd] = useState('/home/user');
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalRef.current?.focus();
  }, []);

  const handleKeyDown = async (e: KeyboardEvent) => {
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      setCommand(prev => prev + e.key);
    } else if (e.key === 'Backspace') {
      setCommand(prev => prev.slice(0, -1));
    } else if (e.key === 'Enter') {
      const [cmd, ...args] = command.trim().split(' ');
      setHistory(prev => [...prev, command]);
      setCommandHistory(prev => [...prev, command]);
      setHistoryIndex(commandHistory.length + 1);

      let newOutput: React.ReactNode = '';

      switch (cmd) {
        case 'clear':
          setHistory([]);
          setOutput([]);
          setCommand('');
          return;
        case 'nekofetch':
          const info = await nekofetch();
          newOutput = (
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
          );
          break;
        case 'ls':
          try {
            const path = args[0] || cwd;
            const entries = fs.readdir(path);
            newOutput = <div>{entries.join(' ')}</div>;
          } catch (error: any) {
            newOutput = <p>{error.message}</p>;
          }
          break;
        case 'cat':
          try {
            const path = args[0];
            if (!path) {
              newOutput = <p>Usage: cat [file]</p>;
            } else {
              const content = fs.readFile(path.startsWith('/') ? path : `${cwd}/${path}`);
              newOutput = <pre>{content}</pre>;
            }
          } catch (error: any) {
            newOutput = <p>{error.message}</p>;
          }
          break;
        case 'touch':
          try {
            const path = args[0];
            if (!path) {
              newOutput = <p>Usage: touch [file]</p>;
            } else {
              fs.touch(path.startsWith('/') ? path : `${cwd}/${path}`);
            }
          } catch (error: any) {
            newOutput = <p>{error.message}</p>;
          }
          break;
        case 'mkdir':
          try {
            const path = args[0];
            if (!path) {
              newOutput = <p>Usage: mkdir [directory]</p>;
            } else {
              fs.mkdir(path.startsWith('/') ? path : `${cwd}/${path}`);
            }
          } catch (error: any) {
            newOutput = <p>{error.message}</p>;
          }
          break;
        case 'echo':
          try {
            const contentIndex = command.indexOf('>');
            if (contentIndex === -1) {
              newOutput = <p>Usage: echo [content] {">"} [file]</p>;
              break;
            }
            const content = command.substring(5, contentIndex).trim();
            const path = command.substring(contentIndex + 1).trim();
            fs.writeFile(path.startsWith('/') ? path : `${cwd}/${path}`, content);
          } catch (error: any) {
            newOutput = <p>{error.message}</p>;
          }
          break;
        case 'rm':
          try {
            const path = args[0];
            if (!path) {
              newOutput = <p>Usage: rm [file_or_directory]</p>;
            } else {
              fs.rm(path.startsWith('/') ? path : `${cwd}/${path}`);
            }
          } catch (error: any) {
            newOutput = <p>{error.message}</p>;
          }
          break;
        case 'cd':
          const path = args[0];
          if (!path) {
            setCwd('/home/user');
          } else {
            const newPath = path === '..' ? cwd.substring(0, cwd.lastIndexOf('/')) || '/' : path.startsWith('/') ? path : `${cwd}/${path}`;
            if (fs.exists(newPath) && fs.isDirectory(newPath)) {
              setCwd(newPath);
            } else {
              newOutput = <p>Directory not found: {newPath}</p>;
            }
          }
          break;
        default:
          newOutput = <p>Command not found: {command}</p>;
      }
      setOutput(prev => [...prev, newOutput]);
      setCommand('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        setHistoryIndex(prev => prev - 1);
        setCommand(commandHistory[historyIndex - 1]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        setHistoryIndex(prev => prev + 1);
        setCommand(commandHistory[historyIndex + 1]);
      } else {
        setHistoryIndex(commandHistory.length);
        setCommand('');
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [command, commandHistory, historyIndex, cwd]);

  return (
    <div
      ref={terminalRef}
      tabIndex={0}
      style={{ backgroundColor: 'transparent', color: 'white', height: '100%', padding: '10px', overflowY: 'auto', outline: 'none', fontFamily: 'monospace' }}
      onClick={() => terminalRef.current?.focus()}
    >
      <style>
        {`
          .cursor {
            display: inline-block;
            width: 10px;
            height: 18px;
            background-color: white;
            animation: blink 1s step-end infinite;
            vertical-align: middle;
          }

          @keyframes blink {
            50% {
              opacity: 0;
            }
          }
        `}
      </style>
      {history.map((cmd, i) => (
        <div key={i}>
          <p><span style={{ color: '#a855f7' }}>{cwd.replace('/home/user', '~')}</span> &gt; {cmd}</p>
          {output[i]}
        </div>
      ))}
      <div style={{ display: 'flex' }}>
        <span><span style={{ color: '#a855f7' }}>{cwd.replace('/home/user', '~')}</span> &gt; </span>
        <span>{command}</span>
        <span className="cursor" />
      </div>
    </div>
  );
};

export default Terminal;
