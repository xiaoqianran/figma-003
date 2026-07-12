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
    addRecentAction(`通过 ${platform} 登录`);
    success('登录成功', `已通过 ${platform} 登录（演示）`);
    if (onNavigate) onNavigate('core-home');
  };

  const handlePhoneLogin = () => {
    if (!phone.trim() || !onNavigate) return;
    const formattedPhone = phone.startsWith('+') ? phone : `+44 ${phone}`;
    setUser({ name: 'Alex Chen', phone: formattedPhone });
    addRecentAction(`通过手机号登录：${formattedPhone}`);
    success('登录成功', '已通过手机号登录（演示）');
    onNavigate('core-home');
  };

  return (
    <div className={`mobile-frame ${styles.page}`}>
      <StatusBar />

      <div className={styles.hero}>
        <div className={styles.badge}>GODY</div>
        <h1 className={styles.welcomeTitle}>欢迎回来</h1>
        <p className={styles.subtitle}>登录后即可叫车、管理行程并便捷支付。</p>
      </div>

      <div className={styles.illustration}>
        <div className={styles.cityCard}>
          <div className={styles.pin}>📍</div>
          <div className={styles.carRow}>
            <span>🚗</span>
            <span className={styles.routeLine} />
            <span>🏢</span>
          </div>
          <div className={styles.illusCaption}>附近 14 辆电动车 · 平均 3 分钟</div>
        </div>
      </div>

      <div className={styles.phoneInputSection}>
        <label className={styles.fieldLabel}>手机号码</label>
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
        继续
      </button>

      <p className={styles.socialPrompt}>或使用以下方式登录</p>

      <div className={styles.socialButtons}>
        <button type="button" className={`${styles.socialButton} ${styles.facebook}`} onClick={() => handleSocialLogin('Facebook')} aria-label="Facebook 登录">
          f
        </button>
        <button type="button" className={`${styles.socialButton} ${styles.twitter}`} onClick={() => handleSocialLogin('Twitter')} aria-label="Twitter 登录">
          𝕏
        </button>
        <button type="button" className={`${styles.socialButton} ${styles.google}`} onClick={() => handleSocialLogin('Google')} aria-label="Google 登录">
          G
        </button>
      </div>

      <button
        type="button"
        className={styles.signupLink}
        onClick={() => onNavigate?.('auth-signup')}
      >
        还没有账号？<span>创建账户</span>
      </button>

      <HomeIndicator />
    </div>
  );
};

export default LoginPage;
