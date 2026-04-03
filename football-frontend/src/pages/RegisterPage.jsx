import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosClient';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    userName: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      await api.post('/api/Auth/register', {
        userName: form.userName,
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        password: form.password,
      });

      setSuccessMessage('Registration successful! You can now log in.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(
        err.response?.data ||
          'Registration failed. Please check your details and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-page">
      <h1>Register</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="userName">Username</label>
          <input
            id="userName"
            name="userName"
            type="text"
            value={form.userName}
            onChange={handleChange}
            placeholder="Choose a username"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="firstName">First name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={form.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={form.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Create a secure password"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>

        {error && <p className="error-text">{String(error)}</p>}
        {successMessage && (
          <p style={{ marginTop: '0.75rem', color: '#4ade80', fontSize: '0.9rem' }}>
            {successMessage}
          </p>
        )}
      </form>
    </div>
  );
};

export default RegisterPage;