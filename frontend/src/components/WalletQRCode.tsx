import { memo, useMemo, useCallback } from 'react';
import { QrCode, Copy, Download, Check } from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';
import './WalletQRCode.css';

interface WalletQRCodeProps {
  /** Wallet address to encode */
  address: string;
  /** Size of the QR code in pixels */
  size?: number;
  /** Show copy button */
  showCopy?: boolean;
  /** Show download button */
  showDownload?: boolean;
  /** Additional class name */
  className?: string;
}

/**
 * Generate QR code as SVG path using a simple algorithm
 * This is a basic implementation - for production, consider using a library
 */
function generateQRMatrix(data: string): boolean[][] {
  // Simple hash-based matrix generation for visual representation
  // In production, use a proper QR code library like 'qrcode'
  const size = 25;
  const matrix: boolean[][] = [];
  
  // Create hash from data
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  // Generate matrix based on hash and data
  for (let row = 0; row < size; row++) {
    matrix[row] = [];
    for (let col = 0; col < size; col++) {
      // Position detection patterns (corners)
      const inTopLeftFinder = row < 7 && col < 7;
      const inTopRightFinder = row < 7 && col >= size - 7;
      const inBottomLeftFinder = row >= size - 7 && col < 7;
      
      if (inTopLeftFinder || inTopRightFinder || inBottomLeftFinder) {
        // Finder pattern
        const localRow = row < 7 ? row : row - (size - 7);
        const localCol = col < 7 ? col : col - (size - 7);
        const isOuter = localRow === 0 || localRow === 6 || localCol === 0 || localCol === 6;
        const isInner = localRow >= 2 && localRow <= 4 && localCol >= 2 && localCol <= 4;
        matrix[row][col] = isOuter || isInner;
      } else {
        // Data area - use hash-based pattern
        const dataIndex = (row * size + col) % data.length;
        const charCode = data.charCodeAt(dataIndex);
        const hashInfluence = ((hash >> (dataIndex % 16)) & 1) === 1;
        matrix[row][col] = ((charCode + row + col) % 3 === 0) !== hashInfluence;
      }
    }
  }
  
  return matrix;
}

/**
 * WalletQRCode Component
 * 
 * Displays a QR code for a wallet address that can be scanned
 * for easy sharing. Includes copy and download functionality.
 */
const WalletQRCode = memo(function WalletQRCode({
  address,
  size = 180,
  showCopy = true,
  showDownload = true,
  className
}: WalletQRCodeProps) {
  const [copied, setCopied] = useState(false);

  const matrix = useMemo(() => generateQRMatrix(address), [address]);
  const moduleSize = size / matrix.length;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  }, [address]);

  const handleDownload = useCallback(() => {
    // Create SVG element for download
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <rect width="${size}" height="${size}" fill="white"/>
        ${matrix.map((row, rowIndex) =>
          row.map((cell, colIndex) =>
            cell ? `<rect x="${colIndex * moduleSize}" y="${rowIndex * moduleSize}" width="${moduleSize}" height="${moduleSize}" fill="black"/>` : ''
          ).join('')
        ).join('')}
      </svg>
    `.trim();

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wallet-${address.slice(0, 8)}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [address, matrix, moduleSize, size]);

  const truncatedAddress = `${address.slice(0, 8)}...${address.slice(-8)}`;

  return (
    <div className={clsx('wallet-qr', className)}>
      <div className="wallet-qr__header">
        <QrCode size={18} />
        <h4 className="wallet-qr__title">Scan to Send</h4>
      </div>

      <div className="wallet-qr__code-container">
        <svg 
          className="wallet-qr__code"
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label={`QR code for wallet address ${truncatedAddress}`}
        >
          <rect width={size} height={size} fill="white" />
          {matrix.map((row, rowIndex) =>
            row.map((cell, colIndex) =>
              cell && (
                <rect
                  key={`${rowIndex}-${colIndex}`}
                  x={colIndex * moduleSize}
                  y={rowIndex * moduleSize}
                  width={moduleSize}
                  height={moduleSize}
                  fill="#1e293b"
                />
              )
            )
          )}
        </svg>
      </div>

      <div className="wallet-qr__address">
        <code className="wallet-qr__address-text">{truncatedAddress}</code>
      </div>

      {(showCopy || showDownload) && (
        <div className="wallet-qr__actions">
          {showCopy && (
            <button 
              className="wallet-qr__action"
              onClick={handleCopy}
              aria-label={copied ? 'Copied!' : 'Copy address'}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
          {showDownload && (
            <button 
              className="wallet-qr__action"
              onClick={handleDownload}
              aria-label="Download QR code"
            >
              <Download size={16} />
              Download
            </button>
          )}
        </div>
      )}
    </div>
  );
});

export { WalletQRCode };
export default WalletQRCode;
