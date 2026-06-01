import React from 'react';
import { StatusBar, HomeIndicator, TopNav } from '../../components/mobile';
import { useDemoState } from '../../context/DemoStateContext';
import { useToast } from '../../components/ui';

interface AccountIndexPageProps {
  onNavigate?: (pageId: string) => void;
}

const AccountIndexPage: React.FC<AccountIndexPageProps> = ({ onNavigate }) => {
  const {
    user, activeTrip, bookedTrips, addRecentAction,
    balance, hasGodyPass, promoCredits, giftsSent, eatsOrders,
    buyGodyPass, claimPromoCredit, sendGift, placeEatsOrder
  } = useDemoState();
  const { success, info } = useToast();

  const navItems = [
    { label: 'Profile', id: 'account-profile', icon: '👤' },
    { label: 'Edit Account #1', id: 'account-edit1', icon: '✏️' },
    { label: 'Edit Account #2 (Keyboard)', id: 'account-edit2', icon: '⌨️' },
    { label: 'Test Pages', id: 'account-test', icon: '🧪' },
    { label: 'Home', id: 'core-home', icon: '🏠' },
  ];

  return (
    <div className="mobile-frame">
      <StatusBar />

      <TopNav title="Account" onBack={() => { addRecentAction('Back to home from account index'); onNavigate?.('core-home'); }} />

      <div style={{ padding: '24px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: '#49493d', marginBottom: 8 }}>GODY Account</h2>
        <div style={{ fontSize: 13, color: '#49493d', marginBottom: 4 }}>Logged in: <strong>{user.name}</strong></div>
        {activeTrip && <div style={{ fontSize: 12, color: '#fecc2a', marginBottom: 4 }}>Active trip: {activeTrip.to}</div>}
        {bookedTrips.length > 0 && <div style={{ fontSize: 11, color: '#959595', marginBottom: 16 }}>Booked trips: {bookedTrips.length} (see Test page or Trips hub for full lifecycle)</div>}
        <p style={{ color: '#959595', fontSize: 13, marginBottom: 24 }}>Manage your profile and settings</p>

        {/* Demo feature status + quick actions (now functional via DemoState) */}
        <div style={{ background: '#fffdf5', border: '1px solid #f3e8c8', borderRadius: 12, padding: '14px 16px', marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#49493d', marginBottom: 8 }}>Demo Perks &amp; Features</div>
          <div style={{ fontSize: 12, color: '#49493d', marginBottom: 10, lineHeight: 1.4 }}>
            Balance: <strong>¥{balance.toFixed(2)}</strong> • Gody Pass: {hasGodyPass ? '🎫 Active' : 'Inactive'} • Promo: 🆓{promoCredits} • Gifts: 🎁{giftsSent} • Eats: 🍽️{eatsOrders}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <button onClick={() => { buyGodyPass(99); success('Gody Pass', 'Quick buy from account index'); }} style={{ fontSize: 11, padding: '5px 10px', background: '#0A0908', color: '#fecc2a', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Buy Pass ¥99</button>
            <button onClick={() => { claimPromoCredit(1); success('Free trips', '+1 credit claimed'); }} style={{ fontSize: 11, padding: '5px 10px', background: '#0A0908', color: '#fecc2a', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Claim Promo</button>
            <button onClick={() => { sendGift('Quick Demo', 30); success('Gift', 'Sent ¥30 demo gift'); }} style={{ fontSize: 11, padding: '5px 10px', background: '#0A0908', color: '#fecc2a', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Send ¥30 Gift</button>
            <button onClick={() => { placeEatsOrder('Demo Wok', 'Lunch Special', 25); info('Eats', 'Quick order placed'); }} style={{ fontSize: 11, padding: '5px 10px', background: '#0A0908', color: '#fecc2a', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Quick Eats Order</button>
          </div>
          <div style={{ fontSize: 10, color: '#959595', marginTop: 6 }}>Actions update shared DemoState (visible on Profile too)</div>
        </div>

        {navItems.map((item, idx) => (
          <div
            key={idx}
            onClick={() => {
              addRecentAction(`Navigated to ${item.label} from account index`);
              onNavigate?.(item.id);
            }}
            style={{
              background: '#f8f9fa',
              borderRadius: 12,
              padding: '16px 20px',
              marginBottom: 12,
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              border: '2px solid transparent'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#fecc2a'; e.currentTarget.style.background = '#fffdf5'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = '#f8f9fa'; }}
          >
            <span style={{ fontSize: 22, marginRight: 14 }}>{item.icon}</span>
            <span style={{ fontSize: 16, fontWeight: 500, color: '#49493d' }}>{item.label}</span>
            <span style={{ marginLeft: 'auto', color: '#959595' }}>→</span>
          </div>
        ))}
      </div>

      <HomeIndicator />
    </div>
  );
};

export default AccountIndexPage;
