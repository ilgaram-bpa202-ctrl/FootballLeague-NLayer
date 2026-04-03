import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axiosClient';

const NewsDetailPage = () => {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNewsItem = async () => {
      try {
        const response = await api.get(`/api/News/${id}`);
        setNewsItem(response.data);
      } catch (err) {
        setError('Failed to load news item.');
      } finally {
        setLoading(false);
      }
    };

    fetchNewsItem();
  }, [id]);

  if (loading) {
    return (
      <div className="page">
        <p>Loading news...</p>
      </div>
    );
  }

  if (error || !newsItem) {
    return (
      <div className="page">
        <p className="error-text">{error || 'News item not found.'}</p>
      </div>
    );
  }

  const title = newsItem.title ?? newsItem.Title;
  const content = newsItem.content ?? newsItem.Content;
  const imageUrl = newsItem.imageUrl ?? newsItem.ImageUrl;
  const createdDate = newsItem.createdDate ?? newsItem.CreatedDate;

  return (
    <div className="page">
      <h1>{title}</h1>
      {createdDate && (
        <p className="page-subtitle">
          {new Date(createdDate).toLocaleString()}
        </p>
      )}
      {imageUrl && (
        <div style={{ margin: '1rem 0' }}>
          <img
            src={imageUrl}
            alt={title}
            style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: '0.75rem' }}
          />
        </div>
      )}
      <div className="card">
        <div className="card-body">
          <p className="card-text">{content}</p>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage;