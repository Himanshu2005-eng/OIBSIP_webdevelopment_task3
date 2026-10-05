import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');
    setLoading(true);

    try {
      const { data } = await API.post('/auth/forgot-password', { email });
      setMsg(data.message || 'Password reset link sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Error requesting password reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '420px', marginTop: '2rem' }}>
      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Reset Password</h2>
        {error && <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}>{error}</div>}
        {msg && <div style={{ color: 'var(--success)', marginBottom: '1rem' }}>{msg}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Enter your registered Email</label>
            <input
              type="email"
              className="form-control"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
          Remember your password? <Link to="/login" style={{ color: 'var(--primary)' }}>Back to login</Link>
        </p>
      </div>
    </div>
  );
};