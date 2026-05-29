import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.tripsDetail1}>
      <img
        src="../image/mpqqes43-0n6nhfl.svg"
        className={styles.systemStatusBarsBlac}
      />
      <div className={styles.titleBlack}>
        <div className={styles.group548}>
          <img src="../image/mpqqes43-e8czvsp.svg" className={styles.iconsDelete} />
          <p className={styles.uITextHeadingH3B}>Your trips</p>
        </div>
        <div className={styles.rectangle462}>
          <p className={styles.past}>Past</p>
          <img
            src="../image/mpqqes43-ilyui4r.svg"
            className={styles.iconsDownArrow1}
          />
        </div>
      </div>
      <div className={styles.autoWrapper}>
        <p className={styles.today345Pm}>Today, 3:45 pm&nbsp;</p>
        <p className={styles.a1700}>$17.00</p>
      </div>
      <div className={styles.autoWrapper2}>
        <p className={styles.toyotaCamry9Htr789}>Toyota Camry - 9HTR789</p>
        <div className={styles.stars}>
          <img src="../image/mpqqes43-1i89qwf.svg" className={styles.iconsDelete} />
          <img src="../image/mpqqes43-nq4l1tv.svg" className={styles.iconsDelete} />
          <img src="../image/mpqqes43-3xmwcfo.svg" className={styles.iconsDelete} />
          <img src="../image/mpqqes43-5ijr3g6.svg" className={styles.iconsDelete} />
          <img src="../image/mpqqes43-y03cy4f.svg" className={styles.iconsDelete} />
        </div>
      </div>
      <div className={styles.autoWrapper3}>
        <img
          src="../image/mpqqes44-7fx7ve2.png"
          className={styles.screenShot20200107At}
        />
        <img src="../image/mpqqes43-sb8juar.png" className={styles.path2} />
        <img src="../image/mpqqes43-f6l1g5h.svg" className={styles.iconsPin31} />
      </div>
      <div className={styles.autoWrapper4}>
        <p className={styles.today345Pm}>Today, 3:41 pm&nbsp;</p>
        <p className={styles.a1700}>$0.00</p>
      </div>
      <p className={styles.canceled}>Canceled</p>
      <img
        src="../image/mpqqes44-7fx7ve2.png"
        className={styles.screenShot20200107At2}
      />
      <div className={styles.barsHomeIndicatorIPh}>
        <div className={styles.homeIndicator} />
      </div>
    </div>
  );
}

export default Component;
