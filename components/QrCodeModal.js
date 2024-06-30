import React from 'react';
import Modal from './qrmodal';

const QrCodeModal = ({ isOpen, onClose, qrCodeUrl }) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="qr-code-modal">
        <img src={qrCodeUrl} alt="QR Code" className="qr-code-image" />
        <a href={qrCodeUrl} download="qr-code.png" className="download-button">Download QR Code</a>
      </div>
      <style jsx>{`
        .qr-code-modal {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .qr-code-image {
          width: 100%;
          max-width: 300px;
          margin-bottom: 20px;
        }
        .download-button {
          background-color: #FF8400;
          color: #FFFFFF;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
        }
        .download-button:hover {
          background-color: #FFB84D;
        }
      `}</style>
    </Modal>
  );
};

export default QrCodeModal;
