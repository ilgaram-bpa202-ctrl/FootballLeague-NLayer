import './App.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NewsPage from './pages/NewsPage';
import ShopPage from './pages/ShopPage';
import TeamPage from './pages/TeamPage';
import TeamDetailPage from './pages/TeamDetailPage';
import PlayerPage from './pages/PlayerPage';
import MatchPage from './pages/MatchPage';
import MatchDetailPage from './pages/MatchDetailPage';
import NewsDetailPage from './pages/NewsDetailPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AdminPage from './pages/AdminPage';
import CartPage from './pages/CartPage';
import { hasAdminRole } from './utils/auth';
import { CartProvider } from './context/CartContext';

function AdminRoute({ children }) {
  const location = useLocation();
  if (!hasAdminRole()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  return (
    <CartProvider>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:id" element={<NewsDetailPage />} />

            <Route path="/shop" element={<ShopPage />} />
            <Route path="/shop/:id" element={<ProductDetailPage />} />

            <Route path="/teams" element={<TeamPage />} />
            <Route path="/teams/:id" element={<TeamDetailPage />} />

            <Route path="/players" element={<PlayerPage />} />

            <Route path="/matches" element={<MatchPage />} />
            <Route path="/matches/:id" element={<MatchDetailPage />} />

            <Route path="/cart" element={<CartPage />} />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </CartProvider>
  );
}

export default App;