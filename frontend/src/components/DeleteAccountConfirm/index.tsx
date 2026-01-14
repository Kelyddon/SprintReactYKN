import React from 'react';

type Props = {
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteAccountConfirm({ onConfirm, onCancel }: Props) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ background: '#fff', padding: 20, borderRadius: 8 }}>
        <h3 style={{ color: 'black' }}>⚠️ Supprimer le compte</h3>
        <p>Es-tu sûr de vouloir supprimer ton compte ? Cette action est définitive.</p>
        <button onClick={onConfirm} style={{ marginRight: 10 }}>
          Oui, supprimer
        </button>
        <button onClick={onCancel}>
          Non
        </button>
      </div>
    </div>
  );
}
