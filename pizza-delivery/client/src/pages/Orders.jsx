import React, { useEffect, useState } from 'react';
import API from '../services/api';

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/orders/my-orders');
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'In the Kitchen':
        return { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' };
      case 'Sent to Delivery':
        return { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' };
      case 'Delivered':
        return { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' };
      default:
        return { bg: '#F8FAFC', text: '#475569', border: '#E2E8F0' };
    }
  };

  if (loading) return (
    <div style={{ padding: '5rem', textAlign: 'center', color: '#64748B', fontWeight: 600 }}>
      Loading your orders...
    </div>
  );

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
          My Orders Tracker
        </h1>
        <button
          onClick={fetchOrders}
          style={{
            padding: '0.5rem 1rem',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            color: '#334155'
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {error && (
        <div style={{ padding: '1rem', background: '#FEF2F2', border: '1px solid #F87171', color: '#B91C1C', borderRadius: '8px', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '4rem 1rem',
          textAlign: 'center',
          color: '#64748B'
        }}>
          <h3>No Orders Yet</h3>
          <p style={{ margin: '0.5rem 0 1.25rem' }}>Explore our 25 signature pizzas or create your custom recipe!</p>
          <a
            href="/"
            style={{
              display: 'inline-block',
              padding: '0.7rem 1.4rem',
              background: '#E11D48',
              color: '#FFFFFF',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 700
            }}
          >
            Start Ordering
          </a>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {orders.map((order) => {
            const badge = getStatusBadge(order.status);
            return (
              <div
                key={order._id}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Order ID</span>
                    <div style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1.05rem', color: '#0F172A' }}>
                      #{order._id.slice(-8).toUpperCase()}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                    <span style={{
                      padding: '0.25rem 0.65rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      background: order.paymentStatus === 'completed' ? '#F0FDF4' : '#FFFBEB',
                      color: order.paymentStatus === 'completed' ? '#16A34A' : '#D97706',
                      border: order.paymentStatus === 'completed' ? '1px solid #BBF7D0' : '1px solid #FDE68A'
                    }}>
                      {order.paymentStatus === 'completed' ? '✓ Paid' : '⏳ Payment Pending'}
                    </span>

                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      background: badge.bg,
                      color: badge.text,
                      border: `1px solid ${badge.border}`
                    }}>
                      ● {order.status}
                    </span>
                  </div>
                </div>

                {/* Items List with Precise Titles */}
                <div style={{ marginBottom: '1.2rem' }}>
                  {order.items && order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                      <div>
                        {/* Correctly displays item name whether Preset or Custom */}
                        <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.95rem' }}>
                          {item.name || 'Custom Pizza'}
                        </span>
                        {(!item.name || item.name.startsWith('Custom')) && (
                          <span style={{ color: '#64748B', fontSize: '0.85rem' }}>
                            {' '}({[item.base?.name, item.sauce?.name, item.cheese?.name].filter(Boolean).join(', ')})
                          </span>
                        )}
                        <span style={{ color: '#E11D48', fontWeight: 700, marginLeft: '0.5rem', fontSize: '0.85rem' }}>
                          × {item.quantity || 1}
                        </span>
                      </div>
                      <span style={{ fontWeight: 600, color: '#334155' }}>
                        ₹{item.price * (item.quantity || 1)}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                  <span style={{ color: '#64748B' }}>
                    Delivery to: <b>{order.deliveryAddress?.street}, {order.deliveryAddress?.city}</b> ({order.deliveryAddress?.phone})
                  </span>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#E11D48' }}>
                    Total: ₹{order.totalAmount}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;