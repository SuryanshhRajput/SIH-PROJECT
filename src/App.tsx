import React from 'react';
import './App.css';
import PhysicsLearningPlatform from './PhysicsLearningPlatform';
import ErrorBoundary from './ErrorBoundary';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <PhysicsLearningPlatform />
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
