// components/QrCodeModal.js
import React from 'react';
import { Button } from '@/components/ui/button';

const QrCodeModal = ({ isOpen, onClose, qrCodeUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h1 className="heading">Your QR Code</h1>
        <img src={qrCodeUrl} alt="QR Code" className="qr-code-image" />
        <Button
          className="download-button"
          onClick={() => {
            const link = document.createElement('a');
            link.href = qrCodeUrl;
            link.download = 'qr-code.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        >
          Download QR Code
        </Button>
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          position: relative;
          max-width: 500px;
          width: 100%;
          text-align: center;
        }
        .modal-close {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
        }
        .heading {
          font-size: 1.5rem;
          color: #333333;
          margin-bottom: 1rem;
        }
        .qr-code-image {
          width: 150px;
          margin-bottom: 20px;
        }
        .download-button {
          background-color: #FF8400;
          color: #FFFFFF;
          border: none;
          padding: 0.75rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
          margin-top: 1rem;
        }
        .download-button:hover {
          background-color: #FFB84D;
        }
      `}</style>
    </div>
  );
};

export default QrCodeModal;
