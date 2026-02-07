import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "./i18n.js";
import { AppWrapper } from "./dashboard/components/common/PageMeta.tsx";
import { ThemeProvider } from "./dashboard/context/ThemeContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from './context/AuthProvider.tsx';
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AppWrapper>
        <QueryClientProvider client={queryClient}>

          <AuthProvider> {/* ✅ Wrap your app with AuthProvider */}
            <App />
          </AuthProvider>

        </QueryClientProvider>
      </AppWrapper>
    </ThemeProvider>
  </StrictMode>,
)
