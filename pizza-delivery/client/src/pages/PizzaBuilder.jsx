import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useCart } from '../context/CartContext';

// 25 distinct photography URLs matched specifically to each recipe
const PIZZA_IMAGE_MAP = {
  // Classic 5
  'Classic Tomato Herb Simple': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
  'Margherita Royale': 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80',
  'Capsicum & Crisp Onion Crunch': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
  'Sweet Corn & Cheese Melt': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
  'Double Cheese Margherita': 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&q=80',

  // Veg 11
  'Corn & Olive Garden': 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?auto=format&fit=crop&w=600&q=80',
  'Fiery Jalapeno & Red Paprika': 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80',
  'Farmhouse Special': 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=600&q=80',
  'Paneer Tikka Supreme': 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80',
  'Spicy Triple Tango': 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=600&q=80',
  'Mushroom & Garlic Herb': 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=600&q=80',
  'Four Cheese Feast': 'https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&w=600&q=80',
  'Peri Peri Paneer Passion': 'https://images.unsplash.com/photo-1576458088443-04a19bb13da6?auto=format&fit=crop&w=600&q=80',
  'Veggie Paradise': 'https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?auto=format&fit=crop&w=600&q=80',
  'Smoky BBQ Veg Crunch': 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=600&q=80',
  'Tuscan Sun-Dried Tomato & Basil': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',

  // Exotic 9
  'Zesty Pepper Green Duo': 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80',
  'Exotic Mediterranean Delight': 'https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?auto=format&fit=crop&w=600&q=80',
  'Golden Delight': 'https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&w=600&q=80',
  'Fiesta Mexican Salsa': 'https://images.unsplash.com/photo-1584365685547-9a5fb6f3a70c?auto=format&fit=crop&w=600&q=80',
  'Wild Truffle Forest Mushroom': 'https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?auto=format&fit=crop&w=600&q=80',
  'Garden Fresh Primavera': 'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=600&q=80',
  'Cheddar Melt Onion Burst': 'https://images.unsplash.com/photo-1564936281291-294551497d81?auto=format&fit=crop&w=600&q=80',
  'Italian Classic Supreme': 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=600&q=80',
  'Napoli Herb & Buffalo Mozzarella': 'https://images.unsplash.com/photo-1589187151053-5ec8818e661b?auto=format&fit=crop&w=600&q=80'
};

const DEFAULT_PIZZA_IMG = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80';

// Visual Card Header with Photo and Category Badge
const SignatureCardImage = ({ name, category, badge }) => {
  const imageUrl = PIZZA_IMAGE_MAP[name] || DEFAULT_PIZZA_IMG;

  return (
    <div style={{
      width: '100%',
      height: '170px',
      borderRadius: '8px',
      overflow: 'hidden',
      position: 'relative',
      marginBottom: '1rem',
      backgroundColor: '#E2E8F0'
    }}>
      <img
        src={imageUrl}
        alt={name}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = DEFAULT_PIZZA_IMG;
        }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transition: 'transform 0.25s ease'
        }}
      />

      {/* Category Pill Tag */}
      <span style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        fontSize: '0.72rem',
        fontWeight: 700,
        padding: '0.25rem 0.65rem',
        borderRadius: '20px',
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(6px)',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        gap: '0.3rem'
      }}>
        {category === 'Veg' ? '🌱 Veg' : category === 'Exotic' ? '✨ Exotic' : '🍕 Classic'}
      </span>

      {/* Promotional Badge */}
      {badge && (
        <span style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          fontSize: '0.72rem',
          fontWeight: 800,
          padding: '0.25rem 0.65rem',
          borderRadius: '20px',
          background: '#E11D48',
          color: '#FFFFFF',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        }}>
          {badge}
        </span>
      )}
    </div>
  );
};

