import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axiosClient';
import { useCart } from '../context/CartContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/api/Product/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError('Failed to load product.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="page">
        <p>Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page">
        <p className="error-text">{error || 'Product not found.'}</p>
      </div>
    );
  }

  const idVal = product.id ?? product.Id;
  const name = product.name ?? product.Name;
  const description = product.description ?? product.Description;
  const price = product.price ?? product.Price;
  const imageUrl = product.imageUrl ?? product.ImageUrl;
  const stockQuantity = product.stockQuantity ?? product.StockQuantity;

  const handleAddToCart = () => {
    addToCart({
      id: idVal,
      name,
      price,
      imageUrl,
    });
    alert('Added to cart!');
  };

  return (
    <div className="page">
      <h1>{name}</h1>
      <p className="page-subtitle">
        Price: {price} • In stock: {stockQuantity}
      </p>
      {imageUrl && (
        <div style={{ margin: '1rem 0' }}>
          <img
            src={imageUrl}
            alt={name}
            style={{
              width: '100%',
              maxHeight: 400,
              objectFit: 'cover',
              borderRadius: '0.75rem',
            }}
          />
        </div>
      )}
      <div className="card">
        <div className="card-body">
          <p className="card-text">{description}</p>
          <div style={{ marginTop: '1rem' }}>
            <button type="button" className="button-primary" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;