// QR code generation utilities
import QRCode from 'qrcode';

export interface QRCodeOptions {
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
}

export const generateQRCode = async (
  text: string,
  options: QRCodeOptions = {}
): Promise<string> => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(text, {
      width: options.width || 256,
      margin: options.margin || 2,
      color: {
        dark: options.color?.dark || '#000000',
        light: options.color?.light || '#FFFFFF',
      },
    });
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

export const generateEventQRCode = (eventId: string): Promise<string> => {
  const eventUrl = `${window.location.origin}/join-college-expo?event=${eventId}`;
  return generateQRCode(eventUrl);
};

export const downloadQRCode = (dataUrl: string, filename: string = 'qr-code.png'): void => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
