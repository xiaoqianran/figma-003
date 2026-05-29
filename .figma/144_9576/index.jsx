import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.yourTrips}>
      <img
        src="../image/mpqqes4z-5wao9xz.svg"
        className={styles.systemStatusBarsBlac}
      />
      <div className={styles.titleBlack}>
        <div className={styles.group548}>
          <img src="../image/mpqqes4z-se5oxgk.svg" className={styles.iconsDelete} />
          <p className={styles.uITextHeadingH3B}>Your trips</p>
        </div>
        <div className={styles.rectangle462}>
          <p className={styles.upcoming}>Upcoming</p>
          <img
            src="../image/mpqqes4z-09v541l.svg"
            className={styles.iconsDownArrow1}
          />
        </div>
      </div>
      <div className={styles.group551}>
        <div className={styles.group2}>
          <img src="../image/mpqqes4z-f93kvln.svg" className={styles.group} />
          <div className={styles.phoneLocation}>
            <img src="../image/mpqqes50-wb89hv6.svg" className={styles.vector8} />
            <div className={styles.vector9} />
          </div>
          <div className={styles.vector} />
        </div>
        <img src="../image/mpqqes4z-y63vn1x.svg" className={styles.vector2} />
        <img src="../image/mpqqes4z-lh83von.svg" className={styles.group3} />
        <img src="../image/mpqqes4z-qgtqcmo.svg" className={styles.group4} />
        <img src="../image/mpqqes50-nbfuh17.svg" className={styles.vector10} />
        <img src="../image/mpqqes50-3tph7i0.svg" className={styles.vector11} />
        <img src="../image/mpqqes50-cm0cu1o.svg" className={styles.group5} />
        <div className={styles.group6}>
          <img src="../image/mpqqes50-fithw89.svg" className={styles.iconsPin31} />
        </div>
      </div>
      <p className={styles.youHaveNoUpcomingTri}>You have no upcoming trips!</p>
      <div className={styles.barsHomeIndicatorIPh}>
        <div className={styles.homeIndicator} />
      </div>
    </div>
  );
}

export default Component;
