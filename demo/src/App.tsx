import React from 'react';
import logo from './logo.svg';
import snippet from '../../src/index'
import './App.css';

function App() {
  const jsSnippet = snippet.min({ apiKey: 'JULIOS API KEY', host: 'JULIOS HOST', ajsPath: 'JULIOS AJS PATH' })
  const jsSnippetScript = `<script>\n${ jsSnippet }\n</script>`

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {jsSnippetScript}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
