import React, { useState } from 'react';
import { StatusBar, TopNav, HomeIndicator } from '../../components/mobile';
import styles from './EditAccount1Page.module.css';
import { useDemoState } from '../../context/DemoStateContext';
import { useToast as useToast_, Modal } from '../../components/ui';

interface EditAccount1PageProps {
  onNavigate?: (pageId: string) => void;
}

const EditAccount1Page: React.FC<EditAccount1PageProps> = ({ onNavigate }) => {
  const { user, setUser, addRecentAction } = useDemoState();
  const { info, success } = useToast_();

  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [editingPhone, setEditingPhone] = useState('');

  const editField = (field: string) => {
    if (field === 'firstName' || field === 'lastName') {
      onNavigate?.('account-edit2');
    } else if (field === 'phone') {
      setEditingPhone(user.phone);
      setShowPhoneModal(true);
    } else {
      info('编辑', `编辑 ${field} (demo)`);
    }
  };

  const editAvatar = () => {
    info('头像', '打开头像编辑 (demo)');
  };

  return (
    <div className="mobile-frame">
      <StatusBar />

      <div className={styles.editContainer}>
        <TopNav
          title="编辑账户"
          onBack={() => onNavigate?.('account-profile')}
          rightAction={<span onClick={() => onNavigate?.('account-profile')} style={{ cursor: 'pointer', fontSize: 18 }}>✕</span>}
        />

        {/* Avatar */}
        <div className={styles.avatarSection}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatarCircle}>{user.avatar}</div>
            <div className={styles.editAvatarBtn} onClick={editAvatar}>✏️</div>
          </div>
        </div>

        {/* Fields */}
        <div className={styles.textField}>
          <div className={styles.fieldLabel}>名</div>
          <div className={styles.fieldInput} onClick={() => editField('firstName')}>
            <span className={styles.fieldValue}>{user.name.split(' ')[0] || 'Alex'}</span>
            <span className={styles.fieldArrow}>→</span>
          </div>
        </div>

        <div className={styles.textField}>
          <div className={styles.fieldLabel}>姓</div>
          <div className={styles.fieldInput} onClick={() => editField('lastName')}>
            <span className={styles.fieldValue}>{user.name.split(' ').slice(1).join(' ') || 'Chen'}</span>
            <span className={styles.fieldArrow}>→</span>
          </div>
        </div>

        <div className={styles.textField}>
          <div className={styles.fieldLabel}>手机号码</div>
          <div className={styles.fieldInput} onClick={() => editField('phone')}>
            <span className={styles.fieldValue}>{user.phone.replace(/^\+\d+\s?/, '')}</span>
            <span className={styles.verified}>已验证</span>
            <span className={styles.fieldArrow}>→</span>
          </div>
        </div>

        <div className={styles.textField}>
          <div className={styles.fieldLabel}>邮箱</div>
          <div className={styles.fieldInput} onClick={() => editField('email')}>
            <span className={styles.fieldValue} style={{ fontSize: 13 }}>pushputtichai789@gmail.com</span>
            <span className={styles.unverified}>未验证</span>
            <span className={styles.fieldArrow}>→</span>
          </div>
        </div>

        <div className={styles.textField}>
          <div className={styles.fieldLabel}>密码</div>
          <div className={styles.fieldInput} onClick={() => editField('password')}>
            <span className={`${styles.fieldValue} ${styles.password}`}>..........</span>
            <span className={styles.fieldArrow}>→</span>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <HomeIndicator />
      </div>

      {/* Phone edit modal (replaces native prompt) */}
      <Modal
        open={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        title="Update demo phone"
        confirmText="保存"
        onConfirm={() => {
          const val = editingPhone.trim();
          if (val) {
            setUser({ phone: val });
            addRecentAction(`Updated phone to ${val}`);
            success('Phone updated', `Demo phone set to ${val} (Profile + Home reflect instantly)`);
          }
          setShowPhoneModal(false);
        }}
      >
        <input
          type="text"
          value={editingPhone}
          onChange={(e) => setEditingPhone(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: 8,
            border: '1px solid #3A3935',
            background: '#11110F',
            color: '#EDEBE5',
            fontSize: 14,
            outline: 'none'
          }}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const val = editingPhone.trim();
              if (val) {
                setUser({ phone: val });
                addRecentAction(`Updated phone to ${val}`);
                success('Phone updated', `Demo phone set to ${val} (Profile + Home reflect instantly)`);
              }
              setShowPhoneModal(false);
            }
          }}
        />
      </Modal>
    </div>
  );
};

export default EditAccount1Page;
