import { useState } from 'react';

export default function JokeApiPage() {
  const [joke, setJoke] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJoke = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/v1/joke');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setJoke(data.joke);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1>Joke API Documentation</h1>

      <div style={{ marginBottom: '30px' }}>
        <h2>Endpoint:</h2>
        <p><code>GET /api/v1/joke</code></p>
        <p>Returns a random joke.</p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>Test the API:</h2>
        <button onClick={fetchJoke} disabled={loading} style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px'
        }}>
          {loading ? 'Fetching Joke...' : 'Get New Joke'}
        </button>
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {joke && <p style={{ marginTop: '15px', fontSize: '18px', fontStyle: 'italic' }}>{joke}</p>}
      </div>

      {/* Add instructions for adding jokes if applicable */}
    </div>
  );
}
