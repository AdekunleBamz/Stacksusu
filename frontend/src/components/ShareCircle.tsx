import { memo, useState, useCallback } from 'react';
import { Share2, Copy, Check, Twitter, MessageCircle, Link2 } from 'lucide-react';
import clsx from 'clsx';
import { Button } from './Button';
import { Modal } from './Modal';
import './ShareCircle.css';

interface ShareCircleProps {
  /** Circle ID */
  circleId: number;
  /** Circle name for sharing */
  circleName: string;
  /** Optional additional class name */
  className?: string;
}

interface ShareOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: (url: string, text: string) => void;
}

/**
 * ShareCircle Component
 * 
 * Allows users to share a circle via native share API,
 * social media, or by copying the link.
 */
const ShareCircle = memo(function ShareCircle({
  circleId,
  circleName,
  className
}: ShareCircleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/circle/${circleId}`;
  const shareText = `Join "${circleName}" on StackSUSU - a decentralized savings circle!`;

  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setCopied(false);
  }, []);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  }, [shareUrl]);

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: circleName,
          text: shareText,
          url: shareUrl,
        });
        handleClose();
      } catch (err) {
        // User cancelled or share failed
        if ((err as Error).name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    }
  }, [circleName, shareText, shareUrl, handleClose]);

  const shareOptions: ShareOption[] = [
    {
      id: 'twitter',
      label: 'Twitter',
      icon: <Twitter size={20} />,
      action: (url, text) => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
          '_blank',
          'noopener,noreferrer'
        );
      },
    },
    {
      id: 'discord',
      label: 'Discord',
      icon: <MessageCircle size={20} />,
      action: (url, text) => {
        // Copy formatted message for Discord
        navigator.clipboard.writeText(`${text}\n${url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
    },
  ];

  const supportsNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={supportsNativeShare ? handleNativeShare : handleOpen}
        leftIcon={<Share2 size={16} />}
        className={clsx('share-circle__trigger', className)}
      >
        Share
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Share Circle"
        size="sm"
      >
        <div className="share-circle__content">
          <p className="share-circle__description">
            Invite friends to join <strong>{circleName}</strong>
          </p>

          <div className="share-circle__link-box">
            <Link2 size={16} className="share-circle__link-icon" />
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="share-circle__link-input"
            />
            <Button
              variant={copied ? 'success' : 'secondary'}
              size="sm"
              onClick={handleCopyLink}
              leftIcon={copied ? <Check size={16} /> : <Copy size={16} />}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>

          <div className="share-circle__divider">
            <span>or share via</span>
          </div>

          <div className="share-circle__options">
            {shareOptions.map((option) => (
              <button
                key={option.id}
                className="share-circle__option"
                onClick={() => option.action(shareUrl, shareText)}
              >
                {option.icon}
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
});

export { ShareCircle };
export default ShareCircle;
