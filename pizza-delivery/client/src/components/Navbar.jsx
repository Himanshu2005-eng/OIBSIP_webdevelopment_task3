import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import API from '../services/api';

export const Navbar = () => {
  const navigate = useNavigate();
  const { totalItems, setIsCartOpen } = useCart();
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [dailySummary, setDailySummary] = useState(null);
  const [isSettling, setIsSettling] = useState(false);

  const token = localStorage.getItem('token');
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    user = null;
  }

  const handleLogoutClick = async () => {
    // If the logged-in user is an Admin, trigger EOD settlement & cleanup
    if (user?.role === 'admin') {
      setIsSettling(true);
      try {
        const { data } = await API.post('/orders/admin/settle-day');
        setDailySummary(data.summary);
        setShowSummaryModal(true);
      } catch (err) {
        console.error('Failed to settle orders:', err);
        finalizeLogout();
      } finally {
        setIsSettling(false);
      }
    } else {
      finalizeLogout();
    }
  };

  const finalizeLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setShowSummaryModal(false);
    navigate('/login');
    window.location.reload();
  };

  return (
    <>
      <header
        style={{
          background: '#0F172A',
          borderBottom: '1px solid #1E293B',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: '1180px',
            margin: '0 auto',
            padding: '0.85rem 1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span style={{ fontSize: '1.4rem' }}>🍕</span>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#FFFFFF' }}>
              PizzaExpress
            </span>
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <Link
              to="/"
              style={{
                color: '#94A3B8',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              Menu & Builder
            </Link>

            {token && (
              <Link
                to="/orders"
                style={{
                  color: '#94A3B8',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                }}
              >
                My Orders
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                style={{
                  color: '#38BDF8',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                }}
              >
                Admin Panel
              </Link>
            )}

            {/* Cart Trigger */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.45rem 0.95rem',
                background: '#E11D48',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
              }}
            >
              <span>🛒 Cart</span>
              <span
                style={{
                  background: '#FFFFFF',
                  color: '#E11D48',
                  borderRadius: '50%',
                  padding: '0.1rem 0.45rem',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                }}
              >
                {totalItems || 0}
              </span>
            </button>

            {token ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: '#CBD5E1', fontSize: '0.85rem', fontWeight: 500 }}>
                  Hi, {user?.name?.split(' ')[0] || 'User'}
                </span>
                <button
                  type="button"
                  disabled={isSettling}
                  onClick={handleLogoutClick}
                  style={{
                    background: '#1E293B',
                    color: '#CBD5E1',
                    border: '1px solid #334155',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: isSettling ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSettling ? 'Settling Day...' : 'Sign Out'}
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                style={{
                  background: '#FFFFFF',
                  color: '#0F172A',
                  padding: '0.45rem 0.95rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* End-Of-Day Settlement Summary Modal */}
      {showSummaryModal && dailySummary && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '2rem',
              maxWidth: '440px',
              width: '90%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.25)',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '3rem' }}>📊</span>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', margin: '0.5rem 0 0.25rem' }}>
              Daily Store Settlement
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Date: <b style={{ color: '#0F172A' }}>{dailySummary.date}</b>
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.85rem',
                marginBottom: '1.25rem',
              }}
            >
              <div
                style={{
                  background: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  borderRadius: '10px',
                  padding: '1rem',
                }}
              >
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803D', textTransform: 'uppercase' }}>
                  Total Earnings
                </span>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#16A34A', marginTop: '0.2rem' }}>
                  ₹{dailySummary.totalEarnings}
                </div>
              </div>

              <div
                style={{
                  background: '#FFFBEB',
                  border: '1px solid #FDE68A',
                  borderRadius: '10px',
                  padding: '1rem',
                }}
              >
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#B45309', textTransform: 'uppercase' }}>
                  Pizzas Sold
                </span>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#D97706', marginTop: '0.2rem' }}>
                  {dailySummary.totalPizzasSold}
                </div>
              </div>
            </div>

            <div
              style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '0.75rem',
                fontSize: '0.8rem',
                color: '#475569',
                marginBottom: '1.5rem',
                textAlign: 'left',
                lineHeight: 1.4,
              }}
            >
              ✓ Delivered archive ({dailySummary.ordersCleared} orders) cleared for tomorrow.<br />
              🛡️ Unpaid or Undelivered active orders remain saved safely in your database.
            </div>

            <button
              type="button"
              onClick={finalizeLogout}
              style={{
                width: '100%',
                padding: '0.85rem',
                background: '#0F172A',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
              }}
            >
              Close & Log Out
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;