import React, { useState } from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import styles from './ProfilePage.module.css';
import { useDemoState } from '../../context/DemoStateContext';
import { useToast, Modal } from '../../components/ui';

interface ProfilePageProps {
  onNavigate?: (pageId: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const {
    user, setUser, addRecentAction,
    balance, hasGodyPass, godyPassExpiry, promoCredits, giftsSent, eatsOrders,
    buyGodyPass, claimPromoCredit, sendGift, placeEatsOrder, bookTrip
  } = useDemoState();
  const { info, success, error } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [editingName, setEditingName] = useState('');

  // Feature modals state
  const [showGodyModal, setShowGodyModal] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showFreeModal, setShowFreeModal] = useState(false);
  const [showEatsModal, setShowEatsModal] = useState(false);

  // Gift flow local UI state
  const [selectedContact, setSelectedContact] = useState('');
  const [giftAmount, setGiftAmount] = useState(50);

  // Eats selection
  const [eatsChoice, setEatsChoice] = useState<{ restaurant: string; item: string; cost: number } | null>(null);

  const showSideMenu = () => setMenuOpen(true);
  const hideSideMenu = () => setMenuOpen(false);

  const openMenuItem = (itemType: string) => {
    hideSideMenu();
    if (itemType === 'settings') {
      onNavigate?.('account-edit1');
    } else if (itemType === 'trip') {
      onNavigate?.('trips-hub');
    } else if (itemType === 'payment') {
      onNavigate?.('payment-select');
    } else if (itemType === 'help') {
      onNavigate?.('map-help');
    } else if (itemType === 'gody-pass') {
      setShowGodyModal(true);
    } else if (itemType === 'gift') {
      setSelectedContact('');
      setGiftAmount(50);
      setShowGiftModal(true);
    } else if (itemType === 'free-trips') {
      setShowFreeModal(true);
    } else if (itemType === 'eats') {
      setEatsChoice(null);
      setShowEatsModal(true);
    } else {
      info('菜单', `打开 ${itemType} 功能 (demo)`);
    }
  };

  const centerLocation = () => {
    info('定位', '已定位到当前位置 (demo)');
  };

  const openSchedule = () => {
    onNavigate?.('booking-schedule');
  };

