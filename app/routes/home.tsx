import TilingWindowManager from '../components/TilingWindowManager';

export default function Home() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundSize: 'cover',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}>
        <TilingWindowManager />
      </div>
    </div>
  );
}