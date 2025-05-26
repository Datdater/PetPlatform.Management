import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Routers from "./routers/Routers";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // data fetching config
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: false,
    },
  },
});

// Create a theme instance
const theme = createTheme({
  // You can customize your theme here
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <Routers />
          <ReactQueryDevtools />
        </ThemeProvider>
      </QueryClientProvider>
    
  );
}

export default App;