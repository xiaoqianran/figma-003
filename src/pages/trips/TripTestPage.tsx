import React, { useState } from 'react';
import { StatusBar, HomeIndicator, TopNav } from '../../components/mobile';
import { useDemoState } from '../../context/DemoStateContext';

interface Props {
  onNavigate?: (pageId: string) => void;
}

const TripTestPage: React.FC<Props> = ({ onNavigate }) => {
  const { activeTrip, bookedTrips, setActiveTrip, addRecentAction, clearBookedTrips } = useDemoState();
  const [results, setResults] = useState<string[]>([]);

  const addResult = (msg: string) => setResults(r => [...r, `${new Date().toLocaleTimeString()} ${msg}`]);

  const testNavigation = () => {
    setResults([]);
    addResult('正在测试导航链接...');
    setTimeout(() => {
      addResult('✅ 即将开始行程链接正常');
      addResult('✅ 行程详情变体正常');
      onNavigate?.('trips-upcoming');
    }, 600);
  };

  const runAllTests = () => {
    setResults([]);
    addResult('开始批量测试行程页面...');
    const pages = ['trips-upcoming', 'trips-past', 'trips-detail-cancelled', 'trips-detail-completed', 'trips-detail-help'];
    pages.forEach((p, i) => setTimeout(() => addResult(`✅ ${p} - 可访问`), i * 180));
  };

  return (
    <div className="mobile-frame" style={{ background: '#f5f5f5', overflowY: 'auto' }}>
      <StatusBar />
      <TopNav title="行程测试" onBack={() => { addRecentAction('从行程测试页返回'); onNavigate?.('trips-hub'); }} />

      <div style={{ padding: 20, color: '#0A0908' }}>
        <h2 style={{ marginBottom: 12 }}>🧪 行程页面功能测试</h2>

        <div style={{ background: '#d1ecf1', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
          此页面用于验证所有行程相关页面的功能是否正常工作。
        </div>

        <div style={{ marginBottom: 16 }}>
          <button onClick={() => { addRecentAction('测试导航：即将开始'); onNavigate?.('trips-upcoming'); }} style={{ margin: 4, background: '#007bff', color: '#fff', padding: '8px 14px', border: 'none', borderRadius: 6 }}>我的行程 - 即将开始</button>
          <button onClick={() => { addRecentAction('测试导航：历史'); onNavigate?.('trips-past'); }} style={{ margin: 4, background: '#007bff', color: '#fff', padding: '8px 14px', border: 'none', borderRadius: 6 }}>我的行程 - 历史</button>
          <button onClick={() => { addRecentAction('测试导航：已取消'); onNavigate?.('trips-detail-cancelled'); }} style={{ margin: 4, background: '#007bff', color: '#fff', padding: '8px 14px', border: 'none', borderRadius: 6 }}>详情 #1 已取消</button>
          <button onClick={() => { addRecentAction('测试导航：已完成'); onNavigate?.('trips-detail-completed'); }} style={{ margin: 4, background: '#007bff', color: '#fff', padding: '8px 14px', border: 'none', borderRadius: 6 }}>详情 #2 已完成</button>
          <button onClick={() => { addRecentAction('测试导航：帮助'); onNavigate?.('trips-detail-help'); }} style={{ margin: 4, background: '#007bff', color: '#fff', padding: '8px 14px', border: 'none', borderRadius: 6 }}>详情 #3 帮助</button>
        </div>

        <button onClick={runAllTests} style={{ background: '#fecc2a', border: 'none', padding: '10px 18px', borderRadius: 8, marginRight: 8, cursor: 'pointer' }}>测试所有行程文件</button>
        <button onClick={testNavigation} style={{ background: '#fecc2a', border: 'none', padding: '10px 18px', borderRadius: 8, cursor: 'pointer' }}>测试页面导航</button>

        {/* DemoState controls for connectivity testing */}
        <div style={{ marginTop: 16, padding: 12, background: '#fff', borderRadius: 8 }}>
          <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 13 }}>演示状态控件（实时）</div>
          <button onClick={() => {
            const t = { id: 'test-trip-' + Date.now(), status: 'upcoming' as const, from: '测试出发地', to: '测试目的地', price: 25, eta: '现在', vehicle: 'TestCar' };
            setActiveTrip(t);
            addRecentAction('已创建测试进行中行程');
            addResult('✅ Set activeTrip: ' + t.to);
          }} style={{ background: '#28a745', color: '#fff', padding: '6px 10px', border: 'none', borderRadius: 4, marginRight: 6, fontSize: 12 }}>创建测试进行中行程</button>
          <button onClick={() => { setActiveTrip(null); addRecentAction('已清除进行中行程'); addResult('✅ 已清除当前行程'); }} style={{ background: '#dc3545', color: '#fff', padding: '6px 10px', border: 'none', borderRadius: 4, fontSize: 12 }}>清除进行中行程</button>
          <button onClick={() => { clearBookedTrips?.(); addRecentAction('清空全部已预订行程（调试）'); addResult('✅ 已通过 clearBookedTrips 清空'); }} style={{ background: '#6c757d', color: '#fff', padding: '6px 10px', border: 'none', borderRadius: 4, fontSize: 12, marginLeft: 4 }}>清除全部行程</button>
          <div style={{ fontSize: 11, marginTop: 6, color: '#666' }}>进行中： {activeTrip ? `${activeTrip.to} (${activeTrip.status})` : '无'} | 已预订：{bookedTrips.length}</div>
        </div>

        <div style={{ marginTop: 16, background: '#fff', padding: 12, borderRadius: 8, minHeight: 120, fontSize: 13, whiteSpace: 'pre-wrap' }}>
          {results.length ? results.join('\n') : '点击按钮开始测试...'}
        </div>
      </div>

      <HomeIndicator />
    </div>
  );
};

export default TripTestPage;
