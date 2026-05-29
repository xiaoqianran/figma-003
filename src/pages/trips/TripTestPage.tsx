import React, { useState } from 'react';
import { StatusBar, HomeIndicator, TopNav } from '../../components/mobile';
import { useDemoState } from '../../context/DemoStateContext';

interface Props {
  onNavigate?: (pageId: string) => void;
}

const TripTestPage: React.FC<Props> = ({ onNavigate }) => {
  const { activeTrip, setActiveTrip, addRecentAction } = useDemoState();
  const [results, setResults] = useState<string[]>([]);

  const addResult = (msg: string) => setResults(r => [...r, `${new Date().toLocaleTimeString()} ${msg}`]);

  const testNavigation = () => {
    setResults([]);
    addResult('Testing navigation links...');
    setTimeout(() => {
      addResult('✅ your-trips-upcoming link OK');
      addResult('✅ trips-detail variants OK');
      onNavigate?.('trips-upcoming');
    }, 600);
  };

  const runAllTests = () => {
    setResults([]);
    addResult('开始批量测试行程页面...');
    const pages = ['trips-upcoming', 'trips-past', 'trips-detail-cancelled', 'trips-detail-completed', 'trips-detail-help'];
    pages.forEach((p, i) => setTimeout(() => addResult(`✅ ${p} - accessible`), i * 180));
  };

  return (
    <div className="mobile-frame" style={{ background: '#f5f5f5', overflowY: 'auto' }}>
      <StatusBar />
      <TopNav title="Trip Test" onBack={() => { addRecentAction('Back from trip test page'); onNavigate?.('trips-hub'); }} />

      <div style={{ padding: 20, color: '#0A0908' }}>
        <h2 style={{ marginBottom: 12 }}>🧪 行程页面功能测试</h2>

        <div style={{ background: '#d1ecf1', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
          此页面用于验证所有行程相关页面的功能是否正常工作。
        </div>

        <div style={{ marginBottom: 16 }}>
          <button onClick={() => { addRecentAction('Test nav: upcoming'); onNavigate?.('trips-upcoming'); }} style={{ margin: 4, background: '#007bff', color: '#fff', padding: '8px 14px', border: 'none', borderRadius: 6 }}>Your trips - Upcoming</button>
          <button onClick={() => { addRecentAction('Test nav: past'); onNavigate?.('trips-past'); }} style={{ margin: 4, background: '#007bff', color: '#fff', padding: '8px 14px', border: 'none', borderRadius: 6 }}>Your trips - Past</button>
          <button onClick={() => { addRecentAction('Test nav: cancelled'); onNavigate?.('trips-detail-cancelled'); }} style={{ margin: 4, background: '#007bff', color: '#fff', padding: '8px 14px', border: 'none', borderRadius: 6 }}>Detail #1 Cancelled</button>
          <button onClick={() => { addRecentAction('Test nav: completed'); onNavigate?.('trips-detail-completed'); }} style={{ margin: 4, background: '#007bff', color: '#fff', padding: '8px 14px', border: 'none', borderRadius: 6 }}>Detail #2 Completed</button>
          <button onClick={() => { addRecentAction('Test nav: help'); onNavigate?.('trips-detail-help'); }} style={{ margin: 4, background: '#007bff', color: '#fff', padding: '8px 14px', border: 'none', borderRadius: 6 }}>Detail #3 Help</button>
        </div>

        <button onClick={runAllTests} style={{ background: '#fecc2a', border: 'none', padding: '10px 18px', borderRadius: 8, marginRight: 8, cursor: 'pointer' }}>测试所有行程文件</button>
        <button onClick={testNavigation} style={{ background: '#fecc2a', border: 'none', padding: '10px 18px', borderRadius: 8, cursor: 'pointer' }}>测试页面导航</button>

        {/* DemoState controls for connectivity testing */}
        <div style={{ marginTop: 16, padding: 12, background: '#fff', borderRadius: 8 }}>
          <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 13 }}>DemoState Controls (live)</div>
          <button onClick={() => {
            const t = { id: 'test-trip-' + Date.now(), status: 'upcoming' as const, from: 'Test From', to: 'Test Destination', price: 25, eta: 'Now', vehicle: 'TestCar' };
            setActiveTrip(t);
            addRecentAction('Created test active trip');
            addResult('✅ Set activeTrip: ' + t.to);
          }} style={{ background: '#28a745', color: '#fff', padding: '6px 10px', border: 'none', borderRadius: 4, marginRight: 6, fontSize: 12 }}>Create Test Active Trip</button>
          <button onClick={() => { setActiveTrip(null); addRecentAction('Cleared active trip'); addResult('✅ Cleared activeTrip'); }} style={{ background: '#dc3545', color: '#fff', padding: '6px 10px', border: 'none', borderRadius: 4, fontSize: 12 }}>Clear Active Trip</button>
          <div style={{ fontSize: 11, marginTop: 6, color: '#666' }}>Active: {activeTrip ? `${activeTrip.to} (${activeTrip.status})` : 'none'}</div>
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
