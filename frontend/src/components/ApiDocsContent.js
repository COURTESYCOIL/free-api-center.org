import React from 'react';

const ApiDocsContent = () => {
  return (
    <div>
      <h2>API Documentation</h2>
      <h3>Available API Endpoints:</h3>
      <ul>
        <li>
          <a href="/wiki/api/v1/joke">Joke API (v1)</a>
          <p>Description: Fetches a random joke.</p>
          <p>Endpoint: <code>/api/v1/joke</code></p>
          <p>Example Usage:</p>
          <pre><code>fetch('/api/v1/joke')
  .then(response => response.json())
  .then(data => console.log(data));</code></pre>
        </li>
        {/* Add more API endpoints here */}
      </ul>

      <h3>Discord Bot Integration:</h3>
      <p>Documentation and examples for Discord Bot integration will be provided here.</p>
    </div>
  );
};

export default ApiDocsContent;