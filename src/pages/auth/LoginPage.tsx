import React, { useState } from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import { useToast } from '../../components/ui';
import styles from './LoginPage.module.css';
import { useDemoState } from '../../context/DemoStateContext';

interface LoginPageProps {
  onNavigate?: (pageId: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { setUser, addRecentAction } = useDemoState();
  const { success } = useToast();
  const [phone, setPhone] = useState('');

  const handleSocialLogin = (platform: string) => {
    setUser({ name: 'Alex Chen', phone: '+44 7700 900123' });
    addRecentAction(`Logged in via ${platform}`);
    success('登录成功', `已通过 ${platform} 登录（演示）`);
    if (onNavigate) onNavigate('core-home');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
    console.log('手机号输入:', e.target.value);
  };

  const handlePhoneFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const container = e.currentTarget.parentElement;
    if (container) container.style.borderColor = '#fecc2a';
  };

  const handlePhoneBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const container = e.currentTarget.parentElement;
    if (container) container.style.borderColor = '#bdbdbd';
  };

  const handlePhoneLogin = () => {
    if (!phone.trim() || !onNavigate) return;
    const formattedPhone = phone.startsWith('+') ? phone : `+44 ${phone}`;
    setUser({ name: 'Alex Chen', phone: formattedPhone });
    addRecentAction(`Logged in via phone: ${formattedPhone}`);
    success('登录成功', '已通过手机号登录（演示）');
    onNavigate('core-home');
  };

  // Demo: pressing Enter on phone simulates login success -> set user + go to home
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handlePhoneLogin();
  };

  return (
    <div className="mobile-frame">
      <StatusBar />

      {/* 欢迎标题 */}
      <h1 className={styles.welcomeTitle}>WELCOME TO GODY!</h1>

      {/* 插画区域 */}
      <div className={styles.illustration}>
        <div className={styles.cityBackground}>
          <div className={styles.locationPin}>
            <div className={styles.pinIcon}>📍</div>
          </div>

          <div className={styles.car}>
            <div className={styles.carBody}>🚗</div>
          </div>

          <div className={styles.person}>
            <div className={styles.personIcon}>👨‍💼</div>
          </div>

          <div className={styles.phoneMockup}>
            <div className={styles.phoneScreen}>
              <div className={styles.mapDisplay}>🗺️</div>
              <div className={styles.listDisplay}>📋</div>
            </div>
          </div>
        </div>
      </div>

      {/* 手机号输入区域 */}
      <div className={styles.phoneInputSection}>
        <div className={styles.phoneInput}>
          <div className={styles.countrySelector}>
            <span className={styles.flag}>🇬🇧</span>
            <span className={styles.arrow}>▼</span>
            <span className={styles.countryCode}>+44</span>
          </div>
          <div className={styles.divider} />
          <input
            type="tel"
            className={styles.phoneInputField}
            placeholder="Enter your mobile number"
            value={phone}
            onChange={handlePhoneChange}
            onFocus={handlePhoneFocus}
            onBlur={handlePhoneBlur}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      {/* 社交媒体登录提示 */}
      <p className={styles.socialPrompt}>
        Or connect using to social media account
      </p>

      {/* 社交媒体登录按钮 */}
      <div className={styles.socialButtons}>
        <button
          className={`${styles.socialButton} ${styles.facebook}`}
          onClick={() => handleSocialLogin('Facebook')}
          type="button"
          aria-label="Continue with Facebook"
        >
          <span className={styles.socialIcon}>f</span>
        </button>

        <button
          className={`${styles.socialButton} ${styles.twitter}`}
          onClick={() => handleSocialLogin('Twitter')}
          type="button"
          aria-label="Continue with Twitter"
        >
          <span className={styles.socialIcon}>🐦</span>
        </button>

        <button
          className={`${styles.socialButton} ${styles.google}`}
          onClick={() => handleSocialLogin('Google')}
          type="button"
          aria-label="Continue with Google"
        >
          <span className={styles.socialIcon}>G+</span>
        </button>
      </div>

      <button
        type="button"
        className={styles.continueBtn}
        onClick={handlePhoneLogin}
        disabled={!phone.trim()}
      >
        Continue
      </button>

      <HomeIndicator />
    </div>
  );
};

export default LoginPage;
