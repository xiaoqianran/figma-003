import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.map3}>
      <div className={styles.screenShot20200107At}>
        <img
          src="../image/mpqobmg1-goho1sc.svg"
          className={styles.systemStatusBarsBlac}
        />
        <img src="../image/mpqobmg1-5lxwu87.svg" className={styles.iconsMenu61} />
        <div className={styles.rectangle506}>
          <p className={styles.pickUp}>Pick up</p>
          <p className={styles.whereToText}>
            San Fancisco
            <br />
            International Airport
          </p>
        </div>
        <div className={styles.iconsLocation}>
          <div className={styles.oval} />
        </div>
        <div className={styles.autoWrapper}>
          <div className={styles.homeIndicator2}>
            <div className={styles.homeIndicator} />
          </div>
          <div className={styles.rectangle406}>
            <p className={styles.pickUpIn8M39S3}>
              <span className={styles.pickUpIn8M39S}>Pick up in&nbsp;</span>
              <span className={styles.pickUpIn8M39S2}>8m 39s</span>
            </p>
            <p className={styles.toAppleUnionSquare}>To Apple Union Square</p>
            <p className={styles.at350PmFromSanFancis}>
              At 3:50 PM from San Fancisco International Airport
            </p>
            <p className={styles.a1600}>$16.00</p>
          </div>
        </div>
      </div>
      <div className={styles.autoWrapper2}>
        <img src="../image/mpqobmg1-kb6segf.png" className={styles.car} />
        <img src="../image/mpqobmg1-9rja6mz.png" className={styles.car2} />
        <img src="../image/mpqobmg1-s5g4p1y.png" className={styles.car3} />
        <img src="../image/mpqobmg1-8591ldu.png" className={styles.car4} />
        <img src="../image/mpqobmg1-m8iadwm.png" className={styles.car5} />
        <img src="../image/mpqobmg1-m8iadwm.png" className={styles.car6} />
      </div>
    </div>
  );
}

export default Component;
