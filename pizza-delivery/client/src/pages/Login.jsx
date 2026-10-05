import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

export const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await API.post('/auth/login', formData);

      // Save credentials for app & protected routes
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
      window.location.reload(); // Refresh to update Navbar auth state
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '420px',
      margin: '4rem auto',
      padding: '2rem',
      background: '#FFFFFF',
      borderRadius: '12px',
      border: '1px solid #E2E8F0',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.07)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <span style={{ fontSize: '2.5rem' }}>🍕</span>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', marginTop: '0.5rem' }}>
          Welcome Back
        </h2>
        <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Sign in to access your orders and pizza studio
        </p>
      </div>

      {error && (
        <div style={{
          padding: '0.8rem 1rem',
          background: '#FEF2F2',
          border: '1px solid #F87171',
          color: '#B91C1C',
          borderRadius: '8px',
          marginBottom: '1.25rem',
          fontSize: '0.88rem'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
            Email Address
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              fontSize: '0.9rem',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              fontSize: '0.9rem',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: '0.5rem',
            padding: '0.85rem',
            background: '#E11D48',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.88rem', color: '#64748B' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: '#E11D48', fontWeight: 700, textDecoration: 'none' }}>
          Create Account
        </Link>
      </div>
    </div>
  );
};

export default Login;