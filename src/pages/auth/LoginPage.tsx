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

  const handlePhoneLogin = () => {
    if (!phone.trim() || !onNavigate) return;
    const formattedPhone = phone.startsWith('+') ? phone : `+44 ${phone}`;
    setUser({ name: 'Alex Chen', phone: formattedPhone });
    addRecentAction(`Logged in via phone: ${formattedPhone}`);
    success('登录成功', '已通过手机号登录（演示）');
    onNavigate('core-home');
  };

  return (
    <div className={`mobile-frame ${styles.page}`}>
      <StatusBar />

      <div className={styles.hero}>
        <div className={styles.badge}>GODY</div>
        <h1 className={styles.welcomeTitle}>Welcome back</h1>
        <p className={styles.subtitle}>Sign in to request rides, manage trips, and pay seamlessly.</p>
      </div>

      <div className={styles.illustration}>
        <div className={styles.cityCard}>
          <div className={styles.pin}>📍</div>
          <div className={styles.carRow}>
            <span>🚗</span>
            <span className={styles.routeLine} />
            <span>🏢</span>
          </div>
          <div className={styles.illusCaption}>14 EVs nearby · avg 3 min</div>
        </div>
      </div>

      <div className={styles.phoneInputSection}>
        <label className={styles.fieldLabel}>Mobile number</label>
        <div className={styles.phoneInput}>
          <div className={styles.countrySelector}>
            <span className={styles.flag}>🇬🇧</span>
            <span className={styles.countryCode}>+44</span>
          </div>
          <div className={styles.divider} />
          <input
            type="tel"
            className={styles.phoneInputField}
            placeholder="7700 900123"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handlePhoneLogin();
            }}
          />
        </div>
      </div>

      <button
        type="button"
        className={styles.continueBtn}
        onClick={handlePhoneLogin}
        disabled={!phone.trim()}
      >
        Continue
      </button>

      <p className={styles.socialPrompt}>Or continue with</p>

      <div className={styles.socialButtons}>
        <button type="button" className={`${styles.socialButton} ${styles.facebook}`} onClick={() => handleSocialLogin('Facebook')} aria-label="Facebook">
          f
        </button>
        <button type="button" className={`${styles.socialButton} ${styles.twitter}`} onClick={() => handleSocialLogin('Twitter')} aria-label="Twitter">
          𝕏
        </button>
        <button type="button" className={`${styles.socialButton} ${styles.google}`} onClick={() => handleSocialLogin('Google')} aria-label="Google">
          G
        </button>
      </div>

      <button
        type="button"
        className={styles.signupLink}
        onClick={() => onNavigate?.('auth-signup')}
      >
        New here? <span>Create account</span>
      </button>

      <HomeIndicator />
    </div>
  );
};

export default LoginPage;
