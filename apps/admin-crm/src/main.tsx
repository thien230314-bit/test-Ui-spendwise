import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './demo/DemoApp';
import './index.css';
import './glass.css';


// Execute one-time clean state migration before app tree hydration


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
