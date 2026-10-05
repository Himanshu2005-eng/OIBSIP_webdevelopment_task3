import React, { useEffect, useState } from 'react';
import API from '../services/api';

export const AdminDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stockInputs, setStockInputs] = useState({});
  const [archiveSearch, setArchiveSearch] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [invRes, ordRes] = await Promise.all([
        API.get('/inventory'),
        API.get('/orders/all')
      ]);
      setInventory(invRes.data.data || []);
      setOrders(ordRes.data.orders || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const payload = { status: newStatus };
      if (newStatus === 'Delivered') {
        payload.paymentStatus = 'completed';
      }

      await API.patch(`/orders/${orderId}/status`, payload);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, ...payload } : o));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleStockUpdate = async (id) => {
    const amountToAdd = Number(stockInputs[id]);
    if (isNaN(amountToAdd) || amountToAdd <= 0) {
      alert('Please enter a valid positive quantity to add.');
      return;
    }

    try {
      const { data } = await API.put(`/inventory/${id}`, { stock: amountToAdd });
      
      setInventory(prev =>
        prev.map(item => (item._id === id ? data.data : item))
      );
      
      setStockInputs(prev => ({ ...prev, [id]: '' }));
      alert(`Added ${amountToAdd} units to stock!`);
    } catch (err) {
      alert('Error updating stock: ' + (err.response?.data?.message || err.message));
    }
  };

  const activeOrders = orders.filter(o => o.status !== 'Delivered');
  const completedOrders = orders.filter(o => o.status === 'Delivered');

  // Filter completed archive by search term
  const filteredCompletedOrders = completedOrders.filter(order => {
    const term = archiveSearch.toLowerCase().trim();
    if (!term) return true;

    const orderIdMatch = order._id.toLowerCase().includes(term);
    const customerMatch = order.user?.name?.toLowerCase().includes(term) || false;
    const pizzaMatch = order.items?.some(it => 
      (it.name || 'Custom Pizza').toLowerCase().includes(term)
    );

    return orderIdMatch || customerMatch || pizzaMatch;
  });

  // Low stock detector (items under 10 units)
  const lowStockItems = inventory.filter(item => item.stock < 10);

  // Total Realized Earnings (all completed or delivered orders)
  const totalEarnings = orders
    .filter(o => o.paymentStatus === 'completed' || o.status === 'Delivered')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Active Pipeline Value
  const pendingRevenue = activeOrders
    .filter(o => o.paymentStatus !== 'completed')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  if (loading) return (
    <div style={{ padding: '5rem', textAlign: 'center', color: '#64748B', fontWeight: 600 }}>
      Loading Operations Dashboard...
    </div>
  );

  return (
    <div style={{ maxWidth: '1180px', margin: '2rem auto', padding: '0 1rem' }}>
      
      {/* Operations Command Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.25rem 1.5rem',
        background: '#0F172A',
        borderRadius: '12px',
        color: '#FFFFFF',
        marginBottom: '1.5rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38BDF8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Operations Command Center
          </span>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.15rem 0 0' }}>
            Store Management
          </h1>
        </div>
        <button
          onClick={fetchData}
          style={{
            padding: '0.6rem 1.1rem',
            background: '#1E293B',
            color: '#F8FAFC',
            border: '1px solid #334155',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          🔄 Refresh Feed
        </button>
      </div>

      {error && (
        <div style={{ padding: '1rem', background: '#FEF2F2', border: '1px solid #F87171', color: '#B91C1C', borderRadius: '8px', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {/* KPI Financial Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        
        {/* Total Realized Earnings */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #BBF7D0',
          borderRadius: '12px',
          padding: '1.25rem 1.5rem',
          boxShadow: 'var(--shadow-sm)',
          borderLeft: '5px solid #16A34A'
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#15803D', textTransform: 'uppercase' }}>
            Total Realized Earnings
          </span>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#16A34A', marginTop: '0.35rem' }}>
            ₹{totalEarnings}
          </div>
          <small style={{ color: '#64748B' }}>From {completedOrders.length} delivered/settled orders</small>
        </div>

        {/* Pipeline Revenue */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '1.25rem 1.5rem',
          boxShadow: 'var(--shadow-sm)',
          borderLeft: '5px solid #D97706'
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#B45309', textTransform: 'uppercase' }}>
            Pending in Pipeline
          </span>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#D97706', marginTop: '0.35rem' }}>
            ₹{pendingRevenue}
          </div>
          <small style={{ color: '#64748B' }}>{activeOrders.length} orders in prep/transit</small>
        </div>

        {/* Lifetime Order Volume */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '1.25rem 1.5rem',
          boxShadow: 'var(--shadow-sm)',
          borderLeft: '5px solid #0F172A'
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
            Lifetime Volume
          </span>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0F172A', marginTop: '0.35rem' }}>
            {orders.length} orders
          </div>
          <small style={{ color: '#64748B' }}>Across signature pizzas & custom builder</small>
        </div>

      </div>

      {/* Critical Low Stock Warning Banner */}
      {lowStockItems.length > 0 && (
        <div style={{
          background: '#FFF1F2',
          border: '1px solid #FECDD3',
          borderLeft: '5px solid #E11D48',
          borderRadius: '10px',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.8rem'
        }}>
          <div>
            <span style={{ fontWeight: 800, color: '#9F1239', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              ⚠️ Low Stock Alert: {lowStockItems.length} {lowStockItems.length === 1 ? 'ingredient is' : 'ingredients are'} running low!
            </span>
            <div style={{ marginTop: '0.35rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {lowStockItems.map(item => (
                <span
                  key={item._id}
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    background: '#FFFFFF',
                    border: '1px solid #FDA4AF',
                    color: '#BE123C',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '6px'
                  }}
                >
                  {item.name}: only {item.stock} left
                </span>
              ))}
            </div>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#881337', fontWeight: 600 }}>
            Restock below to prevent failed customer orders
          </span>
        </div>
      )}

      {/* 1. Stock Inventory Table */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '2rem',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Inventory Management ({inventory.length} items)
          </h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--border)', color: '#64748B' }}>
                <th style={{ padding: '0.85rem 1.5rem', fontWeight: 600 }}>Item Name</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Category</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Unit Price</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Current Stock</th>
                <th style={{ padding: '0.85rem 1.5rem', fontWeight: 600 }}>Add Quantity</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map(item => (
                <tr key={item._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.85rem 1.5rem', fontWeight: 600, color: '#0F172A' }}>{item.name}</td>
                  <td style={{ padding: '0.85rem 1rem', textTransform: 'capitalize', color: '#64748B' }}>{item.category}</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#334155' }}>₹{item.price}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '20px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      background: item.stock < 10 ? '#FEF2F2' : '#F0FDF4',
                      color: item.stock < 10 ? '#DC2626' : '#16A34A',
                      border: item.stock < 10 ? '1px solid #FECACA' : '1px solid #BBF7D0'
                    }}>
                      {item.stock} in stock
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="number"
                        min="1"
                        placeholder="+ qty"
                        value={stockInputs[item._id] || ''}
                        onChange={e => setStockInputs({ ...stockInputs, [item._id]: e.target.value })}
                        style={{ width: '80px', padding: '0.35rem 0.5rem', border: '1px solid var(--border)', borderRadius: '6px' }}
                      />
                      <button
                        onClick={() => handleStockUpdate(item._id)}
                        style={{
                          padding: '0.35rem 0.75rem',
                          background: '#0F172A',
                          color: '#FFF',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                      >
                        Add Stock
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Active Orders Live Pipeline */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '2rem',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Active Order Pipeline ({activeOrders.length})
          </h3>
        </div>

        {activeOrders.length === 0 ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: '#94A3B8' }}>
            No orders are currently in preparation.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--border)', color: '#64748B' }}>
                  <th style={{ padding: '0.85rem 1.5rem', fontWeight: 600 }}>Order ID</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Customer</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Items Ordered</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Total</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Payment</th>
                  <th style={{ padding: '0.85rem 1.5rem', fontWeight: 600 }}>Workflow Status</th>
                </tr>
              </thead>
              <tbody>
                {activeOrders.map(order => (
                  <tr key={order._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.85rem 1.5rem', fontFamily: 'monospace', fontWeight: 700, color: '#0F172A' }}>
                      #{order._id.slice(-6)}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 600, color: '#0F172A' }}>{order.user?.name || 'Customer'}</div>
                      <small style={{ color: '#64748B' }}>{order.deliveryAddress?.phone || order.user?.email}</small>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem' }}>
                      {order.items?.map((item, i) => (
                        <div key={i} style={{ color: '#334155' }}>
                          • {item.name || 'Custom Pizza'} (×{item.quantity || 1})
                        </div>
                      ))}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#0F172A' }}>
                      ₹{order.totalAmount}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '20px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        background: order.paymentStatus === 'completed' ? '#F0FDF4' : '#FFFBEB',
                        color: order.paymentStatus === 'completed' ? '#16A34A' : '#D97706',
                        border: order.paymentStatus === 'completed' ? '1px solid #BBF7D0' : '1px solid #FDE68A'
                      }}>
                        {order.paymentStatus === 'completed' ? '✓ Paid' : '⏳ Pending'}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1.5rem' }}>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        style={{
                          padding: '0.45rem 0.75rem',
                          borderRadius: '6px',
                          border: '1px solid var(--border)',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          background: order.status === 'In the Kitchen' ? '#EFF6FF'
                                    : order.status === 'Sent to Delivery' ? '#FFFBEB'
                                    : '#F8FAFC',
                          color: order.status === 'In the Kitchen' ? '#1D4ED8'
                               : order.status === 'Sent to Delivery' ? '#B45309'
                               : '#334155',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="Received">Received</option>
                        <option value="In the Kitchen">In the Kitchen</option>
                        <option value="Sent to Delivery">Sent to Delivery</option>
                        <option value="Delivered">Delivered (Archive)</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 3. Completed Orders Archive with Live Filter */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0F172A' }}>
              Delivered Orders Archive ({filteredCompletedOrders.length})
            </h4>
            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
              Showing {filteredCompletedOrders.length} of {completedOrders.length} completed orders
            </span>
          </div>

          {/* Real-time search filter input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Search by customer, ID, or pizza..."
              value={archiveSearch}
              onChange={e => setArchiveSearch(e.target.value)}
              style={{
                padding: '0.5rem 0.85rem',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '0.85rem',
                width: '260px',
                outline: 'none'
              }}
            />
            {archiveSearch && (
              <button
                onClick={() => setArchiveSearch('')}
                style={{
                  background: '#F1F5F9',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.45rem 0.65rem',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                  color: '#64748B'
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {completedOrders.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.9rem' }}>
            Delivered orders will be archived here upon completion.
          </div>
        ) : filteredCompletedOrders.length === 0 ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.9rem' }}>
            No archived orders matched "<b>{archiveSearch}</b>".
          </div>
        ) : (
          <div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--border)', color: '#64748B' }}>
                    <th style={{ padding: '0.75rem 1.5rem' }}>Order ID</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Customer</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Pizzas</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Payment</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 1.5rem', textAlign: 'right' }}>Amount Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCompletedOrders.map(order => (
                    <tr key={order._id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '0.75rem 1.5rem', fontFamily: 'monospace', color: '#64748B' }}>
                        #{order._id.slice(-6)}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#334155', fontWeight: 500 }}>
                        {order.user?.name || 'Customer'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#64748B' }}>
                        {order.items?.map(it => it.name || 'Custom Pizza').join(', ')}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#16A34A', fontWeight: 600 }}>
                        ✓ Paid
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#16A34A', fontWeight: 700 }}>
                        ✓ Delivered
                      </td>
                      <td style={{ padding: '0.75rem 1.5rem', fontWeight: 700, color: '#0F172A', textAlign: 'right' }}>
                        ₹{order.totalAmount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Filtered Earnings Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.25rem 1.5rem',
              background: '#F8FAFC',
              borderTop: '2px solid var(--border)'
            }}>
              <div>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>
                  {archiveSearch ? 'Filtered Revenue' : 'Total Realized Revenue'}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'block' }}>
                  {archiveSearch 
                    ? `Sum of ${filteredCompletedOrders.length} matching delivered orders`
                    : 'Sum of all successfully settled and archived orders'
                  }
                </span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#16A34A' }}>
                ₹{filteredCompletedOrders.reduce((s, o) => s + (o.totalAmount || 0), 0)}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminDashboard;