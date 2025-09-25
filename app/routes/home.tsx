import TilingWindowManager from '../components/TilingWindowManager';

export default function Home() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundImage: `url('https://cataas.com/cat')`,
      backgroundSize: 'cover',
    }}>
      <div style={{backgroundColor: 'rgba(0, 0, 0, 0.75)'}}>
        <TilingWindowManager />
      </div>
    </div>
  );
}