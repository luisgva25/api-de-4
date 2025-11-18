import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './index.css';
import './App.css';
import App from './App';

// Configuración del tema de Bootstrap
const theme = document.createElement('style');
theme.innerHTML = `
  :root {
    --bs-primary: #ff6b00;
    --bs-primary-rgb: 255, 107, 0;
    --bs-body-bg: #232122;
    --bs-body-color: #ffffff;
  }
  
  .btn-primary {
    --bs-btn-bg: var(--bs-primary);
    --bs-btn-border-color: var(--bs-primary);
    --bs-btn-hover-bg: #e65c00;
    --bs-btn-hover-border-color: #e65c00;
    --bs-btn-active-bg: #cc5200;
    --bs-btn-active-border-color: #cc5200;
  }
`;
document.head.appendChild(theme);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
