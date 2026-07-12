import React from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import { useDemoState } from '../../context/DemoStateContext';
import { useToast as useToast_ } from '../../components/ui';
import styles from './TripDetailHelpPage.module.css';

interface Props {
  onNavigate?: (pageId: string) => void;
}

const TripDetailHelpPage: React.FC<Props> = ({ onNavigate }) => {
  const { activeTrip, bookedTrips, setActiveTrip, addRecentAction, updateTripStatus, completeTrip, cancelTrip } = useDemoState();
  const { success, info } = useToast_();
  const goBack = () => {
    addRecentAction('从行程帮助详情返回');
    onNavigate?.('trips-past');
  };

  const handleHelpOption = (label: string) => {
    addRecentAction(`已选择帮助选项：${label}`);
    info('帮助选项', `已选择：${label}（演示）`);
    if (label.includes('accident')) onNavigate?.('other-evaluate2');
  };

  // NEW: functional mutation helpers callable from help page actions (for demo flow)
  const handleCompleteFromHelp = () => {
    const id = activeTrip?.id;
    addRecentAction('从帮助页完成行程');
    if (id) completeTrip(id);
    success('完成', '从帮助流程完成行程');
    onNavigate?.('trips-past');
  };
  const handleCancelFromHelp = () => {
    const id = activeTrip?.id;
    addRecentAction('从帮助页取消行程');
    if (id) cancelTrip(id);
    onNavigate?.('trips-past');
  };
  const handleUpdateStatusFromHelp = (status: 'upcoming' | 'in-progress' | 'completed') => {
    const id = activeTrip?.id;
    if (id) {
      updateTripStatus(id, status);
      addRecentAction(`已从帮助页将状态更新为 ${status}`);
    }
    onNavigate?.(status === 'completed' ? 'trips-past' : 'trips-upcoming');
  };

  React.useEffect(() => {
    addRecentAction('查看行程帮助详情');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mobile-frame" style={{ background: '#fff', height: 947 }}>
      <StatusBar />

      <div className={styles.container}>
        <div className={styles.titleBar}>
          <span className={styles.backIcon} onClick={goBack}>←</span>
          <span className={styles.title}>行程详情</span>
        </div>

        <div className={styles.locationSection}>
          <div className={styles.locationIcons}>
            <div className={styles.hereDot}><div className={styles.hereDotInner} /></div>
            <div className={styles.locationLine} />
            <span style={{ fontSize: 16 }}>📍</span>
          </div>
          <div>
            <div className={styles.locInput}>{activeTrip?.to || '苹果联合广场'}</div>
            <div className={styles.locInput}>{activeTrip?.from || '旧金山国际机场'}</div>
          </div>
        </div>

        <div className={styles.ratingRow}>
          <div className={styles.avatar}>👤</div>
          <div className={styles.ratingLabel}>您已评价 Push</div>
          <div className={styles.ratingStars}>{Array.from({length:5}).map((_,i)=><span key={i} style={{color:'#fecc2a'}}>★</span>)}</div>
        </div>

        <div className={styles.helpLink} onClick={() => info('帮助', '打开帮助中心 (demo)')}>需要本次行程的帮助吗？</div>

        <div className={styles.actionRow}>
          <div className={styles.actionCard} onClick={() => { addRecentAction('从帮助页切换支付'); success('支付', '切换支付（演示）'); }}>
            <div style={{fontWeight:500}}>切换支付方式</div>
            <div style={{fontSize:14,color:'#959595',marginTop:12}}>我想更换本次行程的支付方式。</div>
          </div>
          <div className={styles.actionCard} onClick={() => { addRecentAction('从帮助打开支付'); onNavigate?.('payment-select'); }}>
            <div style={{fontWeight:500}}>切换支付方式</div>
            <div style={{fontSize:14,color:'#959595',marginTop:12}}>我想更换本次行程的支付方式。</div>
          </div>
        </div>

        {/* Help / Receipt */}
        <div className={styles.helpReceiptRow}>
          <div className={styles.helpBtn} onClick={() => { addRecentAction('从行程打开帮助中心'); info('帮助中心', '已打开帮助中心（演示）'); }}>帮助</div>
          <div className={styles.receiptBtn} onClick={() => { addRecentAction('已下载收据'); success('收据', '收据已下载（演示）'); }}>收据</div>
        </div>

        {/* Help options */}
        <div className={styles.helpOption} onClick={() => handleHelpOption('发生了事故')}>
          我遭遇了事故 <span>→</span>
        </div>
        <div className={styles.helpOption} onClick={() => handleHelpOption('查看车费明细')}>查看车费明细</div>
        <div className={styles.helpOption} onClick={() => handleHelpOption('我遗失了物品')}>我遗失了物品</div>
        <div className={styles.helpOption} onClick={() => handleHelpOption('司机态度不专业')}>司机态度不专业</div>
        <div className={styles.helpOption} onClick={() => handleHelpOption('车辆与预期不符')}>车辆与预期不符</div>

        {/* NEW: functional Cancel/Complete/Status mutation buttons in Help detail (leverage APIs, ensure past list population) */}
        <div style={{ padding: '16px 24px 8px', background: '#fafaf8', margin: '12px 0 0' }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#49493d', marginBottom: 8 }}>快捷状态操作（演示 - 会修改 bookedTrips 与当前行程）：</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={handleCompleteFromHelp} style={{ flex: '1 1 45%', padding: '10px 12px', fontSize: 13, background: '#4caf50', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer' }}>✓ 完成行程</button>
            <button onClick={handleCancelFromHelp} style={{ flex: '1 1 45%', padding: '10px 12px', fontSize: 13, background: '#c62828', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer' }}>✕ 取消行程</button>
            <button onClick={() => handleUpdateStatusFromHelp('in-progress')} style={{ flex: '1 1 45%', padding: '8px 12px', fontSize: 12, background: '#fff', border: '1px solid #fecc2a', borderRadius: 10, cursor: 'pointer' }}>设为进行中</button>
            <button onClick={() => handleUpdateStatusFromHelp('upcoming')} style={{ flex: '1 1 45%', padding: '8px 12px', fontSize: 12, background: '#fff', border: '1px solid #fecc2a', borderRadius: 10, cursor: 'pointer' }}>设为即将开始</button>
          </div>
          {activeTrip && <div style={{ fontSize: 10, marginTop: 6, color: '#6E6A61' }}>当前：{activeTrip.to}（{activeTrip.status}）| 已预订总数：{bookedTrips.length}</div>}
          {bookedTrips.filter(t=>t.status==='completed').length > 0 && (
            <div style={{ fontSize: 10, marginTop: 4 }}>
              历史状态中：{bookedTrips.filter(t=>t.status==='completed').length} — <span onClick={() => { const p = bookedTrips.find(t=>t.status==='completed'); if(p){setActiveTrip(p); onNavigate?.('trips-detail-completed');} }} style={{color:'#fecc2a', cursor:'pointer'}}>查看历史详情</span>
            </div>
          )}
        </div>

        <HomeIndicator />
      </div>
    </div>
  );
};

export default TripDetailHelpPage;
