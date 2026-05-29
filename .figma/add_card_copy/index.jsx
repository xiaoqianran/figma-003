import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.addCard2}>
      <img
        src="../image/mpqqns17-pb7rv7o.svg"
        className={styles.systemStatusBarsBlac}
      />
      <div className={styles.addCard}>
        <img
          src="../image/mpqqns17-mmw6xzm.svg"
          className={styles.iconsLeftArrow1}
        />
        <p className={styles.uITextHeadingH3B}>Add card</p>
      </div>
      <div className={styles.textFiedCardNumber}>
        <p className={styles.cardNumber}>Card number</p>
        <div className={styles.rectangle416}>
          <img
            src="../image/mpqqns17-zhqwrgo.svg"
            className={styles.iconsCreditCard2}
          />
          <img
            src="../image/mpqqns17-vliylgu.svg"
            className={styles.iconsLeftArrow1}
          />
        </div>
        <div className={styles.line18} />
      </div>
      <div className={styles.autoWrapper}>
        <div className={styles.textFiedExpDate}>
          <p className={styles.cardNumber}>Exp, date</p>
          <div className={styles.rectangle4162}>
            <p className={styles.mMyy}>MM/YY</p>
          </div>
        </div>
        <div className={styles.textFiedCvv}>
          <p className={styles.cardNumber}>CVV</p>
          <div className={styles.rectangle417}>
            <p className={styles.mMyy}>123</p>
          </div>
        </div>
      </div>
      <div className={styles.textFiedCardNumberIc}>
        <p className={styles.cardNumber}>Country</p>
        <div className={styles.rectangle4163}>
          <img src="../image/mpqqns17-l0pkwaw.svg" className={styles.iconsGb} />
          <p className={styles.england}>England</p>
          <img
            src="../image/mpqqns17-t35wf0e.svg"
            className={styles.iconsDownArrow1}
          />
        </div>
      </div>
      <div className={styles.rectangle1}>
        <p className={styles.save}>Save</p>
      </div>
      <div className={styles.background}>
        <div className={styles.autoWrapper2}>
          <div className={styles.a12}>
            <div className={styles.key} />
            <p className={styles.a1}>1</p>
          </div>
          <div className={styles.a22}>
            <div className={styles.key2}>
              <p className={styles.aBc3}>
                <span className={styles.aBc}>AB</span>
                <span className={styles.aBc2}>C</span>
              </p>
            </div>
            <p className={styles.a2}>2</p>
          </div>
          <div className={styles.a32}>
            <div className={styles.key3}>
              <p className={styles.aBc}>DEF</p>
            </div>
            <p className={styles.a3}>3</p>
          </div>
        </div>
        <div className={styles.autoWrapper3}>
          <div className={styles.key4}>
            <p className={styles.gHi}>GHI</p>
            <p className={styles.a4}>4</p>
          </div>
          <div className={styles.key5}>
            <p className={styles.jKl}>JKL</p>
            <p className={styles.a5}>5</p>
          </div>
          <div className={styles.key6}>
            <p className={styles.mNo}>MNO</p>
            <p className={styles.a4}>6</p>
          </div>
        </div>
        <div className={styles.autoWrapper4}>
          <div className={styles.a7}>
            <div className={styles.key7}>
              <p className={styles.aBc}>PQRS</p>
            </div>
            <p className={styles.a3}>7</p>
          </div>
          <div className={styles.a8}>
            <div className={styles.key8}>
              <p className={styles.tUv}>TUV</p>
            </div>
            <p className={styles.a2}>8</p>
          </div>
          <div className={styles.a92}>
            <div className={styles.key9}>
              <p className={styles.aBc}>WXYZ</p>
            </div>
            <p className={styles.a9}>9</p>
          </div>
        </div>
        <div className={styles.autoWrapper5}>
          <div className={styles.key10}>
            <p className={styles.a0}>0</p>
          </div>
          <img src="../image/mpqqns17-nxis3sr.svg" className={styles.delete} />
        </div>
        <div className={styles.barsHomeIndicatorIPh}>
          <div className={styles.homeIndicator} />
        </div>
      </div>
    </div>
  );
}

export default Component;