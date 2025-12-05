import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ApiDocsContent from './components/ApiDocsContent';
import './App.css';

// Placeholder Components
const Dashboard = () => <h2>Dashboard Page</h2>;
const Wiki = () => <h2>Wiki Page</h2>;
const ApiDocs = () => <ApiDocsContent />;
const ApiV1Docs = () => <ApiDocsContent />;

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              <Link to="/wiki">Wiki</Link>
            </li>
            <li>
              <Link to="/wiki/api">API Docs</Link>
            </li>
            <li>
              <Link to="/wiki/api/v1">API v1 Docs</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/wiki" element={<Wiki />} />
          <Route path="/wiki/api" element={<ApiDocs />} />
          <Route path="/wiki/api/v1" element={<ApiV1Docs />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
