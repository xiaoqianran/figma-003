import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.privacySettings2}>
      <img
        src="../image/mpqqzgio-ymag8e5.svg"
        className={styles.systemStatusBarsBlac}
      />
      <div className={styles.privacySettings}>
        <img
          src="../image/mpqqzgio-e03yv77.svg"
          className={styles.iconsLeftArrow1}
        />
        <p className={styles.uITextHeadingH3B}>Privacy settings</p>
      </div>
      <div className={styles.rectangle420}>
        <div className={styles.location2}>
          <p className={styles.location}>Location</p>
          <p className={styles.updateYourLocationSh}>
            Update your location sharing preferences
          </p>
        </div>
        <img
          src="../image/mpqqzgio-bylv8o8.svg"
          className={styles.iconsRightArrow2}
        />
      </div>
      <div className={styles.rectangle4202}>
        <div className={styles.location2}>
          <p className={styles.location}>Notifications</p>
          <p className={styles.updateYourLocationSh}>
            Control which messages you receive from Gody
          </p>
        </div>
        <img
          src="../image/mpqqzgio-bylv8o8.svg"
          className={styles.iconsRightArrow2}
        />
      </div>
      <div className={styles.rectangle4203}>
        <div className={styles.location2}>
          <p className={styles.location}>911 data-sharing</p>
          <p className={styles.updateYourLocationSh}>
            Update your data sharing preferences
          </p>
        </div>
        <img
          src="../image/mpqqzgio-bylv8o8.svg"
          className={styles.iconsRightArrow22}
        />
      </div>
      <div className={styles.rectangle4204}>
        <p className={styles.deleteYourAccount}>Delete your account</p>
        <img
          src="../image/mpqqzgio-bylv8o8.svg"
          className={styles.iconsRightArrow23}
        />
      </div>
      <div className={styles.barsHomeIndicatorIPh}>
        <div className={styles.homeIndicator} />
      </div>
    </div>
  );
}

export default Component;
