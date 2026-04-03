import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosClient';

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get('/api/News');
        const data = response.data || [];
        setNews(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to load news.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleClick = (id) => {
    navigate(`/news/${id}`);
  };

  const getSnippet = (text) => {
    if (!text) return '';
    const clean = String(text);
    return clean.length > 140 ? `${clean.slice(0, 140)}...` : clean;
  };

  if (loading) {
    return (
      <div className="page">
        <p>Loading news...</p>
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
      <h1>Latest News</h1>
      <div className="card-grid card-grid--news">
        {news.map((item) => {
          const id = item.id ?? item.Id;
          const title = item.title ?? item.Title;
          const content = item.content ?? item.Content;
          const imageUrl = item.imageUrl ?? item.ImageUrl;
          const createdDate = item.createdDate ?? item.CreatedDate;

          return (
            <article
              key={id}
              className="card"
              onClick={() => handleClick(id)}
              style={{ cursor: 'pointer' }}
            >
              {imageUrl && (
                <img src={imageUrl} alt={title} className="card-image" />
              )}
              <div className="card-body">
                <h2 className="card-title">{title}</h2>
                <p className="card-text">{getSnippet(content)}</p>
                {createdDate && (
                  <p className="card-meta">
                    {new Date(createdDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default NewsPage;