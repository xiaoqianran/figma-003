import React from 'react';
import styles from './index.module.scss';

const LoginPage = () => {
  // 处理手机号输入变化
  const handlePhoneInput = (e) => {
    console.log('手机号输入:', e.target.value);
  };

  // 处理社交媒体登录
  const handleSocialLogin = (platform) => {
    console.log(`使用${platform}登录`);
  };

  return (
    <div className={styles.loginContainer}>
      {/* 状态栏 */}
      <div className={styles.statusBar}>
        <div className={styles.statusBarContent}>
          <span className={styles.time}>9:09</span>
          <div className={styles.statusIcons}>
            <span className={styles.signal}>📶</span>
            <span className={styles.wifi}>📶</span>
            <span className={styles.battery}>🔋</span>
          </div>
        </div>
      </div>

      {/* 欢迎标题 */}
      <h1 className={styles.welcomeTitle}>WELCOME TO GODY!</h1>

      {/* 插画区域 */}
      <div className={styles.illustration}>
        {/* 城市背景 */}
        <div className={styles.cityBackground}>
          {/* 定位图标 */}
          <div className={styles.locationPin}>
            <div className={styles.pinIcon}>📍</div>
          </div>

          {/* 黄色汽车 */}
          <div className={styles.car}>
            <div className={styles.carBody}>🚗</div>
          </div>

          {/* 人物 */}
          <div className={styles.person}>
            <div className={styles.personIcon}>👨‍💼</div>
          </div>

          {/* 手机界面 */}
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
          {/* 国家选择器 */}
          <div className={styles.countrySelector}>
            <span className={styles.flag}>🇬🇧</span>
            <span className={styles.arrow}>▼</span>
            <span className={styles.countryCode}>+44</span>
          </div>

          {/* 分隔线 */}
          <div className={styles.divider}></div>

          {/* 手机号输入框 */}
          <input
            type="tel"
            className={styles.phoneInputField}
            placeholder="Enter your mobile number"
            onChange={handlePhoneInput}
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
        >
          <span className={styles.socialIcon}>f</span>
        </button>

        <button
          className={`${styles.socialButton} ${styles.twitter}`}
          onClick={() => handleSocialLogin('Twitter')}
        >
          <span className={styles.socialIcon}>🐦</span>
        </button>

        <button
          className={`${styles.socialButton} ${styles.google}`}
          onClick={() => handleSocialLogin('Google')}
        >
          <span className={styles.socialIcon}>G+</span>
        </button>
      </div>

      {/* 底部指示器 */}
      <div className={styles.homeIndicator}>
        <div className={styles.indicator}></div>
      </div>
    </div>
  );
};

export default LoginPage;