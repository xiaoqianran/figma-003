import React, { useState } from 'react';
import { StatusBar, HomeIndicator, TopNav } from '../../components/mobile';
import { useToast } from '../../components/ui';
import { useDemoState } from '../../context/DemoStateContext';
import styles from './Search2Page.module.css';

interface Search2PageProps {
  onNavigate?: (pageId: string) => void;
}

const Search2Page: React.FC<Search2PageProps> = ({ onNavigate }) => {
  const { activeTrip, addRecentAction, bookTrip } = useDemoState();
  const [searchInput, setSearchInput] = useState(activeTrip ? activeTrip.to : '');
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState(false);

  const { info, success, error } = useToast();

  // The display value shown in the destination result row (updates live with typing)
  const displaySearchValue = searchInput.trim() ? searchInput : '搜索您的位置';

  const goBack = () => {
    addRecentAction('从搜索 2 返回');
    onNavigate?.('core-home');
  };

  const editLocation = (which: 'current' | 'dest') => {
    // Flash highlight on the item
    const items = document.querySelectorAll(`.${styles.searchResultItem}`);
    if (items.length > (which === 'current' ? 0 : 1)) {
      const item = items[which === 'current' ? 0 : 1] as HTMLElement;
      const orig = item.style.background;
      item.style.background = '#fff9e6';
      setTimeout(() => {
        item.style.background = orig || '#f8f9fa';
        info('编辑位置', '编辑位置功能 (demo)');
      }, 200);
    } else {
      info('编辑位置', '编辑位置功能 (demo)');
    }
  };

  const focusSearch = () => {
    info('搜索', '聚焦搜索输入框 (demo)');
    // Keyboard is always visible; simulate focus by selecting last result row
  };

  const addHome = () => {
    info('添加地址', '添加家庭地址 (demo)');
    onNavigate?.('booking-choose-car');
  };

  const addWork = () => {
    info('添加地址', '添加工作地址 (demo)');
    onNavigate?.('booking-choose-car');
  };

  const showSavedPlaces = () => {
    info('保存地点', '显示保存的地点 (demo)');
    onNavigate?.('core-search1');
  };

  const selectAirport = (_e: React.MouseEvent<HTMLDivElement>) => { // eslint-disable-line @typescript-eslint/no-unused-vars
    // Deselect others (though only one in this layout)
    setSelectedAirport(true);

    const airportName = '旧金山国际机场';

    setTimeout(() => {
      setSelectedAirport(false);
      // Result selection in Search2 also drives real booking (advanced path)
      const booked = bookTrip({
        status: 'upcoming',
        from: '苹果联合广场',
        to: airportName,
        price: 55,
        vehicle: 'GodyX',
        eta: '30 分钟',
      });
      addRecentAction(`Airport result selected (Search2): ${airportName} — booked via bookTrip #${booked.id}`);
      success('已选择机场', `已为 ${airportName} 创建真实预订 ($${booked.price})`);
      onNavigate?.('booking-choose-car');
    }, 300);
  };

  const inputKey = (char: string) => {
    let finalChar = char;

    if (isShiftPressed && char.match(/[a-zA-Z]/)) {
      finalChar = char.toUpperCase();
      setIsShiftPressed(false);
    }

    const newVal = searchInput + finalChar;
    setSearchInput(newVal);
    console.log('搜索输入:', newVal);
  };

  const deleteChar = () => {
    const newVal = searchInput.slice(0, -1);
    setSearchInput(newVal);
  };

  const toggleShift = () => {
    setIsShiftPressed(!isShiftPressed);
  };

  const switchToNumbers = () => {
    info('键盘', '切换到数字键盘 (demo)');
  };

  const submitSearch = () => {
    if (searchInput.trim()) {
      const to = searchInput.trim();
      // Search2 advanced filters (price range + vehicle type) influence the created trip
      const advPriceMin = 20;
      const advPriceMax = 45;
      const advVehicle = '黑金 SUV';
      const advPrice = Math.round((advPriceMin + advPriceMax) / 2);
      const advEta = '12 分钟';
      // Create real upcoming trip via bookTrip, using advanced filter values
      const booked = bookTrip({
        status: 'upcoming',
        from: '苹果联合广场',
        to,
        price: advPrice,
        vehicle: advVehicle,
        eta: advEta,
      });
      addRecentAction(`Advanced search: ${to} (filters: $${advPriceMin}-${advPriceMax}, ${advVehicle}) — booked #${booked.id} via bookTrip`);
      success('高级搜索完成', `已为 ${to} 创建真实预订 ($${booked.price} via ${booked.vehicle} — 高级筛选影响)`);
      console.log('搜索关键词:', searchInput, '已应用高级筛选，已预订：', booked);
      onNavigate?.('booking-choose-car');
    } else {
      error('搜索', '请输入搜索关键词');
    }
  };

  const showEmoji = () => {
    info('表情', '显示表情符号选择器 (demo)');
  };

  const startDictation = () => {
    info('语音', '开始语音听写 (demo)');
    setTimeout(() => {
      setSearchInput(prev => prev + '语音输入 ');
    }, 600);
  };

  // Touch feedback for keys (exact as original)
  const handleKeyDownStyle = (e: React.TouchEvent<HTMLDivElement>) => {
    (e.currentTarget as HTMLElement).style.background = '#d0d0d2';
  };

  const handleKeyUpStyle = (e: React.TouchEvent<HTMLDivElement>, isSpecial = false) => {
    const el = e.currentTarget as HTMLElement;
    if (!isSpecial && !el.classList.contains(styles.keySpecial || '')) {
      el.style.background = '#fcfcfe';
    }
  };

  return (
    <div className="mobile-frame" style={{ height: 812, overflow: 'hidden' }}>
      <StatusBar />

      <TopNav onBack={goBack} />

      {activeTrip && <div style={{ margin: '4px 16px', fontSize: 11, padding: '4px 8px', background: '#fff8e1', borderRadius: 6 }}>已从进行中行程预填：{activeTrip.to}</div>}

      {/* 搜索结果 */}
      <div className={styles.searchResults}>
        {/* 当前位置 */}
        <div className={styles.searchResultItem}>
          <div className={styles.resultContent}>
            <div className={styles.resultDot}></div>
            <div className={styles.resultInfo}>
              <div className={styles.resultLabel}>您在这里：</div>
              <div className={styles.resultValue}>苹果联合广场</div>
            </div>
          </div>
          <div className={styles.resultAction} onClick={() => editLocation('current')}>✏️</div>
        </div>

        {/* 目的地搜索显示 (live updated by keyboard) */}
        <div className={styles.searchResultItem}>
          <div className={styles.resultContent}>
            <div className={styles.resultDot}></div>
            <div className={styles.resultInfo}>
              <div className={styles.resultLabel}>您在这里：</div>
              <div className={styles.resultValue}>{displaySearchValue}</div>
            </div>
          </div>
          <div className={`${styles.resultAction} ${styles.close}`} onClick={focusSearch}>🎤</div>
        </div>
      </div>

      {/* 位置选项 */}
      <div className={styles.locationOptions}>
        <div className={styles.locationOption} onClick={addHome}>
          <span className={styles.locationIcon}>⭐</span>
          <span className={styles.locationText}>添加家庭地址</span>
        </div>
        <div className={styles.locationOption} onClick={addWork}>
          <span className={styles.locationIcon}>🏢</span>
          <span className={styles.locationText}>添加公司地址</span>
        </div>
        <div className={styles.locationOption} onClick={showSavedPlaces}>
          <span className={styles.locationIcon}>⭐</span>
          <span className={styles.locationText}>收藏地点</span>
          <span className={styles.locationArrow}>→</span>
        </div>
      </div>

      {/* 机场选项 */}
      <div
        className={`${styles.airportOption} ${selectedAirport ? styles.selected : ''}`}
        onClick={selectAirport}
      >
        <span className={styles.airportIcon}>🕐</span>
        <div className={styles.airportDetails}>
          <div className={styles.airportName}>旧金山国际机场</div>
          <div className={styles.airportAddress}>旧金山 Mc Donnell 路 348 号</div>
        </div>
      </div>

      {/* 虚拟键盘 - exact replica of original */}
      <div className={styles.virtualKeyboard}>
        {/* 第一行 */}
        <div className={styles.keyboardRow}>
          {['Q','W','E','R','T','Y','U','I','O','P'].map((k, i) => (
            <div
              key={i}
              className={styles.key}
              onClick={() => inputKey(k)}
              onTouchStart={handleKeyDownStyle}
              onTouchEnd={(e) => handleKeyUpStyle(e)}
            >
              {k}
            </div>
          ))}
        </div>

        {/* 第二行 */}
        <div className={styles.keyboardRow}>
          {['A','S','D','F','G','H','J','K','L'].map((k, i) => (
            <div
              key={i}
              className={styles.key}
              onClick={() => inputKey(k)}
              onTouchStart={handleKeyDownStyle}
              onTouchEnd={(e) => handleKeyUpStyle(e)}
            >
              {k}
            </div>
          ))}
        </div>

        {/* 第三行 */}
        <div className={styles.keyboardRow}>
          <div
            className={`${styles.key} ${styles.keySpecial} ${isShiftPressed ? styles.active : ''}`}
            onClick={toggleShift}
            onTouchStart={handleKeyDownStyle}
            onTouchEnd={(e) => handleKeyUpStyle(e, true)}
          >
            ⇧
          </div>
          {['Z','X','C','V','B','N','M'].map((k, i) => (
            <div
              key={i}
              className={styles.key}
              onClick={() => inputKey(k)}
              onTouchStart={handleKeyDownStyle}
              onTouchEnd={(e) => handleKeyUpStyle(e)}
            >
              {k}
            </div>
          ))}
          <div
            className={`${styles.key} ${styles.keySpecial}`}
            onClick={deleteChar}
            onTouchStart={handleKeyDownStyle}
            onTouchEnd={(e) => handleKeyUpStyle(e, true)}
          >
            ⌫
          </div>
        </div>

        {/* 第四行 */}
        <div className={styles.keyboardRow}>
          <div
            className={`${styles.key} ${styles.keyNumber}`}
            onClick={switchToNumbers}
            onTouchStart={handleKeyDownStyle}
            onTouchEnd={(e) => handleKeyUpStyle(e)}
          >
            123
          </div>
          <div
            className={`${styles.key} ${styles.keySpace}`}
            onClick={() => inputKey(' ')}
            onTouchStart={handleKeyDownStyle}
            onTouchEnd={(e) => handleKeyUpStyle(e)}
          >
            space
          </div>
          <div
            className={`${styles.key} ${styles.keyReturn}`}
            onClick={submitSearch}
            onTouchStart={handleKeyDownStyle}
            onTouchEnd={(e) => handleKeyUpStyle(e)}
          >
            return
          </div>
        </div>

        {/* 底部工具栏 */}
        <div className={styles.keyboardToolbar}>
          <div className={styles.toolbarIcon} onClick={showEmoji}>😊</div>
          <div className={styles.toolbarIcon} onClick={startDictation}>🎤</div>
        </div>
      </div>

      <HomeIndicator />
    </div>
  );
};

export default Search2Page;
