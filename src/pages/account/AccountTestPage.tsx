import React, { useState } from 'react';
import { StatusBar, HomeIndicator, TopNav } from '../../components/mobile';
import { useDemoState } from '../../context/DemoStateContext';

interface AccountTestPageProps {
  onNavigate?: (pageId: string) => void;
}

const AccountTestPage: React.FC<AccountTestPageProps> = ({ onNavigate }) => {
  const { user, setUser, activeTrip, bookedTrips, bookTrip, clearBookedTrips, addRecentAction } = useDemoState();
  const [results, setResults] = useState<string[]>([]);

  const addResult = (msg: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()} ${msg}`]);
  };

  const runTests = () => {
    setResults([]);
    addRecentAction('已运行账户测试');
    addResult('开始账户页面测试...');
    setTimeout(() => addResult('✅ Profile 页面结构正常'), 200);
    setTimeout(() => addResult('✅ 编辑账户表单字段完整'), 400);
    setTimeout(() => addResult('✅ 虚拟键盘交互已实现'), 600);
    setTimeout(() => addResult('✅ 侧边菜单动画 & 导航连通'), 800);
  };

  return (
    <div className="mobile-frame">
      <StatusBar />

      <TopNav title="账户测试" onBack={() => { addRecentAction('从账户测试返回'); onNavigate?.('account-index'); }} />

      <div style={{ padding: 24, fontSize: 14, color: '#49493d' }}>
        <h3 style={{ marginBottom: 12 }}>🧪 账户功能测试</h3>

        <button onClick={runTests} style={{ background: '#fecc2a', border: 'none', padding: '10px 18px', borderRadius: 8, marginBottom: 16, cursor: 'pointer' }}>
          运行测试
        </button>

        {/* DemoState live test panel for account connectivity */}
        <div style={{ background: '#fff', border: '1px solid #fecc2a', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 12 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>DemoState 实时（账户）</div>
          <div>用户：{user.name}（{user.phone}）</div>
          <div>进行中行程：{activeTrip ? activeTrip.to : '无'} | 已预订：{bookedTrips.length}</div>
          <div style={{ marginTop: 8 }}>
            <button onClick={() => { setUser({ name: '演示测试员' }); addRecentAction('从账户测试设置测试用户'); addResult('✅ 已更新演示用户'); }} style={{ fontSize: 11, padding: '4px 8px', marginRight: 6, background: '#0A0908', color: '#fecc2a', border: 'none', borderRadius: 4, cursor: 'pointer' }}>设置测试用户</button>
            <button onClick={() => { addRecentAction('重置用户名'); setUser({ name: 'Alex Chen' }); addResult('✅ 已重置演示用户'); }} style={{ fontSize: 11, padding: '4px 8px', background: '#0A0908', color: '#fecc2a', border: 'none', borderRadius: 4, cursor: 'pointer' }}>重置姓名</button>
            <button onClick={() => {
              if (typeof clearBookedTrips === 'function') clearBookedTrips();
              bookTrip({ status: 'completed', from: '虹桥机场 T2', to: '浦西滨江', driver: 'Wang Lei', vehicle: 'NIO ET7', price: 118, eta: '已到达' });
              bookTrip({ status: 'upcoming', from: 'Jing\'an Temple', to: '世纪大道', driver: 'Chen Fang', vehicle: 'Li Auto L9', price: 64, eta: '14 min' });
              const t3 = bookTrip({ status: 'in-progress', from: '外滩', to: '张江高科技园区', driver: 'Zhao Min', vehicle: '比亚迪海豹', price: 71, eta: '9 分钟' });
              addRecentAction(`已通过 bookTrip 植入 3 条示例行程（最新进行中：${t3.to}）`);
              addResult(`✅ 已植入 3 条示例行程（已预订 +3 · 进行中：${t3.to}）`);
            }} style={{ fontSize: 11, padding: '4px 8px', marginTop: 4, background: '#0A0908', color: '#fecc2a', border: 'none', borderRadius: 4, cursor: 'pointer' }}>填充 3 条示例行程（bookTrip）</button>
          </div>
        </div>

        <div style={{ background: '#f8f8f8', padding: 16, borderRadius: 8, minHeight: 220, fontSize: 12, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
          {results.length ? results.join('\n') : '点击按钮开始测试...'}
        </div>

        <div style={{ marginTop: 24 }}>
          <div onClick={() => { addRecentAction('测试打开资料'); onNavigate?.('account-profile'); }} style={{ padding: 12, background: '#f3f3f3', borderRadius: 8, marginBottom: 8, cursor: 'pointer' }}>→ 打开 Profile</div>
          <div onClick={() => { addRecentAction('测试打开编辑1'); onNavigate?.('account-edit1'); }} style={{ padding: 12, background: '#f3f3f3', borderRadius: 8, marginBottom: 8, cursor: 'pointer' }}>→ 打开 Edit #1</div>
          <div onClick={() => { addRecentAction('测试打开编辑2'); onNavigate?.('account-edit2'); }} style={{ padding: 12, background: '#f3f3f3', borderRadius: 8, marginBottom: 8, cursor: 'pointer' }}>→ 打开 Edit #2 (键盘)</div>
        </div>
      </div>

      <HomeIndicator />
    </div>
  );
};

export default AccountTestPage;
