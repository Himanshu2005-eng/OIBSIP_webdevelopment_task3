import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';

export const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('Verifying your email...');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const { data } = await API.get(`/auth/verify-email/${token}`);
        setStatus(data.message || 'Email verified successfully!');
        setSuccess(true);
      } catch (err) {
        setStatus(err.response?.data?.message || 'Verification link is invalid or expired.');
        setSuccess(false);
      }
    };
    verifyToken();
  }, [token]);

  return (
    <div className="container" style={{ maxWidth: '460px', marginTop: '3rem', textAlign: 'center' }}>
      <div className="card">
        <h2>Email Verification</h2>
        <p style={{ margin: '1.5rem 0', color: success ? 'var(--success)' : 'var(--primary)' }}>
          {status}
        </p>
        {success && (
          <Link to="/login" className="btn btn-primary">
            Proceed to Login
          </Link>
        )}
      </div>
    </div>
  );
};