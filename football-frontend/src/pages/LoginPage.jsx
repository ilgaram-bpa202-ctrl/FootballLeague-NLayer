import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosClient';

const LoginPage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/api/Auth/login', {
        userName,
        password,
      });

      // API returns { token: "...", expiration: "..." }
      const token = response.data?.token;
      if (token) {
        localStorage.setItem('token', token);
        navigate('/');
      } else {
        setError('Login succeeded but token was not returned.');
      }
    } catch (err) {
      setError(
        err.response?.data ||
          'Login failed. Please check your username and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-page">
      <h1>Login</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
            placeholder="Enter your username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {error && <p className="error-text">{String(error)}</p>}
      </form>
    </div>
  );
};

export default LoginPage;