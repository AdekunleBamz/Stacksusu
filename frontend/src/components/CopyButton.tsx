import React, { useState, useCallback } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import './CopyButton.css';

export interface CopyButtonProps {
  /** Text to copy to clipboard */
  text: string;
  /** Button label (optional, icon-only if not provided) */
  label?: string;
  /** Label to show when copied */
  copiedLabel?: string;
  /** Duration to show copied state (ms) */
  copiedDuration?: number;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Visual variant */
  variant?: 'ghost' | 'outline' | 'solid';
  /** Additional className */
  className?: string;
  /** Callback when copy succeeds */
  onCopy?: () => void;
  /** Callback when copy fails */
  onError?: (error: Error) => void;
}

/**
 * Copy to clipboard button with visual feedback
 * 
 * @example
 * ```tsx
 * <CopyButton text={walletAddress} label="Copy Address" />
 * 
 * // Icon only
 * <CopyButton text={txHash} size="sm" />
 * ```
 */
export function CopyButton({
  text,
  label,
  copiedLabel = 'Copied!',
  copiedDuration = 2000,
  size = 'md',
  variant = 'ghost',
  className = '',
  onCopy,
  onError,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopy?.();
      
      setTimeout(() => {
        setCopied(false);
      }, copiedDuration);
    } catch (error) {
      console.error('Failed to copy:', error);
      onError?.(error instanceof Error ? error : new Error('Copy failed'));
    }
  }, [text, copiedDuration, onCopy, onError]);

  const Icon = copied ? Check : Copy;

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`
        copy-button 
        copy-button--${size} 
        copy-button--${variant}
        ${copied ? 'copy-button--copied' : ''}
        ${className}
      `}
      aria-label={copied ? copiedLabel : label || 'Copy to clipboard'}
      title={copied ? copiedLabel : label || 'Copy to clipboard'}
    >
      <Icon className="copy-button__icon" />
      {label && (
        <span className="copy-button__label">
          {copied ? copiedLabel : label}
        </span>
      )}
    </button>
  );
}

export interface CopyTextProps {
  /** Text to display and copy */
  text: string;
  /** Whether to truncate long text */
  truncate?: boolean;
  /** Max characters to show when truncated */
  maxLength?: number;
  /** Additional className for the container */
  className?: string;
  /** Whether to show external link icon if text is a URL */
  showExternalLink?: boolean;
}

/**
 * Text display with copy button
 * Great for displaying addresses, hashes, etc.
 * 
 * @example
 * ```tsx
 * <CopyText 
 *   text="SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N"
 *   truncate
 *   maxLength={20}
 * />
 * ```
 */
export function CopyText({
  text,
  truncate = false,
  maxLength = 16,
  className = '',
  showExternalLink = false,
}: CopyTextProps) {
  const displayText = truncate && text.length > maxLength
    ? `${text.slice(0, maxLength / 2)}...${text.slice(-maxLength / 2)}`
    : text;

  const isUrl = text.startsWith('http://') || text.startsWith('https://');

  return (
    <div className={`copy-text ${className}`}>
      <code className="copy-text__code" title={text}>
        {displayText}
      </code>
      <div className="copy-text__actions">
        <CopyButton text={text} size="sm" />
        {showExternalLink && isUrl && (
          <a
            href={text}
            target="_blank"
            rel="noopener noreferrer"
            className="copy-text__link"
            title="Open in new tab"
          >
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
}

export interface AddressDisplayProps {
  /** Stacks address */
  address: string;
  /** Whether to show full address */
  full?: boolean;
  /** Custom explorer URL (defaults to Stacks explorer) */
  explorerUrl?: string;
  /** Additional className */
  className?: string;
}

/**
 * Stacks address display with copy and explorer link
 * 
 * @example
 * ```tsx
 * <AddressDisplay address={walletAddress} />
 * ```
 */
export function AddressDisplay({
  address,
  full = false,
  explorerUrl,
  className = '',
}: AddressDisplayProps) {
  const truncatedAddress = full
    ? address
    : `${address.slice(0, 8)}...${address.slice(-6)}`;

  const explorer = explorerUrl || `https://explorer.stacks.co/address/${address}?chain=mainnet`;

  return (
    <div className={`address-display ${className}`}>
      <a
        href={explorer}
        target="_blank"
        rel="noopener noreferrer"
        className="address-display__address"
        title={address}
      >
        {truncatedAddress}
      </a>
      <CopyButton text={address} size="sm" />
    </div>
  );
}

export interface TxHashDisplayProps {
  /** Transaction hash */
  txHash: string;
  /** Custom explorer URL */
  explorerUrl?: string;
  /** Additional className */
  className?: string;
}

/**
 * Transaction hash display with copy and explorer link
 * 
 * @example
 * ```tsx
 * <TxHashDisplay txHash={transaction.txId} />
 * ```
 */
export function TxHashDisplay({
  txHash,
  explorerUrl,
  className = '',
}: TxHashDisplayProps) {
  const truncated = `${txHash.slice(0, 10)}...${txHash.slice(-8)}`;
  const explorer = explorerUrl || `https://explorer.stacks.co/txid/${txHash}?chain=mainnet`;

  return (
    <div className={`tx-hash-display ${className}`}>
      <a
        href={explorer}
        target="_blank"
        rel="noopener noreferrer"
        className="tx-hash-display__hash"
        title={txHash}
      >
        {truncated}
      </a>
      <CopyButton text={txHash} size="sm" />
    </div>
  );
}

export default CopyButton;
