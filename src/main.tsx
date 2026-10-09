import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}> {/* 👈 THIS IS REQUIRED */}
      <App />
    </QueryClientProvider>
  </StrictMode>
)
