import React, { useState } from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import { useToast } from '../../components/ui';
import styles from './SignupPage.module.css';
import { useDemoState } from '../../context/DemoStateContext';

interface SignupPageProps {
  onNavigate?: (pageId: string) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onNavigate }) => {
  const { setUser, addRecentAction } = useDemoState();
  const { error: _error, success: _success } = useToast();
  const [phoneDigits, setPhoneDigits] = useState('12345678'); // initial value from HTML

  const formatPhone = (digits: string) => {
    if (digits.length > 4) {
      return digits.substring(0, 4) + ' ' + digits.substring(4);
    }
    return digits;
  };

  const inputNumber = (num: string) => {
    if (phoneDigits.length >= 8) return;
    const newDigits = phoneDigits + num;
    setPhoneDigits(newDigits);
  };

  const deleteNumber = () => {
    if (phoneDigits.length === 0) return;
    setPhoneDigits(phoneDigits.slice(0, -1));
  };

  const sendVerification = () => {
    const digits = phoneDigits.replace(/\s/g, '');
    if (digits.length < 8) {
      _error('手机号码不完整', '请输入完整的8位号码');
      return;
    }

    // simulate sending
    const btn = document.activeElement as HTMLButtonElement | null;
    const original = btn?.innerHTML;

    if (btn) {
      btn.innerHTML = '<span class="send-text">Sending...</span>';
      btn.setAttribute('disabled', 'true');
    }

    setTimeout(() => {
      _success('验证码已发送', `已发送到 +44 ${formatPhone(digits)}`);
      if (btn) {
        btn.innerHTML = original || '<span class="send-text">Send</span>';
        btn.removeAttribute('disabled');
      }
      // Demo integration: set user from signup phone + log + auto-nav to home
      const fullPhone = `+44 ${formatPhone(digits)}`;
      setUser({ name: 'Alex Chen', phone: fullPhone });
      addRecentAction(`Signed up with phone: ${fullPhone}`);
      if (onNavigate) {
        // In real app this would go to OTP screen; here we simulate success
        console.log('Verification sent - demo navigation to home');
        onNavigate('core-home');
      }
    }, 1200);
  };

  const handleBack = () => {
    if (onNavigate) {
      onNavigate('auth-login');
    }
  };

  // Keyboard layout data
  const keyboardLayout = [
    [
      { n: '1', l: '' },
      { n: '2', l: 'ABC' },
      { n: '3', l: 'DEF' },
    ],
    [
      { n: '4', l: 'GHI' },
      { n: '5', l: 'JKL' },
      { n: '6', l: 'MNO' },
    ],
    [
      { n: '7', l: 'PQRS' },
      { n: '8', l: 'TUV' },
      { n: '9', l: 'WXYZ' },
    ],
  ];

  return (
    <div className="mobile-frame">
      <StatusBar />

      {/* 头部导航 */}
      <div className={styles.header}>
        <div className={styles.backButton} onClick={handleBack} role="button">←</div>
        <div className={styles.headerTitle}>Sign up</div>
      </div>

      {/* 提示文字 */}
      <p className={styles.instructionText}>Enter your mobile number</p>

      {/* 手机号输入区域 (display only, controlled by custom keyboard) */}
      <div className={styles.phoneInputSection}>
        <div className={styles.phoneInput}>
          <div className={styles.countrySelector}>
            <span className={styles.flag}>🇬🇧</span>
            <span className={styles.arrow}>▼</span>
            <span className={styles.countryCode}>+44</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.phoneInputField} style={{ paddingTop: 2 }}>
            {formatPhone(phoneDigits)}
          </div>
        </div>
      </div>

      {/* 发送按钮 */}
      <button className={styles.sendButton} onClick={sendVerification} type="button">
        <span className={styles.sendText}>Send</span>
      </button>

      {/* 提示信息 */}
      <p className={styles.verificationNotice}>
        Buy continuing you may receive an SMS for verification. Message and data rates may apply.
      </p>

      {/* 自定义数字键盘 */}
      <div className={styles.keyboard}>
        {keyboardLayout.map((row, ri) => (
          <div key={ri} className={styles.keyboardRow}>
            {row.map((key, ki) => (
              <div
                key={ki}
                className={styles.key}
                onClick={() => inputNumber(key.n)}
                role="button"
                aria-label={`Key ${key.n}`}
              >
                <div className={styles.keyNumber}>{key.n}</div>
                {key.l && <div className={styles.keyLetters}>{key.l}</div>}
              </div>
            ))}
          </div>
        ))}

        {/* 第四行: 0 + 删除 */}
        <div className={styles.keyboardRow}>
          <div
            className={`${styles.key} ${styles.keyWide}`}
            onClick={() => inputNumber('0')}
            role="button"
          >
            <div className={styles.keyNumber}>0</div>
          </div>
          <div
            className={`${styles.key} ${styles.keyWide}`}
            onClick={deleteNumber}
            role="button"
            aria-label="Delete"
          >
            <div className={styles.keyDelete}>⌫</div>
          </div>
        </div>

        <HomeIndicator />
      </div>
    </div>
  );
};

export default SignupPage;
