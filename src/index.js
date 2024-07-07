import React from 'react';
import ReactDOM from 'react-dom/client'; // Importing ReactDOM from client for concurrent mode
import './index.css';
import App from './App'
import { QueryClient, QueryClientProvider } from 'react-query';




const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

        <QueryClientProvider client={queryClient}>
          
          <App />
         
        </QueryClientProvider>
    
   

  </React.StrictMode>
);
