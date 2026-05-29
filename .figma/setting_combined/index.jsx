import React from 'react';
import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.setting}>
      {/* 状态栏 */}
      <img
        src="../image/mpqqz200-2bpt7u1.svg"
        className={styles.systemStatusBarsBlac}
      />
      
      {/* 标题栏 */}
      <div className={styles.group548}>
        <img src="../image/mpqqz200-6tjmusf.svg" className={styles.iconsDelete} />
        <p className={styles.uITextHeadingH3B}>Setting</p>
      </div>

      {/* 个人资料卡片 */}
      <div className={styles.profile3}>
        <div className={styles.ellipse35}>
          <img src="../image/mpqqz20b-4xvac13.png" className={styles.ellipse15} />
        </div>
        <div className={styles.profile}>
          <p className={styles.pushPuttichai}>Push Puttichai</p>
          <p className={styles.a97266789}>9726 6789</p>
          <p className={styles.a97266789}>push2649@gmail.com</p>
        </div>
        <img src="../image/mpqqz201-opb9inj.svg" className={styles.profile2} />
      </div>

      {/* 邮件验证提示 */}
      <p className={styles.forAddedSecurityPlea}>
        For added security, please verity your email.
      </p>

      {/* Favourites 部分 */}
      <div className={styles.favourites2}>
        <p className={styles.favourites}>Favourites</p>
        <div className={styles.rectangle416}>
          <img src="../image/mpqqz201-l5k9jgk.svg" className={styles.iconsHome1} />
          <p className={styles.addHome}>Add home</p>
          <img
            src="../image/mpqqz201-opb9inj.svg"
            className={styles.iconsRightArrow1}
          />
        </div>
        <div className={styles.rectangle4162}>
          <img src="../image/mpqqz201-c8jsk7q.svg" className={styles.iconsHome1} />
          <p className={styles.addHome}>Add work</p>
          <img
            src="../image/mpqqz201-opb9inj.svg"
            className={styles.iconsRightArrow12}
          />
        </div>
      </div>

      {/* More saved places 链接 */}
      <p className={styles.moreSavedPlaces}>More saved places</p>

      {/* Trusted contacts 部分 */}
      <div className={styles.truestedContacts}>
        <p className={styles.favourites}>Truested contacts</p>
        <div className={styles.rectangle4163}>
          <img src="../image/mpqqz201-etc7bmk.svg" className={styles.iconsHome1} />
          <p className={styles.addHome}>Manage trusted contacts</p>
          <img
            src="../image/mpqqz201-opb9inj.svg"
            className={styles.iconsRightArrow13}
          />
        </div>
      </div>

      {/* 分享行程状态说明 */}
      <p className={styles.shareYourTripsStatus}>
        Share your trips status with family and friends in a single tap.
      </p>

      {/* Family 部分 */}
      <div className={styles.family}>
        <p className={styles.favourites}>Family</p>
        <div className={styles.rectangle420}>
          <div className={styles.setUpYourFamily2}>
            <p className={styles.setUpYourFamily}>Set up your family</p>
            <p className={styles.payForYourLovedOnesA}>
              Pay for your loved ones and get trips notifications
            </p>
          </div>
          <img
            src="../image/mpqqz201-opb9inj.svg"
            className={styles.iconsRightArrow2}
          />
        </div>
      </div>

      {/* Rewards 部分 */}
      <div className={styles.rewards}>
        <p className={styles.favourites}>Rewards</p>
        <div className={styles.rectangle4202}>
          {/* Visa Local Offers */}
          <div className={styles.autoWrapper}>
            <div className={styles.visaLocalOffers}>
              <p className={styles.setUpYourFamily}>Visa Local Offers&nbsp;</p>
              <p className={styles.joinAndStartEarningG}>
                Join and start earning Gody Cash
              </p>
            </div>
            <img
              src="../image/mpqqz201-opb9inj.svg"
              className={styles.iconsRightArrow2}
            />
          </div>
          <div className={styles.divider} />
          
          {/* Safety */}
          <div className={styles.autoWrapper2}>
            <div className={styles.safety}>
              <p className={styles.setUpYourFamily}>Safety</p>
              <p className={styles.controlYourSafetySet}>
                Control your safety setting, including trip check notifications
              </p>
            </div>
            <img
              src="../image/mpqqz201-opb9inj.svg"
              className={styles.iconsRightArrow2}
            />
          </div>
          <div className={styles.divider} />
          
          {/* Privacy settings */}
          <div className={styles.autoWrapper3}>
            <div className={styles.privacySettings}>
              <p className={styles.setUpYourFamily}>Privacy settings</p>
              <p className={styles.manageTheDataYouShar}>
                Manage the data you share with us
              </p>
            </div>
            <img
              src="../image/mpqqz201-opb9inj.svg"
              className={styles.iconsRightArrow2}
            />
          </div>
          <div className={styles.divider} />
          
          {/* Security */}
          <div className={styles.autoWrapper4}>
            <div className={styles.security}>
              <p className={styles.setUpYourFamily}>Security</p>
              <p className={styles.controlYourAccountSe}>
                Control your account security with 2-step verification and more.
              </p>
            </div>
            <img
              src="../image/mpqqz201-opb9inj.svg"
              className={styles.iconsRightArrow2}
            />
          </div>
        </div>
      </div>

      {/* Sign out 按钮 */}
      <div className={styles.rectangle4164}>
        <img
          src="../image/mpqqz1z9-ic7npg9.svg"
          className={styles.iconsSendToPhone1}
        />
        <p className={styles.signOut}>Sign out</p>
        <img
          src="../image/mpqqz201-opb9inj.svg"
          className={styles.iconsRightArrow1}
        />
      </div>

      {/* 底部指示器 */}
      <div className={styles.barsHomeIndicatorIPh}>
        <div className={styles.homeIndicator} />
      </div>
    </div>
  );
}

export default Component;