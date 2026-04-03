import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosClient';
import { useCart } from '../context/CartContext';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/api/Product');
        const data = response.data || [];
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/shop/${id}`);
  };

  const handleAddToCart = (product) => {
    const id = product.id ?? product.Id;
    const name = product.name ?? product.Name;
    const price = product.price ?? product.Price;
    const imageUrl = product.imageUrl ?? product.ImageUrl;

    addToCart({ id, name, price, imageUrl });
    alert('Added to cart!');
  };

  const getSnippet = (text) => {
    if (!text) return '';
    const clean = String(text);
    return clean.length > 120 ? `${clean.slice(0, 120)}...` : clean;
  };

  if (loading) {
    return (
      <div className="page">
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <p className="error-text">{error}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Shop</h1>
      <div className="card-grid card-grid--shop">
        {products.map((product) => {
          const id = product.id ?? product.Id;
          const name = product.name ?? product.Name;
          const description = product.description ?? product.Description;
          const price = product.price ?? product.Price;
          const imageUrl = product.imageUrl ?? product.ImageUrl;

          return (
            <article key={id} className="card">
              <div
                onClick={() => handleCardClick(id)}
                style={{ cursor: 'pointer' }}
              >
                {imageUrl && (
                  <img src={imageUrl} alt={name} className="card-image" />
                )}
                <div className="card-body">
                  <h2 className="card-title">{name}</h2>
                  <p className="card-text">{getSnippet(description)}</p>
                  <p className="card-meta">Price: {price}</p>
                </div>
              </div>
              <div className="card-body" style={{ borderTop: '1px solid #1f2937' }}>
                <button
                  type="button"
                  className="button-primary"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default ShopPage;