import QRCode from 'qrcode';

export interface QROptions {
  width?: number;
  margin?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  color?: {
    dark?: string;
    light?: string;
  };
}

/**
 * Generate a high-resolution base64 PNG data URL for a given string/URL
 */
export async function generateQRDataURL(
  text: string,
  options: QROptions = {}
): Promise<string> {
  const defaultOptions: QROptions = {
    width: 600,
    margin: 2,
    errorCorrectionLevel: 'M',
    color: {
      dark: '#100c09',
      light: '#ffffff',
    },
    ...options,
  };

  try {
    return await QRCode.toDataURL(text, defaultOptions);
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

/**
 * Generate a raw SVG string for a given string/URL (ideal for lossless vector printing)
 */
export async function generateQRSVG(
  text: string,
  options: QROptions = {}
): Promise<string> {
  const defaultOptions = {
    width: options.width || 600,
    margin: options.margin !== undefined ? options.margin : 2,
    errorCorrectionLevel: options.errorCorrectionLevel || 'M',
    color: {
      dark: options.color?.dark || '#100c09',
      light: options.color?.light || '#ffffff',
    },
  };

  try {
    return await QRCode.toString(text, {
      ...defaultOptions,
      type: 'svg',
    });
  } catch (error) {
    console.error('Error generating QR SVG:', error);
    throw error;
  }
}
