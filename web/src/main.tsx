import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@/index.css';
import WalletAdapter from '@/providers/WalletAdapter.tsx';
import App from '@/app/App.tsx';
import { Buffer } from 'buffer';

window.Buffer = Buffer;
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename='/cascade'>
      <WalletAdapter>
        <App />
      </WalletAdapter>
    </BrowserRouter>
  </StrictMode>,
);
