import React, { useState } from 'react';
import styles from './index.module.scss';

const SignUpPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('1234 5678');

  // 处理数字输入
  const handleNumberInput = (number) => {
    const currentValue = phoneNumber.replace(/\s/g, '');
    
    // 限制最大长度为8位数字
    if (currentValue.length >= 8) {
      return;
    }
    
    const newValue = currentValue + number;
    
    // 格式化显示
    if (newValue.length > 4) {
      setPhoneNumber(newValue.substring(0, 4) + ' ' + newValue.substring(4));
    } else {
      setPhoneNumber(newValue);
    }
  };

  // 处理删除
  const handleDelete = () => {
    const currentValue = phoneNumber.replace(/\s/g, '');
    
    if (currentValue.length > 0) {
      const newValue = currentValue.substring(0, currentValue.length - 1);
      
      // 重新格式化
      if (newValue.length > 4) {
        setPhoneNumber(newValue.substring(0, 4) + ' ' + newValue.substring(4));
      } else {
        setPhoneNumber(newValue);
      }
    }
  };

  // 处理手机号输入变化
  const handlePhoneInputChange = (e) => {
    let value = e.target.value.replace(/\s/g, '');
    
    // 限制最大长度
    if (value.length > 8) {
      value = value.substring(0, 8);
    }
    
    // 格式化显示
    if (value.length > 4) {
      setPhoneNumber(value.substring(0, 4) + ' ' + value.substring(4));
    } else {
      setPhoneNumber(value);
    }
  };

  // 发送验证码
  const handleSendVerification = () => {
    const cleanNumber = phoneNumber.replace(/\s/g, '');
    
    if (!cleanNumber || cleanNumber.length < 8) {
      alert('请输入完整的手机号码');
      return;
    }
    
    // 这里可以添加发送验证码的逻辑
    alert(`验证码已发送到 +44 ${phoneNumber}`);
    console.log('发送验证码到:', phoneNumber);
  };

  // 返回上一页
  const handleGoBack = () => {
    window.history.back();
  };

  // 数字键盘布局数据
  const keyboardLayout = [
    [
      { number: '1', letters: '' },
      { number: '2', letters: 'ABC' },
      { number: '3', letters: 'DEF' }
    ],
    [
      { number: '4', letters: 'GHI' },
      { number: '5', letters: 'JKL' },
      { number: '6', letters: 'MNO' }
    ],
    [
      { number: '7', letters: 'PQRS' },
      { number: '8', letters: 'TUV' },
      { number: '9', letters: 'WXYZ' }
    ],
    [
      { number: '0', letters: '', wide: true },
      { type: 'delete', wide: true }
    ]
  ];

  return (
    <div className={styles.signUp2}>
      {/* 状态栏 */}
      <div className={styles.systemStatusBarsBlac}>
        <div className={styles.statusBarContent}>
          <span className={styles.time}>9:09</span>
          <div className={styles.statusIcons}>
            <span>📶</span>
            <span>📶</span>
            <span>🔋</span>
          </div>
        </div>
      </div>

      {/* 头部导航 */}
      <div className={styles.group548}>
        <div 
          className={styles.backButton} 
          onClick={handleGoBack}
        >
          ←
        </div>
        <p className={styles.uITextHeadingH3B}>Sign up</p>
      </div>

      {/* 提示文字 */}
      <p className={styles.enterYourMobileNumbe}>Enter your mobile number</p>

      {/* 手机号输入区域 */}
      <div className={styles.search}>
        <div className={styles.rectangle159}>
          <img src="../image/mpqnv799-i6vp82t.svg" className={styles.iconsGb} alt="UK Flag" />
          <img
            src="../image/mpqnv799-vkwzg1i.svg"
            className={styles.iconsDownArrow1}
            alt="Dropdown Arrow"
          />
          <p className={styles.a44}>+44</p>
          <input
            type="tel"
            className={styles.a12345678}
            value={phoneNumber}
            onChange={handlePhoneInputChange}
            placeholder="1234 5678"
          />
        </div>
        <div className={styles.line1} />
      </div>

      {/* 发送按钮 */}
      <div className={styles.rectangle1} onClick={handleSendVerification}>
        <p className={styles.send}>Send</p>
      </div>

      {/* 提示信息 */}
      <p className={styles.buyCotinuingYouMayRe}>
        Buy cotinuing you may receive an SMS for verification. Message and data rates may apply.
      </p>

      {/* 数字键盘 */}
      <div className={styles.background}>
        {keyboardLayout.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.autoWrapper}>
            {row.map((key, keyIndex) => {
              if (key.type === 'delete') {
                return (
                  <div 
                    key={keyIndex} 
                    className={styles.key10}
                    onClick={handleDelete}
                  >
                    <div className={styles.deleteIcon}>⌫</div>
                  </div>
                );
              }
              
              return (
                <div 
                  key={keyIndex} 
                  className={`${styles.key} ${key.wide ? styles.keyWide : ''}`}
                  onClick={() => handleNumberInput(key.number)}
                >
                  <div className={styles.keyContent}>
                    <p className={styles.keyNumber}>{key.number}</p>
                    {key.letters && (
                      <p className={styles.keyLetters}>{key.letters}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* 底部指示器 */}
        <div className={styles.barsHomeIndicatorIPh}>
          <div className={styles.homeIndicator} />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;