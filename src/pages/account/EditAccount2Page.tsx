import React, { useState } from 'react';
import { StatusBar, TopNav, HomeIndicator } from '../../components/mobile';
import { useDemoState } from '../../context/DemoStateContext';
import { useToast } from '../../components/ui';
import styles from './EditAccount2Page.module.css';

interface EditAccount2PageProps {
  onNavigate?: (pageId: string) => void;
}

const EditAccount2Page: React.FC<EditAccount2PageProps> = ({ onNavigate }) => {
  const { user, setUser, addRecentAction } = useDemoState();
  const { error, success, info } = useToast();
  const [firstName, setFirstName] = useState(user.name.split(' ')[0] || 'Push');
  const [isShift, setIsShift] = useState(false);

  const addChar = (char: string) => {
    const newChar = isShift ? char.toUpperCase() : char.toLowerCase();
    setFirstName(prev => prev + newChar);
    if (isShift) setIsShift(false);
  };

  const deleteChar = () => {
    setFirstName(prev => prev.slice(0, -1));
  };

  const clearInput = () => {
    setFirstName('');
  };

  const toggleShift = () => {
    setIsShift(!isShift);
  };

  const updateName = () => {
    if (!firstName.trim()) {
      error('名字', '请输入名字');
      return;
    }
    const newFull = `${firstName.trim()} ${user.name.split(' ').slice(1).join(' ') || 'Chen'}`.trim();
    setUser({ name: newFull });
    addRecentAction(`Updated name to ${newFull}`);
    success('名字已更新', `名字已更新为: ${firstName} (demo state synced)`);
    onNavigate?.('account-edit1');
  };

  const keysRow1 = ['Q','W','E','R','T','Y','U','I','O','P'];
  const keysRow2 = ['A','S','D','F','G','H','J','K','L'];
  const keysRow3 = ['Z','X','C','V','B','N','M'];

  return (
    <div className="mobile-frame">
      <StatusBar />

      <div className={styles.editContainer}>
        <TopNav
          title="Edit account"
          onBack={() => { addRecentAction('Back from edit account 2'); onNavigate?.('account-edit1'); }}
          rightAction={<span onClick={() => { addRecentAction('Closed edit account 2'); onNavigate?.('account-edit1'); }} style={{ cursor: 'pointer' }}>✕</span>}
        />

        <div className={styles.inputSection}>
          <div className={styles.fieldLabel}>First name</div>
          <div className={styles.inputContainer}>
            <input
              className={styles.inputValue}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter name"
            />
            <span className={styles.clearBtn} onClick={clearInput}>✕</span>
          </div>
          <div className={styles.yellowLine} />
        </div>

        <div className={styles.updateBtn} onClick={updateName}>
          Update first name
        </div>

        {/* Virtual Keyboard */}
        <div className={styles.keyboard}>
          <div className={styles.keyRow}>
            {keysRow1.map(k => (
              <div key={k} className={`${styles.key} ${k === 'I' || k === 'P' ? styles.wide : ''}`} onClick={() => addChar(k)}>{k}</div>
            ))}
          </div>

          <div className={styles.keyRow} style={{ paddingLeft: 18, paddingRight: 12 }}>
            {keysRow2.map(k => (
              <div key={k} className={styles.key} onClick={() => addChar(k)}>{k}</div>
            ))}
          </div>

          <div className={styles.keyRow}>
            <div className={styles.shiftKey} onClick={toggleShift}>⇧</div>
            {keysRow3.map(k => (
              <div key={k} className={styles.key} onClick={() => addChar(k)}>{k}</div>
            ))}
            <div className={styles.deleteKey} onClick={deleteChar}>⌫</div>
          </div>

          <div className={styles.specialRow}>
            <div className={styles.specialKey} onClick={() => info('键盘', '数字键盘 (demo)')}>123</div>
            <div className={`${styles.specialKey} ${styles.space}`} onClick={() => setFirstName(p => p + ' ')}>space</div>
            <div className={`${styles.specialKey} ${styles.return}`} onClick={updateName}>return</div>
          </div>
        </div>

        <HomeIndicator />
      </div>
    </div>
  );
};

export default EditAccount2Page;
