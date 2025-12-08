import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1>API Center Dashboard</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
        <Link href="/joke-api/v1" passHref>
          <div style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '20px',
            width: '300px',
            cursor: 'pointer',
            boxShadow: '2px 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h2>Joke API</h2>
            <p>Get a random joke or add your own!</p>
          </div>
        </Link>
        {/* Add more API cards here */}
      </div>
    </div>
  );
}
