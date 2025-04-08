import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './components/Login';
import Cookies from 'js-cookie';
import ProductListPage from './pages/ProductListPage';
import ProductAddPage from './pages/ProductAddPage';
import ProductEditPage from './pages/ProductEditPage';
import CategoryAddPage from './pages/CategoryAddPage';
import CategoryEditPage from './pages/CategoryEditPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authCookie = Cookies.get('auth');
    if (authCookie) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={isAuthenticated ? <ProductListPage />: <Navigate to="/login" />} />
            <Route path="/add" element={isAuthenticated ? <ProductAddPage /> : <Navigate to="/login" />} />
            <Route path="/edit/:id" element={isAuthenticated ? <ProductEditPage /> : <Navigate to="/login" />} />
            <Route path="/categories/add" element={isAuthenticated ? <CategoryAddPage /> : <Navigate to="/login" />} />
            <Route path="/categories/edit/:id" element={isAuthenticated ? <CategoryEditPage /> : <Navigate to="/login" />} />
            <Route path="*" element={<div><h2>Page Not Found</h2><Link to="/login">Go Home</Link></div>} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;