  return (
    <div className="mobile-frame">
      <StatusBar />

      <div className={styles.profileContainer}>
        <div className={styles.topSection}>
          <div className={styles.mapBackground}>
            <div className={styles.headerSection}>
              <div style={{ height: 40 }} />
              <div className={styles.menuIcon} onClick={showSideMenu}>☰</div>
            </div>

            <div className={styles.locationBtn} onClick={centerLocation}>
              🎯
            </div>
          </div>

          <div className={styles.carIcon}>🚗</div>

          <div className={styles.bottomPanel}>
            <div className={styles.scheduleBtn} onClick={openSchedule}>
              <p className={styles.scheduleText}>预约</p>
            </div>

            <div className={styles.divider} />

            {/* Demo perks status (visible in profile, driven by DemoState) */}
            <div style={{
              width: '327px',
              margin: '0 24px 8px',
              padding: '6px 12px',
              background: '#f8f7f2',
              borderRadius: 8,
              fontSize: '11px',
              color: '#49493d',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexWrap: 'wrap',
              opacity: 0.95
            }}>
              <span>💰 ¥{balance.toFixed(2)}</span>
              {hasGodyPass && <span title={godyPassExpiry || ''}>🎫 Pass active</span>}
              {promoCredits > 0 && <span>🆓 {promoCredits} credits</span>}
              {giftsSent > 0 && <span>🎁 {giftsSent} sent</span>}
              {eatsOrders > 0 && <span>🍽️ {eatsOrders} eats</span>}
            </div>

            <div className={styles.menuItem} onClick={() => openMenuItem('trip')}>
              <span>🚗</span>
              <p className={styles.menuText}>您的行程</p>
            </div>

            <div className={styles.menuItem} onClick={() => openMenuItem('payment')}>
              <span>💳</span>
              <p className={styles.menuText}>支付</p>
            </div>

            <div className={styles.menuItem} onClick={() => openMenuItem('help')}>
              <span>❓</span>
              <p className={styles.menuText}>帮助</p>
            </div>

            <div className={styles.menuItem} onClick={() => openMenuItem('gody-pass')}>
              <span>🎫</span>
              <p className={styles.menuText}>Gody 通行证</p>
            </div>

            <div className={styles.menuItem} onClick={() => openMenuItem('gift')}>
              <span>🎁</span>
              <p className={styles.menuText}>发送礼品</p>
            </div>

            <div className={styles.menuItem} onClick={() => openMenuItem('free-trips')}>
              <span>🆓</span>
              <p className={styles.menuText}>免费行程</p>
            </div>

            <div className={styles.menuItem} onClick={() => openMenuItem('eats')}>
              <span>🍽️</span>
              <p className={styles.menuText}>Eats</p>
            </div>

            <div className={styles.menuItem} onClick={() => openMenuItem('settings')}>
              <span>⚙️</span>
              <p className={styles.menuText}>设置</p>
            </div>
          </div>
        </div>

        {/* Side Menu Overlay */}
        <div className={`${styles.sideMenuOverlay} ${menuOpen ? styles.show : ''}`} onClick={hideSideMenu}>
          <div className={`${styles.sideMenu} ${menuOpen ? styles.show : ''}`} onClick={e => e.stopPropagation()}>
            <div className={styles.userHeader} onClick={() => {
              setEditingName(user.name);
              setShowNameModal(true);
            }}>
              <div className={styles.userAvatar}>
                <div className={styles.avatarImage}>{user.avatar}</div>
              </div>
              <p className={styles.userName}>{user.name} <span style={{ fontSize: 10, opacity: 0.6 }}>(tap to edit)</span></p>
            </div>

            <div className={styles.sideMenuItem} onClick={() => openMenuItem('trip')}>
              <span className={styles.sideMenuIcon}>🚗</span>
              <p className={styles.sideMenuText}>您的行程</p>
            </div>
            <div className={styles.sideMenuItem} onClick={() => openMenuItem('payment')}>
              <span className={styles.sideMenuIcon}>💳</span>
              <p className={styles.sideMenuText}>支付</p>
            </div>
            <div className={styles.sideMenuItem} onClick={() => openMenuItem('help')}>
              <span className={styles.sideMenuIcon}>❓</span>
              <p className={styles.sideMenuText}>帮助</p>
            </div>
            <div className={styles.sideMenuItem} onClick={() => openMenuItem('gody-pass')}>
              <span className={styles.sideMenuIcon}>🎫</span>
              <p className={styles.sideMenuText}>Gody 通行证</p>
            </div>
            <div className={styles.sideMenuItem} onClick={() => openMenuItem('gift')}>
              <span className={styles.sideMenuIcon}>🎁</span>
              <p className={styles.sideMenuText}>发送礼品</p>
            </div>
            <div className={styles.sideMenuItem} onClick={() => openMenuItem('free-trips')}>
              <span className={styles.sideMenuIcon}>🆓</span>
              <p className={styles.sideMenuText}>免费行程</p>
            </div>
            <div className={styles.sideMenuItem} onClick={() => openMenuItem('eats')}>
              <span className={styles.sideMenuIcon}>🍽️</span>
              <p className={styles.sideMenuText}>Eats</p>
            </div>
            <div className={styles.sideMenuItem} onClick={() => openMenuItem('settings')}>
              <span className={styles.sideMenuIcon}>⚙️</span>
              <p className={styles.sideMenuText}>设置</p>
            </div>

            <div style={{ marginTop: 'auto', padding: '24px 0' }}>
              <HomeIndicator />
            </div>
          </div>
        </div>
      </div>

      {/* Name edit modal (replaces native prompt) */}
      <Modal
        open={showNameModal}
        onClose={() => setShowNameModal(false)}
        title="Edit demo user name"
        confirmText="保存"
        onConfirm={() => {
          const trimmed = editingName.trim();
          if (trimmed) {
            setUser({ name: trimmed });
            addRecentAction(`Updated profile name to ${trimmed}`);
          }
          setShowNameModal(false);
        }}
      >
        <input
          type="text"
          value={editingName}
          onChange={(e) => setEditingName(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: 8,
            border: '1px solid #3A3935',
            background: '#11110F',
            color: '#EDEBE5',
            fontSize: 14,
            outline: 'none'
          }}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const trimmed = editingName.trim();
              if (trimmed) {
                setUser({ name: trimmed });
                addRecentAction(`Updated profile name to ${trimmed}`);
              }
              setShowNameModal(false);
            }
          }}
        />
      </Modal>

      {/* Gody Pass mini modal - functional buy flow using DemoState */}
      <Modal
        open={showGodyModal}
        onClose={() => setShowGodyModal(false)}
        title="Gody 通行证"
        width={340}
      >
        <div style={{ fontSize: 13, lineHeight: 1.5, color: '#C9C6BE' }}>
          {hasGodyPass ? (
            <div>
              <div style={{ color: '#fecc2a', fontWeight: 600, marginBottom: 6 }}>✓ Active until {godyPassExpiry || 'soon'}</div>
              <div>Benefits unlocked: 15% off rides • Priority pickup • Free cancellations</div>
            </div>
          ) : (
            <div>
              Unlock premium perks for all your trips.<br />
              • 15% off every ride<br />
              • Priority driver matching<br />
              • Free cancellations &amp; changes
            </div>
          )}
          <div style={{ marginTop: 14, padding: '8px 10px', background: '#11110F', borderRadius: 8, fontSize: 12 }}>
            Your balance: <strong>¥{balance.toFixed(2)}</strong>
          </div>
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
          {!hasGodyPass && (
            <button
              onClick={() => {
                const cost = 99;
                if (balance >= cost) {
                  buyGodyPass(cost);
                  success('Gody 通行证', '已激活！解锁 15% 优惠。');
                  setShowGodyModal(false);
                } else {
                  error('余额不足', `Need ¥${cost}, have ¥${balance.toFixed(2)}`);
                }
              }}
              style={{ flex: 1, padding: '10px 14px', background: '#fecc2a', color: '#0A0908', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}
            >
              Buy Monthly — ¥99
            </button>
          )}
          {hasGodyPass && (
            <button
              onClick={() => {
                const cost = 89;
                if (balance >= cost) {
                  buyGodyPass(cost);
                  success('Gody 通行证', 'Renewed! Thanks.');
                  setShowGodyModal(false);
                } else {
                  error('余额不足', `Need ¥${cost}`);
                }
              }}
              style={{ flex: 1, padding: '10px 14px', background: '#fecc2a', color: '#0A0908', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}
            >
              Renew (¥89)
            </button>
          )}
          <button
            onClick={() => setShowGodyModal(false)}
            style={{ padding: '10px 18px', background: 'transparent', color: '#B8B5B0', border: '1px solid #3A3935', borderRadius: 10, fontSize: 13, cursor: 'pointer' }}
          >
            Close
          </button>
        </div>
        <div style={{ fontSize: 10, opacity: 0.6, marginTop: 8, textAlign: 'center' }}>Demo: deducts from balance • persists via DemoState</div>
      </Modal>

      {/* Send a Gift mini modal - send to demo contacts, deducts balance */}
      <Modal
        open={showGiftModal}
        onClose={() => setShowGiftModal(false)}
        title="Send a Gift"
        width={340}
      >
        <div style={{ fontSize: 13, color: '#C9C6BE', marginBottom: 10 }}>
          Send ride credits to friends &amp; family. Deducts from your demo balance.
        </div>

        <div style={{ fontSize: 12, marginBottom: 6, color: '#EDEBE5' }}>最近联系人</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
          {['👩 Mom', '👨 Family', '🚗 Li (driver)', 'Sarah 👩‍💼', 'Alex friend'].map(c => (
            <button
              key={c}
              onClick={() => setSelectedContact(c)}
              style={{
                padding: '6px 10px',
                fontSize: 12,
                borderRadius: 999,
                border: selectedContact === c ? '2px solid #fecc2a' : '1px solid #3A3935',
                background: selectedContact === c ? '#2a2926' : '#11110F',
                color: '#EDEBE5',
                cursor: 'pointer'
              }}
            >
              {c}
            </button>
          ))}
        </div>

        <div style={{ fontSize: 12, marginBottom: 6, color: '#EDEBE5' }}>礼品金额</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {[20, 50, 100].map(amt => (
            <button
              key={amt}
              onClick={() => setGiftAmount(amt)}
              style={{
                flex: 1,
                padding: '8px 0',
                fontSize: 13,
                borderRadius: 8,
                border: giftAmount === amt ? '2px solid #fecc2a' : '1px solid #3A3935',
                background: giftAmount === amt ? '#2a2926' : '#11110F',
                color: '#EDEBE5',
                cursor: 'pointer'
              }}
            >
              ¥{amt}
            </button>
          ))}
        </div>

        <div style={{ fontSize: 12, marginBottom: 10, color: '#C9C6BE' }}>
          Balance: ¥{balance.toFixed(2)} • Gift to: <strong>{selectedContact || '(select contact)'}</strong>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            disabled={!selectedContact}
            onClick={() => {
              if (!selectedContact) return;
              if (balance < giftAmount) {
                error('Balance low', `Can't send ¥${giftAmount}`);
                return;
              }
              sendGift(selectedContact, giftAmount);
              success('礼品已发送', `¥${giftAmount} ride credit sent to ${selectedContact}`);
              setShowGiftModal(false);
            }}
            style={{
              flex: 1,
              padding: '10px 14px',
              background: selectedContact ? '#fecc2a' : '#3A3935',
              color: selectedContact ? '#0A0908' : '#888',
              border: 'none',
              borderRadius: 10,
              fontWeight: 600,
              cursor: selectedContact ? 'pointer' : 'not-allowed',
              fontSize: 13
            }}
          >
            Send Gift
          </button>
          <button onClick={() => setShowGiftModal(false)} style={{ padding: '10px 16px', background: 'transparent', color: '#B8B5B0', border: '1px solid #3A3935', borderRadius: 10, fontSize: 13, cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      </Modal>

      {/* Free trips / Promo credits modal */}
      <Modal
        open={showFreeModal}
        onClose={() => setShowFreeModal(false)}
        title="Free Trips & Promo"
        width={340}
      >
        <div style={{ fontSize: 13, color: '#C9C6BE', marginBottom: 12 }}>
          Claim promo credits for future GODY rides. Credits are visible on your profile.
        </div>
        <div style={{ padding: '12px 14px', background: '#11110F', borderRadius: 10, marginBottom: 14 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#fecc2a' }}>{promoCredits}</div>
          <div style={{ fontSize: 12, color: '#EDEBE5' }}>promo credits available</div>
          <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>≈ ¥{promoCredits * 12} ride value (demo)</div>
        </div>

        <button
          onClick={() => {
            claimPromoCredit(1);
            success('Promo claimed', '+1 free trip credit added to profile');
            // keep modal open for multiple claims in demo
          }}
          style={{ width: '100%', padding: '11px 0', background: '#fecc2a', color: '#0A0908', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: 'pointer', marginBottom: 8 }}
        >
          Claim 1 Free Trip Credit
        </button>

        <button
          onClick={() => {
            claimPromoCredit(3);
            success('Promo bundle', '+3 credits added!');
          }}
          style={{ width: '100%', padding: '9px 0', background: 'transparent', color: '#fecc2a', border: '1px solid #fecc2a', borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
        >
          Claim 3-Credit Bundle (demo)
        </button>

        <div style={{ fontSize: 10, opacity: 0.55, marginTop: 10, textAlign: 'center' }}>
          Use on your next booking (demo only — visible in perks bar)
        </div>
      </Modal>

      {/* Eats simple ordering simulation modal — creates parallel trip + updates stats */}
      <Modal
        open={showEatsModal}
        onClose={() => setShowEatsModal(false)}
        title="Gody Eats"
        width={340}
      >
        <div style={{ fontSize: 13, color: '#C9C6BE', marginBottom: 10 }}>
          Quick demo food ordering. Orders update your eats count and can spawn a delivery trip.
        </div>

        <div style={{ fontSize: 12, marginBottom: 6, color: '#EDEBE5' }}>附近热门</div>
        {[
          { restaurant: 'Lucky Noodles', item: 'Beef Noodle Bowl', cost: 28 },
          { restaurant: 'Pizza King', item: 'Margherita Pizza', cost: 42 },
          { restaurant: 'Green Bowl', item: 'Avocado Chicken Salad', cost: 35 },
          { restaurant: 'Street Wok', item: 'Kung Pao Chicken', cost: 31 },
        ].map((opt, i) => (
          <div
            key={i}
            onClick={() => setEatsChoice(opt)}
            style={{
              padding: '10px 12px',
              marginBottom: 6,
              borderRadius: 8,
              background: eatsChoice && eatsChoice.item === opt.item ? '#2a2926' : '#11110F',
              border: eatsChoice && eatsChoice.item === opt.item ? '1px solid #fecc2a' : '1px solid #2A2926',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: 13
            }}
          >
            <div>
              <div style={{ color: '#EDEBE5', fontWeight: 500 }}>{opt.restaurant}</div>
              <div style={{ fontSize: 12, color: '#B8B5B0' }}>{opt.item}</div>
            </div>
            <div style={{ color: '#fecc2a', fontWeight: 600 }}>¥{opt.cost}</div>
          </div>
        ))}

        <div style={{ margin: '10px 0 8px', fontSize: 12, color: '#C9C6BE' }}>
          Balance: ¥{balance.toFixed(2)} {eatsChoice ? `• ${eatsChoice.item} ¥${eatsChoice.cost}` : ''}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            disabled={!eatsChoice}
            onClick={() => {
              if (!eatsChoice) return;
              if (balance < eatsChoice.cost) {
                error('Low balance', 'Top up in demo?');
                return;
              }
              // Place order + stats
              placeEatsOrder(eatsChoice.restaurant, eatsChoice.item, eatsChoice.cost);
              // Parallel delivery trip (lightweight)
              bookTrip({
                from: eatsChoice.restaurant,
                to: 'Home (demo)',
                driver: 'Delivery Rider',
                vehicle: 'Scooter 🛵',
                price: eatsChoice.cost,
                status: 'upcoming',
                eta: '18-25 min'
              });
              success('Order placed!', `${eatsChoice.item} • Delivery en route. Check trips hub.`);
              setShowEatsModal(false);
            }}
            style={{
              flex: 1,
              padding: '10px',
              background: eatsChoice ? '#fecc2a' : '#333',
              color: eatsChoice ? '#0A0908' : '#777',
              border: 'none',
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 13,
              cursor: eatsChoice ? 'pointer' : 'not-allowed'
            }}
          >
            Order &amp; Track
          </button>
          <button onClick={() => setShowEatsModal(false)} style={{ padding: '10px 14px', background: 'transparent', color: '#B8B5B0', border: '1px solid #3A3935', borderRadius: 10, fontSize: 13, cursor: 'pointer' }}>
            Close
          </button>
        </div>
        <div style={{ fontSize: 10, textAlign: 'center', opacity: 0.5, marginTop: 6 }}>Demo flow: +eats stat + delivery trip in bookedTrips</div>
      </Modal>

      <HomeIndicator />
    </div>
  );
};

export default ProfilePage;
