import React, { useState, useRef, useEffect } from 'react';
import { StatusBar, HomeIndicator, TopNav } from '../../components/mobile';
import { useToast } from '../../components/ui';
import { useDemoState } from '../../context/DemoStateContext';
import styles from './Search1Page.module.css';

interface Search1PageProps {
  onNavigate?: (pageId: string) => void;
}

const Search1Page: React.FC<Search1PageProps> = ({ onNavigate }) => {
  const { activeTrip, addRecentAction } = useDemoState();
  const [searchInput, setSearchInput] = useState(activeTrip ? activeTrip.to : '');
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentLocHighlight, setCurrentLocHighlight] = useState(false);
  const [airportHighlight, setAirportHighlight] = useState(false);

  const { info, success, error } = useToast();

  const searchFieldRef = useRef<HTMLInputElement>(null);

  // Sync input value when searchInput changes (for keyboard)
  useEffect(() => {
    if (searchFieldRef.current) {
      searchFieldRef.current.value = searchInput;
    }
  }, [searchInput]);

  const goBack = () => {
    addRecentAction('Back from search1');
    onNavigate?.('core-home');
  };

  const editCurrentLocation = () => {
    setCurrentLocHighlight(true);
    setTimeout(() => {
      setCurrentLocHighlight(false);
      info('编辑位置', '编辑当前位置功能 (demo)');
    }, 200);
  };

  const startVoiceInput = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      success('语音输入', '语音输入完成 (demo)');
      // Simulate some input from voice
      const voiceText = 'Apple Park';
      setSearchInput(prev => prev + voiceText);
    }, 2000);
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
    info('保存地点', '显示保存的位置 (demo)');
    onNavigate?.('core-search2');
  };

  const selectAirport = () => {
    setAirportHighlight(true);
    setTimeout(() => {
      setAirportHighlight(false);
      success('已选择机场', 'San Francisco International Airport (demo)');
      onNavigate?.('booking-choose-car');
    }, 200);
  };

  const inputKey = (char: string) => {
    let finalChar = char;

    if (isShiftPressed && char.match(/[a-zA-Z]/)) {
      finalChar = char.toUpperCase();
      setIsShiftPressed(false);
    }

    const newValue = searchInput + finalChar;
    setSearchInput(newValue);

    // Input animation feedback on field
    if (searchFieldRef.current) {
      searchFieldRef.current.style.transform = 'scale(1.02)';
      setTimeout(() => {
        if (searchFieldRef.current) {
          searchFieldRef.current.style.transform = 'scale(1)';
        }
      }, 100);
    }
  };

  const deleteChar = () => {
    setSearchInput(prev => prev.slice(0, -1));
  };

  const toggleShift = () => {
    setIsShiftPressed(!isShiftPressed);
  };

  const switchToNumbers = () => {
    info('键盘', '切换到数字键盘 (demo)');
  };

  const submitSearch = () => {
    if (searchInput.trim()) {
      addRecentAction(`Searched destination: ${searchInput}`);
      success('搜索', `搜索：${searchInput} (demo)`);
      console.log('搜索关键词:', searchInput);
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
    // Simulate dictation adding text
    setTimeout(() => {
      setSearchInput(prev => prev + 'Dictated text ');
    }, 800);
  };

  // Handle native input changes (typing directly)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submitSearch();
    }
  };

  // Keyboard key press handlers with touch feedback
  const handleKeyTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    target.style.background = '#d0d0d2';
  };

  const handleKeyTouchEnd = (e: React.TouchEvent<HTMLDivElement>, isSpecial = false) => {
    const target = e.currentTarget;
    if (!isSpecial) {
      target.style.background = '#fcfcfe';
    }
  };

  return (
    <div className="mobile-frame" style={{ height: 812, overflow: 'hidden' }}>
      <StatusBar />

      {/* TopNav for back - adapted to match original header spacing closely */}
      <TopNav onBack={goBack} />

      {activeTrip && (
        <div style={{ margin: '0 16px 8px', padding: '6px 10px', background: '#fff8e1', borderRadius: 8, fontSize: 12 }}>
          Active trip to <strong>{activeTrip.to}</strong> — search prefilled
        </div>
      )}

      {/* 当前位置 */}
      <div className={`${styles.currentLocation} ${currentLocHighlight ? styles.highlight : ''}`}>
        <div className={styles.locationContent}>
          <div className={styles.locationDot}></div>
          <div className={styles.locationInfo}>
            <div className={styles.locationLabel}>You are here:</div>
            <div className={styles.locationValue}>Apple Union Square</div>
          </div>
        </div>
        <div className={styles.locationAction} onClick={editCurrentLocation}>✏️</div>
      </div>

      {/* 搜索输入框 */}
      <div className={styles.searchInput}>
        <div className={styles.searchIcon}>🔍</div>
        <input
          ref={searchFieldRef}
          type="text"
          className={styles.searchField}
          placeholder="Search your location"
          value={searchInput}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress}
        />
        <div
          className={`${styles.micIcon} ${isListening ? styles.listening : ''}`}
          onClick={startVoiceInput}
        >
          {isListening ? '🔴' : '🎤'}
        </div>
      </div>

      {/* 位置选项 */}
      <div className={styles.locationOptions}>
        <div className={styles.locationOption} onClick={addHome}>
          <div className={styles.optionIcon}>🏠</div>
          <div className={styles.optionText}>Add home</div>
        </div>
        <div className={styles.locationOption} onClick={addWork}>
          <div className={styles.optionIcon}>💼</div>
          <div className={styles.optionText}>Add work</div>
        </div>
        <div className={styles.locationOption} onClick={showSavedPlaces}>
          <div className={styles.optionIcon}>⭐</div>
          <div className={styles.optionText}>Saved places</div>
          <div className={styles.optionArrow}>›</div>
        </div>
      </div>

      {/* 机场信息 */}
      <div
        className={`${styles.airportInfo} ${airportHighlight ? styles.highlight : ''}`}
        onClick={selectAirport}
      >
        <div className={styles.airportHeader}>
          <div className={styles.airportIcon}>✈️</div>
          <div className={styles.airportName}>San Francisco International Airport</div>
        </div>
        <div className={styles.airportAddress}>348 Mc Donnell Rd, San Francisco</div>
      </div>

      {/* 虚拟键盘 - exact replica */}
      <div className={styles.virtualKeyboard}>
        {/* 第一行 */}
        <div className={styles.keyboardRow}>
          {['Q','W','E','R','T','Y','U','I','O','P'].map((k, i) => (
            <div
              key={i}
              className={styles.key}
              onClick={() => inputKey(k)}
              onTouchStart={handleKeyTouchStart}
              onTouchEnd={(e) => handleKeyTouchEnd(e)}
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
              onTouchStart={handleKeyTouchStart}
              onTouchEnd={(e) => handleKeyTouchEnd(e)}
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
            onTouchStart={handleKeyTouchStart}
            onTouchEnd={(e) => handleKeyTouchEnd(e, true)}
          >
            ⇧
          </div>
          {['Z','X','C','V','B','N','M'].map((k, i) => (
            <div
              key={i}
              className={styles.key}
              onClick={() => inputKey(k)}
              onTouchStart={handleKeyTouchStart}
              onTouchEnd={(e) => handleKeyTouchEnd(e)}
            >
              {k}
            </div>
          ))}
          <div
            className={`${styles.key} ${styles.keySpecial}`}
            onClick={deleteChar}
            onTouchStart={handleKeyTouchStart}
            onTouchEnd={(e) => handleKeyTouchEnd(e, true)}
          >
            ⌫
          </div>
        </div>

        {/* 第四行 */}
        <div className={styles.keyboardRow}>
          <div
            className={`${styles.key} ${styles.keyNumber}`}
            onClick={switchToNumbers}
            onTouchStart={handleKeyTouchStart}
            onTouchEnd={(e) => handleKeyTouchEnd(e)}
          >
            123
          </div>
          <div
            className={`${styles.key} ${styles.keySpace}`}
            onClick={() => inputKey(' ')}
            onTouchStart={handleKeyTouchStart}
            onTouchEnd={(e) => handleKeyTouchEnd(e)}
          >
            space
          </div>
          <div
            className={`${styles.key} ${styles.keyReturn}`}
            onClick={submitSearch}
            onTouchStart={handleKeyTouchStart}
            onTouchEnd={(e) => handleKeyTouchEnd(e)}
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

export default Search1Page;
