import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.payment}>
      <div className={styles.autoWrapper}>
        <img
          src="../image/mpqqns23-3gged7y.svg"
          className={styles.systemStatusBarsBlac}
        />
        <div className={styles.group548}>
          <img
            src="../image/mpqqns23-i3amcgs.svg"
            className={styles.iconsLeftArrow1}
          />
          <p className={styles.uITextHeadingH3B}>Payment</p>
        </div>
      </div>
      <p className={styles.paymentMethods}>Payment methods</p>
      <div className={styles.rectangle473}>
        <div className={styles.visa}>
          <div className={styles.autoWrapper2}>
            <img
              src="../image/mpqqns25-thfemsv.png"
              className={styles.oQueVisaElectron1}
            />
            <div className={styles.group25}>
              <p className={styles.a}>....</p>
              <p className={styles.a6789}>6789</p>
            </div>
            <img
              src="../image/mpqqns22-8swnwpt.svg"
              className={styles.iconsRightArrow1}
            />
          </div>
          <div className={styles.line} />
        </div>
        <div className={styles.card}>
          <div className={styles.autoWrapper3}>
            <img
              src="../image/mpqqns22-swwu970.svg"
              className={styles.iconsMoney111}
            />
            <p className={styles.cash}>Cash</p>
            <img
              src="../image/mpqqns22-8swnwpt.svg"
              className={styles.iconsRightArrow12}
            />
          </div>
          <div className={styles.line22} />
        </div>
        <div className={styles.cArd}>
          <p className={styles.addPaymentMethods}>Add payment methods</p>
        </div>
      </div>
      <div className={styles.tripProfiles2}>
        <p className={styles.tripProfiles}>Trip Profiles</p>
        <div className={styles.rectangle416}>
          <img
            src="../image/mpqqns23-o5cv51s.svg"
            className={styles.iconsCreditCard2}
          />
          <p className={styles.creditOrDebitCard}>Credit or debit card</p>
          <img
            src="../image/mpqqns22-8swnwpt.svg"
            className={styles.iconsRightArrow13}
          />
        </div>
        <div className={styles.rectangle420}>
          <img
            src="../image/mpqqns23-ag8wv1c.svg"
            className={styles.iconsMultiple191}
          />
          <div className={styles.group30}>
            <p className={styles.rideForBusiness}>Ride for business</p>
            <p className={styles.enableFeaturesForBus}>
              Enable features for business travel
            </p>
          </div>
        </div>
      </div>
      <div className={styles.paymentOffers}>
        <p className={styles.tripProfiles}>Payment offers</p>
        <div className={styles.rectangle421}>
          <img src="../image/mpqqns23-pgdgs6c.svg" className={styles.iconsMoney1} />
          <p className={styles.amexBenefit200GodyCa}>
            Amex benefit $200 Gody Cash
            <br />
            per year
          </p>
          <img
            src="../image/mpqqns22-8swnwpt.svg"
            className={styles.iconsRightArrow14}
          />
        </div>
        <div className={styles.rectangle4212}>
          <img
            src="../image/mpqqns23-hqei7d2.svg"
            className={styles.iconsCreditCard2}
          />
          <p className={styles.earnGodyCashWithVisa}>Earn Gody cash with Visa</p>
          <img
            src="../image/mpqqns22-8swnwpt.svg"
            className={styles.iconsRightArrow15}
          />
        </div>
      </div>
      <p className={styles.viewAllOffers}>View all offers</p>
      <div className={styles.autoWrapper4}>
        <div className={styles.promotions}>
          <p className={styles.tripProfiles}>Promotions</p>
          <div className={styles.rectangle4202}>
            <p className={styles.addPromoCode}>Add promo code</p>
            <img
              src="../image/mpqqns22-8swnwpt.svg"
              className={styles.iconsRightArrow2}
            />
          </div>
          <div className={styles.rectangle4162}>
            <img
              src="../image/mpqqns23-x36pcet.svg"
              className={styles.iconsCreditCard2}
            />
            <p className={styles.vouchers}>Vouchers</p>
            <img
              src="../image/mpqqns22-8swnwpt.svg"
              className={styles.iconsRightArrow16}
            />
          </div>
        </div>
        <div className={styles.barsHomeIndicatorIPh}>
          <div className={styles.homeIndicator} />
        </div>
      </div>
    </div>
  );
}

export default Component;