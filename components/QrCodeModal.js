import React from 'react';
import Modal from './qrmodal'; // Ensure the correct import path
import { Button } from '@/components/ui/button';

const QrCodeModal = ({ isOpen, onClose, qrCodeUrl }) => {
  if (!isOpen) return null;

  const handleDownload = async () => {
    const response = await fetch(qrCodeUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'qr-code.png';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          Close
        </button>
        <div className="qr-code-container">
          {qrCodeUrl ? (
            <>
              <img src={qrCodeUrl} alt="QR Code" className="qr-code-image" />
              <Button onClick={handleDownload} className="download-button bg-[#FF8400] text-[#FFFFFF]">
                Download QR Code
              </Button>
            </>
          ) : (
            <p>Loading QR Code...</p>
          )}
        </div>
      </div>
      <style jsx>{`
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
        }
        .modal-close {
          background-color: #ff8400;
          color: #ffffff;
          border: none;
          padding: 10px;
          border-radius: 4px;
          cursor: pointer;
          margin-bottom: 20px;
        }
        .qr-code-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .qr-code-image {
          max-width: 100%;
          height: auto;
        }
        .download-button {
          margin-top: 20px;
        }
      `}</style>
    </Modal>
  );
};

export default QrCodeModal;
