import React, { useState } from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import styles from './ProfilePage.module.css';
import { useDemoState } from '../../context/DemoStateContext';
import { useToast, Modal } from '../../components/ui';

interface ProfilePageProps {
  onNavigate?: (pageId: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { user, setUser, addRecentAction } = useDemoState();
  const { info } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [editingName, setEditingName] = useState('');

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
              <p className={styles.scheduleText}>Schedule</p>
            </div>

            <div className={styles.divider} />

            <div className={styles.menuItem} onClick={() => openMenuItem('trip')}>
              <span>🚗</span>
              <p className={styles.menuText}>Your trip</p>
            </div>

            <div className={styles.menuItem} onClick={() => openMenuItem('payment')}>
              <span>💳</span>
              <p className={styles.menuText}>Payment</p>
            </div>

            <div className={styles.menuItem} onClick={() => openMenuItem('help')}>
              <span>❓</span>
              <p className={styles.menuText}>Help</p>
            </div>

            <div className={styles.menuItem} onClick={() => openMenuItem('gody-pass')}>
              <span>🎫</span>
              <p className={styles.menuText}>Gody pass</p>
            </div>

            <div className={styles.menuItem} onClick={() => openMenuItem('gift')}>
              <span>🎁</span>
              <p className={styles.menuText}>Send a gift</p>
            </div>

            <div className={styles.menuItem} onClick={() => openMenuItem('free-trips')}>
              <span>🆓</span>
              <p className={styles.menuText}>Free trips</p>
            </div>

            <div className={styles.menuItem} onClick={() => openMenuItem('settings')}>
              <span>⚙️</span>
              <p className={styles.menuText}>Settings</p>
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
              <p className={styles.sideMenuText}>Your trip</p>
            </div>
            <div className={styles.sideMenuItem} onClick={() => openMenuItem('payment')}>
              <span className={styles.sideMenuIcon}>💳</span>
              <p className={styles.sideMenuText}>Payment</p>
            </div>
            <div className={styles.sideMenuItem} onClick={() => openMenuItem('help')}>
              <span className={styles.sideMenuIcon}>❓</span>
              <p className={styles.sideMenuText}>Help</p>
            </div>
            <div className={styles.sideMenuItem} onClick={() => openMenuItem('gody-pass')}>
              <span className={styles.sideMenuIcon}>🎫</span>
              <p className={styles.sideMenuText}>Gody pass</p>
            </div>
            <div className={styles.sideMenuItem} onClick={() => openMenuItem('gift')}>
              <span className={styles.sideMenuIcon}>🎁</span>
              <p className={styles.sideMenuText}>Send a gift</p>
            </div>
            <div className={styles.sideMenuItem} onClick={() => openMenuItem('free-trips')}>
              <span className={styles.sideMenuIcon}>🆓</span>
              <p className={styles.sideMenuText}>Free trips</p>
            </div>
            <div className={styles.sideMenuItem} onClick={() => openMenuItem('settings')}>
              <span className={styles.sideMenuIcon}>⚙️</span>
              <p className={styles.sideMenuText}>Settings</p>
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
        confirmText="Save"
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

      <HomeIndicator />
    </div>
  );
};

export default ProfilePage;
