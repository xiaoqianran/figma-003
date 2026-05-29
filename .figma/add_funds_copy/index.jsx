import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.addFunds}>
      <img
        src="../image/mpqqmf5v-sbhul6l.svg"
        className={styles.systemStatusBarsBlac}
      />
      <div className={styles.group548}>
        <img src="../image/mpqqmf5v-5dkui8m.svg" className={styles.iconsDelete} />
        <p className={styles.uITextHeadingH3B}>Add funds</p>
      </div>
      <div className={styles.autoWrapper}>
        <p className={styles.currentBalance}>Current balance</p>
        <p className={styles.a000}>$0.00</p>
      </div>
      <div className={styles.subtract}>
        <div className={styles.ellipse50}>
          <img
            src="../image/mpqqmf5w-lhcz4eb.svg"
            className={styles.iconsCoupon1}
          />
        </div>
        <div className={styles.autoWrapper2}>
          <p className={styles.youLlPay}>You'll pay</p>
          <p className={styles.a2500}>$25.00</p>
          <p className={styles.a1500}>$15.00</p>
        </div>
        <img src="../image/mpqqmf60-zb4o5tc.png" className={styles.car11} />
      </div>
      <div className={styles.subtract2}>
        <div className={styles.ellipse51}>
          <img
            src="../image/mpqqmf5w-lhcz4eb.svg"
            className={styles.iconsCoupon1}
          />
        </div>
        <div className={styles.autoWrapper3}>
          <p className={styles.currentBalance}>You'll pay</p>
          <p className={styles.a2800}>$28.00</p>
          <p className={styles.a2300}>$23.00</p>
        </div>
        <img src="../image/mpqqmf60-ynwbsy3.png" className={styles.car31} />
      </div>
      <div className={styles.subtract3}>
        <div className={styles.ellipse51}>
          <img
            src="../image/mpqqmf5w-lhcz4eb.svg"
            className={styles.iconsCoupon1}
          />
        </div>
        <div className={styles.autoWrapper3}>
          <p className={styles.currentBalance}>You'll pay</p>
          <p className={styles.a2800}>$32.00</p>
          <p className={styles.a2300}>$28.00</p>
        </div>
        <img src="../image/mpqqmf60-eip80t7.png" className={styles.a1234561} />
      </div>
      <div className={styles.barsHomeIndicatorIPh}>
        <div className={styles.homeIndicator} />
      </div>
    </div>
  );
}

export default Component;