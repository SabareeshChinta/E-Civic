import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import { AuthProvider } from './context/AuthContext.js';
import { IssueProvider } from './context/IssueContext.js';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <IssueProvider>
        <App />
      </IssueProvider>
    </AuthProvider>
  </React.StrictMode>
);
