// utils/generateQrCode.js
const QRCode = require('qrcode');
const { createCanvas, loadImage } = require('canvas');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function generateQrCode(url, templatePath) {
  try {
    const canvas = createCanvas(600, 900); // Size of the template
    const ctx = canvas.getContext('2d');

    // Load the template image
    const template = await loadImage(templatePath);
    ctx.drawImage(template, 0, 0, 600, 900);

    // Generate QR code
    const qrCanvas = createCanvas(350, 350);
    await QRCode.toCanvas(qrCanvas, url, { errorCorrectionLevel: 'H' });

    // Overlay QR code onto template
    const qrX = 125; // X-coordinate to place the QR code
    const qrY = 150; // Y-coordinate to place the QR code
    ctx.drawImage(qrCanvas, qrX, qrY, 350, 350);

    // Convert the canvas to a buffer
    const buffer = canvas.toBuffer('image/png');

    // Upload the buffer to Cloudinary
    const result = await cloudinary.uploader.upload(`data:image/png;base64,${buffer.toString('base64')}`, {
      folder: 'qrcodes',
      public_id: url.split('/').pop(), // Use the last part of the URL as the public ID
    });

    console.log('QR code generated and uploaded successfully', result.secure_url);
    return result.secure_url; // Return the URL of the uploaded image
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

module.exports = { generateQrCode };
