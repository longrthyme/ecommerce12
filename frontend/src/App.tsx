import './App.css';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { LoadingProvider } from './context/LoadingContext';

function App() {
  return (
    <LoadingProvider>
    <AuthProvider>
      <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
    </AuthProvider>
    </LoadingProvider>
  );
}

export default App;
