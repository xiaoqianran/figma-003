import React from 'react';
import { StatusBar, HomeIndicator, TopNav } from '../../components/mobile';
import { useDemoState } from '../../context/DemoStateContext';

interface AccountIndexPageProps {
  onNavigate?: (pageId: string) => void;
}

const AccountIndexPage: React.FC<AccountIndexPageProps> = ({ onNavigate }) => {
  const { user, activeTrip, addRecentAction } = useDemoState();
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
        {activeTrip && <div style={{ fontSize: 12, color: '#fecc2a', marginBottom: 16 }}>Active trip: {activeTrip.to}</div>}
        <p style={{ color: '#959595', fontSize: 13, marginBottom: 24 }}>Manage your profile and settings</p>

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