// Flat Graphic Visualizer for Builder Studio
const PizzaFlatVisualizer = ({ base, sauce, cheese, veggies }) => {
  const getCrustTone = () => {
    switch (base?.name) {
      case 'Thin Crust': return { fill: '#E6A360', stroke: '#B46C26' };
      case 'Cheese Burst': return { fill: '#F59E0B', stroke: '#D97706' };
      case 'Whole Wheat Thin': return { fill: '#B47B49', stroke: '#78461C' };
      default: return { fill: '#EBB075', stroke: '#B9732B' };
    }
  };

  const getSauceTone = () => {
    switch (sauce?.name) {
      case 'Spicy Peri Peri': return '#DC2626';
      case 'Creamy Garlic Parmesan': return '#FEF3C7';
      case 'Smoky BBQ Sauce': return '#7C2D12';
      default: return '#EF4444';
    }
  };

  const getCheeseTone = () => {
    switch (cheese?.name) {
      case 'Cheddar Blend': return '#FDE047';
      case 'Feta & Ricotta': return '#F8FAFC';
      default: return '#FEF08A';
    }
  };

  const veggiePositions = [
    { top: '30%', left: '32%' },
    { top: '26%', left: '58%' },
    { top: '48%', left: '26%' },
    { top: '44%', left: '68%' },
    { top: '65%', left: '42%' },
    { top: '60%', left: '60%' },
    { top: '40%', left: '48%' },
    { top: '70%', left: '28%' }
  ];

  const crust = getCrustTone();

  return (
    <div style={{
      width: '100%',
      maxWidth: '260px',
      aspectRatio: '1',
      margin: '0 auto 1.25rem',
      borderRadius: '50%',
      background: '#FFFFFF',
      border: '8px solid #F1F5F9',
      boxShadow: 'var(--shadow-md)',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      <div style={{
        width: '92%',
        height: '92%',
        borderRadius: '50%',
        backgroundColor: base ? crust.fill : '#E2E8F0',
        border: `12px solid ${base ? crust.stroke : '#CBD5E1'}`,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.25s ease'
      }}>
        {sauce && (
          <div style={{
            width: '88%',
            height: '88%',
            borderRadius: '50%',
            backgroundColor: getSauceTone(),
            position: 'absolute',
            transition: 'all 0.25s ease'
          }} />
        )}
        {cheese && (
          <div style={{
            width: '82%',
            height: '82%',
            borderRadius: '50%',
            backgroundColor: getCheeseTone(),
            position: 'absolute',
            transition: 'all 0.25s ease'
          }} />
        )}
        {veggies && veggies.map((v, i) => {
          const pos = veggiePositions[i % veggiePositions.length];
          const color = v.name.includes('Corn') ? '#EAB308'
                      : v.name.includes('Capsicum') ? '#16A34A'
                      : v.name.includes('Onion') ? '#9333EA'
                      : v.name.includes('Olive') ? '#0F172A'
                      : v.name.includes('Mushroom') ? '#78350F'
                      : '#EA580C';

          return (
            <div
              key={v._id || i}
              style={{
                position: 'absolute',
                top: pos.top,
                left: pos.left,
                width: '16px',
                height: '16px',
                borderRadius: v.name.includes('Olive') ? '50%' : '4px',
                backgroundColor: color,
                border: '2px solid rgba(255,255,255,0.85)',
                boxShadow: 'var(--shadow-sm)',
                transform: `rotate(${i * 45}deg)`,
                zIndex: 5
              }}
              title={v.name}
            />
          );
        })}
        {!base && (
          <span style={{ color: '#64748B', fontWeight: 600, fontSize: '0.85rem', zIndex: 10 }}>
            Choose a crust
          </span>
        )}
      </div>
    </div>
  );
};

export const PizzaBuilder = () => {
  const [activeTab, setActiveTab] = useState('menu');

  const {
    cart,
    addToCart,
    updateQuantity,
    removeCartItem,
    clearCart,
    totalPrice,
    isCartOpen,
    setIsCartOpen
  } = useCart();

  const [presetPizzas, setPresetPizzas] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [inventory, setInventory] = useState({ base: [], sauce: [], cheese: [], veggie: [] });
  const [selectedBase, setSelectedBase] = useState(null);
  const [selectedSauce, setSelectedSauce] = useState(null);
  const [selectedCheese, setSelectedCheese] = useState(null);
  const [selectedVeggies, setSelectedVeggies] = useState([]);

  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [paymentOption, setPaymentOption] = useState('upi');

  const [address, setAddress] = useState(() => {
    try {
      const saved = localStorage.getItem('pizza_delivery_address');
      return saved ? JSON.parse(saved) : { street: '', city: '', zipCode: '', phone: '' };
    } catch {
      return { street: '', city: '', zipCode: '', phone: '' };
    }
  });

  const [submitting, setSubmitting] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [createdOrderData, setCreatedOrderData] = useState(null);

  const handleAddressChange = (field, value) => {
    setAddress(prev => {
      const updated = { ...prev, [field]: value };
      localStorage.setItem('pizza_delivery_address', JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [invRes, presetRes] = await Promise.all([
        API.get('/inventory'),
        API.get('/pizzas/preset')
      ]);

      const grouped = { base: [], sauce: [], cheese: [], veggie: [] };
      invRes.data.data.forEach(item => {
        if (grouped[item.category]) grouped[item.category].push(item);
      });
      setInventory(grouped);

      if (grouped.base.length > 0) setSelectedBase(grouped.base[0]);
      if (grouped.sauce.length > 0) setSelectedSauce(grouped.sauce[0]);
      if (grouped.cheese.length > 0) setSelectedCheese(grouped.cheese[0]);

      setPresetPizzas(presetRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2200);
  };

  const handleVeggieToggle = (item) => {
    if (selectedVeggies.find(v => v._id === item._id)) {
      setSelectedVeggies(selectedVeggies.filter(v => v._id !== item._id));
    } else {
      setSelectedVeggies([...selectedVeggies, item]);
    }
  };

  const calculateCustomUnitPrice = () => {
    const b = selectedBase?.price || 0;
    const s = selectedSauce?.price || 0;
    const c = selectedCheese?.price || 0;
    const v = selectedVeggies.reduce((acc, veg) => acc + veg.price, 0);
    return b + s + c + v;
  };

  const handleAddPreset = (pizza) => {
    const fallbackBase = inventory.base[0]?._id;
    const fallbackSauce = inventory.sauce[0]?._id;
    const fallbackCheese = inventory.cheese[0]?._id;

    addToCart({
      id: `preset_${pizza._id || pizza.name}`,
      name: pizza.name,
      base: fallbackBase,
      sauce: fallbackSauce,
      cheese: fallbackCheese,
      veggies: [],
      price: pizza.price,
      type: 'preset'
    });
    showNotification(`✓ ${pizza.name} added to cart`);
  };

  const handleAddCustom = () => {
    if (!selectedBase || !selectedSauce || !selectedCheese) {
      alert('Please select Base, Sauce, and Cheese first!');
      return;
    }

    addToCart({
      id: `custom_${Date.now()}`,
      name: `Custom Pizza (${selectedBase.name})`,
      base: selectedBase._id,
      sauce: selectedSauce._id,
      cheese: selectedCheese._id,
      veggies: selectedVeggies.map(v => v._id),
      details: `${selectedSauce.name}, ${selectedCheese.name}${selectedVeggies.length > 0 ? ', ' + selectedVeggies.map(v => v.name).join(', ') : ''}`,
      price: calculateCustomUnitPrice(),
      type: 'custom'
    });
    showNotification('✓ Custom Pizza added to cart');
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please sign in to complete your order!');
      window.location.href = '/login';
      return;
    }

    localStorage.setItem('pizza_delivery_address', JSON.stringify(address));

    setSubmitting(true);
    try {
      const itemsPayload = cart.map(item => ({
        name: item.name,
        base: item.base,
        sauce: item.sauce,
        cheese: item.cheese,
        veggies: item.veggies || [],
        price: item.price,
        quantity: item.quantity
      }));

      const { data } = await API.post('/orders/create', {
        items: itemsPayload,
        totalAmount: totalPrice,
        deliveryAddress: address,
        paymentMethod: paymentOption
      });

      if (paymentOption === 'cod') {
        alert(`🎉 Cash on Delivery Order #${data.order?._id || 'Confirmed'} placed!`);
        clearCart();
        setIsCartOpen(false);
        window.location.href = '/orders';
        return;
      }

      setCreatedOrderData(data.order);
      setActiveModal(paymentOption);
    } catch (err) {
      alert(err.response?.data?.message || 'Order failed to process.');
    } finally {
      setSubmitting(false);
    }
  };

  const completePayment = async () => {
    try {
      if (createdOrderData?._id) {
        await API.post('/orders/verify-payment', {
          orderId: createdOrderData._id
        });
      }
      alert(`🎉 Payment Successful! Order confirmed.`);
      clearCart();
      setIsCartOpen(false);
      window.location.href = '/orders';
    } catch (err) {
      console.error(err);
      window.location.href = '/orders';
    }
  };

  const filteredPizzas = selectedCategory === 'All'
    ? presetPizzas
    : presetPizzas.filter(p => p.category === selectedCategory);

  if (loading) return (
    <div style={{ padding: '5rem', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>
      Loading full pizza menu & ingredients...
    </div>
  );

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '2.5rem 1rem 3.5rem', position: 'relative' }}>
      
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#0F172A',
          color: '#FFFFFF',
          padding: '0.75rem 1.25rem',
          borderRadius: '8px',
          boxShadow: 'var(--shadow-md)',
          fontWeight: 600,
          fontSize: '0.9rem',
          zIndex: 1000
        }}>
          {toastMessage}
        </div>
      )}

      {/* Header Container */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem', paddingTop: '0.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>
            {activeTab === 'menu' ? '25 Signature Pizzas' : 'Custom Pizza Studio'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '0.35rem 0 0' }}>
            {activeTab === 'menu'
              ? 'Browse chef recipes with custom recipe photography and add items directly to your cart.'
              : 'Design your own custom recipe and add to cart when ready.'}
          </p>
        </div>

        <div style={{ display: 'flex', background: '#E2E8F0', padding: '4px', borderRadius: '10px' }}>
          <button
            onClick={() => setActiveTab('menu')}
            style={{
              padding: '0.55rem 1.1rem',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              background: activeTab === 'menu' ? '#E11D48' : 'transparent',
              color: activeTab === 'menu' ? '#FFFFFF' : '#475569',
              transition: 'all 0.15s ease'
            }}
          >
            🍕 25 Signature Pizzas
          </button>
          <button
            onClick={() => setActiveTab('builder')}
            style={{
              padding: '0.55rem 1.1rem',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              background: activeTab === 'builder' ? '#E11D48' : 'transparent',
              color: activeTab === 'builder' ? '#FFFFFF' : '#475569',
              transition: 'all 0.15s ease'
            }}
          >
            🛠️ Custom Studio
          </button>
        </div>
      </div>

      {/* SECTION 1: 25 SIGNATURE PIZZAS MENU */}
      {activeTab === 'menu' && (
        <div>
          <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.8rem', flexWrap: 'wrap' }}>
            {['All', 'Classic', 'Veg', 'Exotic'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '20px',
                  border: selectedCategory === cat ? '2px solid #E11D48' : '1px solid var(--border)',
                  background: selectedCategory === cat ? '#FFF1F2' : '#FFFFFF',
                  color: selectedCategory === cat ? '#BE123C' : 'var(--text-dark)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                {cat} ({cat === 'All' ? presetPizzas.length : presetPizzas.filter(p => p.category === cat).length})
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            {filteredPizzas.map((pizza, idx) => (
              <div
                key={pizza._id || idx}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 20px -3px rgba(0, 0, 0, 0.1)';
                  const img = e.currentTarget.querySelector('img');
                  if (img) img.style.transform = 'scale(1.04)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  const img = e.currentTarget.querySelector('img');
                  if (img) img.style.transform = 'scale(1)';
                }}
              >
                <div>
                  {/* Distinct Recipe Image */}
                  <SignatureCardImage name={pizza.name} category={pizza.category} badge={pizza.badge} />

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-dark)', margin: '0 0 0.4rem' }}>
                    {pizza.name}
                  </h3>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.4', margin: '0 0 1rem', minHeight: '48px' }}>
                    {pizza.description}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#E11D48' }}>
                    ₹{pizza.price}
                  </span>
                  <button
                    onClick={() => handleAddPreset(pizza)}
                    style={{
                      padding: '0.55rem 1rem',
                      background: '#E11D48',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    + Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: CUSTOM PIZZA BUILDER STUDIO */}
      {activeTab === 'builder' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.75fr', gap: '2rem', alignItems: 'start' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* 1. Base */}
            <div style={{ background: '#FFFFFF', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '1rem' }}>
                1. Select Crust
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                {inventory.base.map(item => {
                  const active = selectedBase?._id === item._id;
                  return (
                    <button
                      type="button"
                      key={item._id}
                      onClick={() => setSelectedBase(item)}
                      style={{
                        padding: '0.9rem',
                        background: active ? '#FFF1F2' : '#F8FAFC',
                        border: active ? '2px solid #E11D48' : '1px solid var(--border)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: active ? '#BE123C' : 'var(--text-dark)' }}>{item.name}</div>
                      <div style={{ color: '#64748B', fontSize: '0.85rem', marginTop: '0.2rem' }}>₹{item.price}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Sauce */}
            <div style={{ background: '#FFFFFF', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '1rem' }}>
                2. Select Sauce
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                {inventory.sauce.map(item => {
                  const active = selectedSauce?._id === item._id;
                  return (
                    <button
                      type="button"
                      key={item._id}
                      onClick={() => setSelectedSauce(item)}
                      style={{
                        padding: '0.9rem',
                        background: active ? '#FFF1F2' : '#F8FAFC',
                        border: active ? '2px solid #E11D48' : '1px solid var(--border)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: active ? '#BE123C' : 'var(--text-dark)' }}>{item.name}</div>
                      <div style={{ color: '#64748B', fontSize: '0.85rem', marginTop: '0.2rem' }}>₹{item.price}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Cheese */}
            <div style={{ background: '#FFFFFF', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '1rem' }}>
                3. Choose Cheese
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                {inventory.cheese.map(item => {
                  const active = selectedCheese?._id === item._id;
                  return (
                    <button
                      type="button"
                      key={item._id}
                      onClick={() => setSelectedCheese(item)}
                      style={{
                        padding: '0.9rem',
                        background: active ? '#FFFBEB' : '#F8FAFC',
                        border: active ? '2px solid #D97706' : '1px solid var(--border)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: active ? '#92400E' : 'var(--text-dark)' }}>{item.name}</div>
                      <div style={{ color: '#64748B', fontSize: '0.85rem', marginTop: '0.2rem' }}>₹{item.price}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Veggies */}
            <div style={{ background: '#FFFFFF', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '1rem' }}>
                4. Veggie Toppings
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                {inventory.veggie.map(item => {
                  const isSelected = !!selectedVeggies.find(v => v._id === item._id);
                  return (
                    <button
                      type="button"
                      key={item._id}
                      onClick={() => handleVeggieToggle(item)}
                      style={{
                        padding: '0.85rem',
                        background: isSelected ? '#F0FDF4' : '#F8FAFC',
                        border: isSelected ? '2px solid #16A34A' : '1px solid var(--border)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: isSelected ? '#15803D' : 'var(--text-dark)' }}>{item.name}</div>
                      <div style={{ color: isSelected ? '#16A34A' : '#64748B', fontSize: '0.85rem', marginTop: '0.2rem', fontWeight: 500 }}>+ ₹{item.price}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Builder Visualizer */}
          <div style={{ position: 'sticky', top: '5.5rem' }}>
            <div style={{ background: '#FFFFFF', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', boxShadow: 'var(--shadow-md)' }}>
              <PizzaFlatVisualizer
                base={selectedBase}
                sauce={selectedSauce}
                cheese={selectedCheese}
                veggies={selectedVeggies}
              />

              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                Custom Recipe
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-body)' }}>
                  <span>Base: {selectedBase?.name}</span>
                  <b>₹{selectedBase?.price || 0}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-body)' }}>
                  <span>Sauce: {selectedSauce?.name}</span>
                  <b>₹{selectedSauce?.price || 0}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-body)' }}>
                  <span>Cheese: {selectedCheese?.name}</span>
                  <b>₹{selectedCheese?.price || 0}</b>
                </div>
                {selectedVeggies.map(v => (
                  <div key={v._id} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>+ {v.name}</span>
                    <b>₹{v.price}</b>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', background: '#FFF1F2', borderRadius: '8px', marginBottom: '1.25rem' }}>
                <span style={{ fontWeight: 700, color: '#9F1239' }}>Pizza Cost:</span>
                <span style={{ fontWeight: 800, fontSize: '1.35rem', color: '#E11D48' }}>₹{calculateCustomUnitPrice()}</span>
              </div>

              <button
                type="button"
                onClick={handleAddCustom}
                style={{
                  width: '100%',
                  padding: '0.95rem',
                  backgroundColor: '#E11D48',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer'
                }}
              >
                + Add Custom Pizza to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SLIDE-OUT CART DRAWER */}
      {isCartOpen && (
        <div
          onClick={() => setIsCartOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            justifyContent: 'flex-end',
            zIndex: 999
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '460px',
              height: '100vh',
              background: '#FFFFFF',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflowY: 'auto',
              padding: '1.5rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)' }}>
                  Your Shopping Cart ({cart.reduce((s, i) => s + i.quantity, 0)})
                </h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  style={{ background: 'transparent', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#64748B' }}
                >
                  ✕
                </button>
              </div>

              {cart.length === 0 ? (
                <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#64748B' }}>
                  Your cart is empty. Pick a signature pizza or build a custom one!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                  {cart.map(item => (
                    <div
                      key={item.id}
                      style={{
                        padding: '0.85rem',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        background: '#F8FAFC',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-dark)' }}>{item.name}</div>
                        {item.details && <small style={{ color: '#64748B', display: 'block' }}>{item.details}</small>}
                        <div style={{ color: '#E11D48', fontWeight: 800, marginTop: '0.2rem' }}>₹{item.price} each</div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          style={{ width: '28px', height: '28px', background: '#E2E8F0', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 }}
                        >
                          -
                        </button>
                        <span style={{ fontWeight: 700, minWidth: '18px', textAlign: 'center' }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          style={{ width: '28px', height: '28px', background: '#E2E8F0', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 }}
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeCartItem(item.id)}
                          style={{ marginLeft: '0.3rem', background: 'transparent', border: 'none', color: '#DC2626', cursor: 'pointer', fontSize: '1rem' }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {cart.length > 0 && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', background: '#FFF1F2', borderRadius: '8px', marginBottom: '1.5rem' }}>
                    <span style={{ fontWeight: 700, color: '#9F1239' }}>Grand Total:</span>
                    <span style={{ fontWeight: 800, fontSize: '1.4rem', color: '#E11D48' }}>₹{totalPrice}</span>
                  </div>

                  {/* Delivery Address Form */}
                  <form onSubmit={handleCheckout}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)', margin: 0 }}>
                        Delivery Address
                      </h4>
                      {address.street && (
                        <span style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 600 }}>
                          ✓ Saved Address Loaded
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
                      <input
                        type="text"
                        placeholder="Street / Flat / House No."
                        required
                        value={address.street}
                        onChange={e => handleAddressChange('street', e.target.value)}
                        style={{ padding: '0.65rem 0.75rem', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.88rem' }}
                      />
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        <input
                          type="text"
                          placeholder="City"
                          required
                          value={address.city}
                          onChange={e => handleAddressChange('city', e.target.value)}
                          style={{ padding: '0.65rem 0.75rem', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.88rem' }}
                        />
                        <input
                          type="text"
                          placeholder="Pincode"
                          required
                          value={address.zipCode}
                          onChange={e => handleAddressChange('zipCode', e.target.value)}
                          style={{ padding: '0.65rem 0.75rem', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.88rem' }}
                        />
                      </div>
                      <input
                        type="tel"
                        placeholder="Contact Phone Number"
                        required
                        value={address.phone}
                        onChange={e => handleAddressChange('phone', e.target.value)}
                        style={{ padding: '0.65rem 0.75rem', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.88rem' }}
                      />
                    </div>

                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
                      Payment Gateway
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem' }}>
                      {[
                        { id: 'upi', label: '📱 UPI' },
                        { id: 'qr', label: '🏁 QR Scan' },
                        { id: 'card', label: '💳 Card' },
                        { id: 'cod', label: '💵 Cash (COD)' },
                      ].map((opt) => (
                        <label
                          key={opt.id}
                          style={{
                            padding: '0.6rem 0.5rem',
                            borderRadius: '6px',
                            border: paymentOption === opt.id ? '2px solid #E11D48' : '1px solid var(--border)',
                            background: paymentOption === opt.id ? '#FFF1F2' : '#FFFFFF',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: paymentOption === opt.id ? '#9F1239' : 'var(--text-dark)'
                          }}
                        >
                          <input
                            type="radio"
                            name="paymentOption"
                            value={opt.id}
                            checked={paymentOption === opt.id}
                            onChange={() => setPaymentOption(opt.id)}
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      style={{
                        width: '100%',
                        padding: '0.95rem',
                        backgroundColor: '#E11D48',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '1rem',
                        cursor: submitting ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {submitting ? 'Placing Order...' : `Pay ₹${totalPrice} & Checkout`}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payment Confirmation Modal */}
      {activeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--text-dark)' }}>
              Complete Payment
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Payable: <b style={{ color: '#E11D48' }}>₹{totalPrice}</b> via {paymentOption.toUpperCase()}
            </p>

            {activeModal === 'qr' ? (
              <div style={{ marginBottom: '1.5rem' }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=pizzaexpress@bank%26pn=PizzaExpress%26am=${totalPrice}%26cu=INR`}
                  alt="QR Code"
                  style={{ width: '160px', height: '160px', margin: '0 auto', display: 'block', border: '1px solid var(--border)', borderRadius: '8px' }}
                />
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  Scan with GPay, PhonePe, or Paytm
                </span>
              </div>
            ) : (
              <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-body)', fontWeight: 500 }}>
                  Ready to authenticate transaction through secure sandbox gateway.
                </span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '1px solid var(--border)',
                  background: '#F8FAFC',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={completePayment}
                style={{
                  flex: 1.5,
                  padding: '0.75rem',
                  border: 'none',
                  background: '#16A34A',
                  color: '#FFFFFF',
                  borderRadius: '8px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PizzaBuilder;