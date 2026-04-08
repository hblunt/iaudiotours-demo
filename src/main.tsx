import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './shared/layout/App';
import './shared/theme/theme.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
