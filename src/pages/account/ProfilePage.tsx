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
      info('菜单', `打开 ${itemType} 功能（演示）`);
    }
  };

  const centerLocation = () => {
    info('定位', '已定位到当前位置 （演示）');
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
              {hasGodyPass && <span title={godyPassExpiry || ''}>🎫 通行证有效</span>}
              {promoCredits > 0 && <span>🆓 {promoCredits} 积分</span>}
              {giftsSent > 0 && <span>🎁 已送出 {giftsSent}</span>}
              {eatsOrders > 0 && <span>🍽️ 外卖 {eatsOrders}</span>}
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
              <p className={styles.menuText}>外卖</p>
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
              <p className={styles.userName}>{user.name} <span style={{ fontSize: 10, opacity: 0.6 }}>（点击编辑）</span></p>
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
              <p className={styles.sideMenuText}>外卖</p>
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
        title="编辑演示用户名"
        confirmText="保存"
        onConfirm={() => {
          const trimmed = editingName.trim();
          if (trimmed) {
            setUser({ name: trimmed });
            addRecentAction(`资料姓名已更新为 ${trimmed}`);
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
                addRecentAction(`资料姓名已更新为 ${trimmed}`);
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
              <div style={{ color: '#fecc2a', fontWeight: 600, marginBottom: 6 }}>✓ 有效期至 {godyPassExpiry || '即将到期'}</div>
              <div>已解锁权益：行程 15% 折扣 · 优先上车 · 免费取消</div>
            </div>
          ) : (
            <div>
              解锁全部行程的高级权益。<br />
              • 每次出行 15% 优惠<br />
              • 优先匹配司机<br />
              • 免费取消与改期
            </div>
          )}
          <div style={{ marginTop: 14, padding: '8px 10px', background: '#11110F', borderRadius: 8, fontSize: 12 }}>
            当前余额： <strong>¥{balance.toFixed(2)}</strong>
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
                  error('余额不足', `需要 ¥${cost}，当前余额 ¥${balance.toFixed(2)}`);
                }
              }}
              style={{ flex: 1, padding: '10px 14px', background: '#fecc2a', color: '#0A0908', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}
            >
              购买月卡 — ¥99
            </button>
          )}
          {hasGodyPass && (
            <button
              onClick={() => {
                const cost = 89;
                if (balance >= cost) {
                  buyGodyPass(cost);
                  success('Gody 通行证', '续费成功！谢谢。');
                  setShowGodyModal(false);
                } else {
                  error('余额不足', `需要 ¥${cost}`);
                }
              }}
              style={{ flex: 1, padding: '10px 14px', background: '#fecc2a', color: '#0A0908', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}
            >
              续费（¥89）
            </button>
          )}
          <button
            onClick={() => setShowGodyModal(false)}
            style={{ padding: '10px 18px', background: 'transparent', color: '#B8B5B0', border: '1px solid #3A3935', borderRadius: 10, fontSize: 13, cursor: 'pointer' }}
          >
            关闭
          </button>
        </div>
        <div style={{ fontSize: 10, opacity: 0.6, marginTop: 8, textAlign: 'center' }}>演示：从余额扣款 · 通过演示状态持久化</div>
      </Modal>

      {/* 赠送礼物小弹窗 - send to demo contacts, deducts balance */}
      <Modal
        open={showGiftModal}
        onClose={() => setShowGiftModal(false)}
        title="发送礼品"
        width={340}
      >
        <div style={{ fontSize: 13, color: '#C9C6BE', marginBottom: 10 }}>
          向亲友赠送行程积分。将从演示余额中扣除。
        </div>

        <div style={{ fontSize: 12, marginBottom: 6, color: '#EDEBE5' }}>最近联系人</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
          {['👩 妈妈', '👨 家人', '🚗 李师傅（司机）', 'Sarah 👩‍💼', 'Alex friend'].map(c => (
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
          余额：¥{balance.toFixed(2)} · 赠送给：<strong>{selectedContact || '（选择联系人）'}</strong>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            disabled={!selectedContact}
            onClick={() => {
              if (!selectedContact) return;
              if (balance < giftAmount) {
                error('余额不足', `无法发送 ¥${giftAmount}`);
                return;
              }
              sendGift(selectedContact, giftAmount);
              success('礼品已发送', `已向 ${selectedContact} 赠送 ¥${giftAmount} 行程额度`);
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
            发送礼物
          </button>
          <button onClick={() => setShowGiftModal(false)} style={{ padding: '10px 16px', background: 'transparent', color: '#B8B5B0', border: '1px solid #3A3935', borderRadius: 10, fontSize: 13, cursor: 'pointer' }}>
            取消
          </button>
        </div>
      </Modal>

      {/* Free trips / Promo credits modal */}
      <Modal
        open={showFreeModal}
        onClose={() => setShowFreeModal(false)}
        title="免费行程与优惠"
        width={340}
      >
        <div style={{ fontSize: 13, color: '#C9C6BE', marginBottom: 12 }}>
          领取 GODY 行程促销积分。积分将显示在您的资料中。
        </div>
        <div style={{ padding: '12px 14px', background: '#11110F', borderRadius: 10, marginBottom: 14 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#fecc2a' }}>{promoCredits}</div>
          <div style={{ fontSize: 12, color: '#EDEBE5' }}>可用优惠次数</div>
          <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>≈ ¥{promoCredits * 12} 行程额度（演示）</div>
        </div>

        <button
          onClick={() => {
            claimPromoCredit(1);
            success('优惠已领取', '已向账户添加 1 次免费行程');
            // keep modal open for multiple claims in demo
          }}
          style={{ width: '100%', padding: '11px 0', background: '#fecc2a', color: '#0A0908', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: 'pointer', marginBottom: 8 }}
        >
          领取 1 次免费行程积分
        </button>

        <button
          onClick={() => {
            claimPromoCredit(3);
            success('优惠组合', '已添加 +3 次优惠！');
          }}
          style={{ width: '100%', padding: '9px 0', background: 'transparent', color: '#fecc2a', border: '1px solid #fecc2a', borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
        >
          领取 3 次优惠组合（演示）
        </button>

        <div style={{ fontSize: 10, opacity: 0.55, marginTop: 10, textAlign: 'center' }}>
          可用于下次预订（仅演示 — 显示在权益栏）
        </div>
      </Modal>

      {/* Eats simple ordering simulation modal — creates parallel trip + updates stats */}
      <Modal
        open={showEatsModal}
        onClose={() => setShowEatsModal(false)}
        title="Gody 外卖"
        width={340}
      >
        <div style={{ fontSize: 13, color: '#C9C6BE', marginBottom: 10 }}>
          快速演示点餐。订单会更新外卖计数，并可生成配送行程。
        </div>

        <div style={{ fontSize: 12, marginBottom: 6, color: '#EDEBE5' }}>附近热门</div>
        {[
          { restaurant: '好运面馆', item: '牛肉面', cost: 28 },
          { restaurant: '披萨王', item: '玛格丽特披萨', cost: 42 },
          { restaurant: '轻食碗', item: '牛油果鸡肉沙拉', cost: 35 },
          { restaurant: '街边小炒', item: '宫保鸡丁', cost: 31 },
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
          余额：¥{balance.toFixed(2)} {eatsChoice ? `· ${eatsChoice.item} ¥${eatsChoice.cost}` : ''}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            disabled={!eatsChoice}
            onClick={() => {
              if (!eatsChoice) return;
              if (balance < eatsChoice.cost) {
                error('余额不足', '演示中充值？');
                return;
              }
              // Place order + stats
              placeEatsOrder(eatsChoice.restaurant, eatsChoice.item, eatsChoice.cost);
              // Parallel delivery trip (lightweight)
              bookTrip({
                from: eatsChoice.restaurant,
                to: '家庭（演示）',
                driver: '配送骑手',
                vehicle: '电动车 🛵',
                price: eatsChoice.cost,
                status: 'upcoming',
                eta: '18-25 分钟'
              });
              success('下单成功！', `${eatsChoice.item} · 配送中。请在行程中心查看。`);
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
            下单并跟踪
          </button>
          <button onClick={() => setShowEatsModal(false)} style={{ padding: '10px 14px', background: 'transparent', color: '#B8B5B0', border: '1px solid #3A3935', borderRadius: 10, fontSize: 13, cursor: 'pointer' }}>
            关闭
          </button>
        </div>
        <div style={{ fontSize: 10, textAlign: 'center', opacity: 0.5, marginTop: 6 }}>演示流程：增加外卖统计 + 配送行程写入 bookedTrips</div>
      </Modal>

      <HomeIndicator />
    </div>
  );
};

export default ProfilePage;
