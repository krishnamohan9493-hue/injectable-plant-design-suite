import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' // 👈 1. Import React Query
import './index.css'
import App from './App.tsx'

// 👇 2. Create a client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Optional: Prevents queries from refetching when you switch tabs
      refetchOnWindowFocus: false, 
      // Optional: Keeps data fresh for 5 minutes
      staleTime: 1000 * 60 * 5, 
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 👇 3. Wrap your App in the Provider */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
