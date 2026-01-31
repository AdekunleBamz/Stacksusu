import { memo, useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import clsx from 'clsx';
import './NetworkStatus.css';

interface NetworkStatusProps {
  /** Show indicator only when offline */
  offlineOnly?: boolean;
  /** Position of the indicator */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'inline';
  /** Show reconnecting animation */
  showReconnecting?: boolean;
  /** Custom offline message */
  offlineMessage?: string;
  /** Custom online message */
  onlineMessage?: string;
  /** Additional class name */
  className?: string;
}

/**
 * NetworkStatus Component
 * 
 * Displays the current network connectivity status.
 * Shows a notification when the user goes offline and
 * optionally when they come back online.
 */
const NetworkStatus = memo(function NetworkStatus({
  offlineOnly = true,
  position = 'inline',
  showReconnecting = true,
  offlineMessage = "You're offline",
  onlineMessage = "Back online",
  className
}: NetworkStatusProps) {
  const [isOnline, setIsOnline] = useState(
    typeof window !== 'undefined' ? navigator.onLine : true
  );
  const [showOnlineToast, setShowOnlineToast] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        setShowOnlineToast(true);
        setTimeout(() => setShowOnlineToast(false), 3000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  // Don't render anything if online and offlineOnly is true
  if (offlineOnly && isOnline && !showOnlineToast) {
    return null;
  }

  const isFixed = position !== 'inline';

  return (
    <div
      className={clsx(
        'network-status',
        isFixed && `network-status--${position}`,
        isOnline ? 'network-status--online' : 'network-status--offline',
        showOnlineToast && 'network-status--toast',
        className
      )}
      role="status"
      aria-live="polite"
    >
      <span className={clsx(
        'network-status__dot',
        !isOnline && showReconnecting && 'network-status__dot--pulse'
      )} />
      
      {isOnline ? (
        <>
          <Wifi size={16} className="network-status__icon" />
          <span className="network-status__text">{onlineMessage}</span>
        </>
      ) : (
        <>
          <WifiOff size={16} className="network-status__icon" />
          <span className="network-status__text">{offlineMessage}</span>
        </>
      )}
    </div>
  );
});

export { NetworkStatus };
export default NetworkStatus;
