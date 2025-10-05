import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@/index.css';
import App from '@/app/App.tsx';
import { Buffer } from 'buffer';
import { ChainContextProvider } from './context/ChainContextProvider';
import { SelectedWalletAccountContextProvider } from './context/SelectedWalletAccountContextProvider';
import { ConnectionContextProvider } from './context/ConnectionContextProvider';

window.Buffer = Buffer;
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename='/cascade'>
      <ChainContextProvider>
        <SelectedWalletAccountContextProvider>
          <ConnectionContextProvider>
            <App />
          </ConnectionContextProvider>
        </SelectedWalletAccountContextProvider>
      </ChainContextProvider>
    </BrowserRouter>
  </StrictMode>,
);
