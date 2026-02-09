import React from 'react';
import './Avatar.css';

export interface AvatarProps {
  /** Image source URL */
  src?: string;
  /** Alt text for image */
  alt?: string;
  /** Fallback text (initials) */
  fallback?: string;
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  /** Status indicator */
  status?: 'online' | 'offline' | 'busy' | 'away';
  /** Whether to show status */
  showStatus?: boolean;
  /** Badge content */
  badge?: React.ReactNode;
  /** Shape variant */
  shape?: 'circle' | 'square' | 'rounded';
  /** Custom class name */
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  fallback,
  size = 'md',
  status,
  showStatus = false,
  badge,
  shape = 'circle',
  className = '',
}) => {
  const getInitials = (text: string): string => {
    const parts = text.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return text.slice(0, 2).toUpperCase();
  };

  const statusColor = status ? `avatar-status ${status}` : '';

  return (
    <div className={`avatar-wrapper ${className}`} style={{ position: 'relative', display: 'inline-flex' }}>
      <div className={`avatar ${size} ${shape}`}>
        {src ? (
          <img src={src} alt={alt} className="avatar-image" />
        ) : (
          <div className="avatar-placeholder">
            {fallback ? getInitials(fallback) : '?'}
          </div>
        )}
        
        {showStatus && status && (
          <span className={`avatar-status ${status}`} style={{ position: 'absolute', bottom: 0, right: 0 }} />
        )}
        
        {badge && <span className="avatar-badge">{badge}</span>}
      </div>
    </div>
  );
};

export default Avatar;
