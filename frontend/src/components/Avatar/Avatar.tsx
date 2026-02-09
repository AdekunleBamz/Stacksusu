import React from 'react';
import './Avatar.css';

export interface AvatarProps {
  /** Image source */
  src?: string;
  /** Alt text for image */
  alt?: string;
  /** Fallback text (initials) */
  fallback?: string;
  /** Size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  /** Status indicator */
  status?: 'online' | 'offline' | 'busy' | 'away';
  /** Whether to show border */
  bordered?: boolean;
  /** Shape */
  shape?: 'circle' | 'square' | 'rounded';
  /** Custom class name */
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  fallback,
  size = 'md',
  status,
  bordered = false,
  shape = 'circle',
  className = '',
}) => {
  const initials = fallback || alt?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className={`avatar ${size} ${shape} ${bordered ? 'bordered' : ''} ${className}`}>
      {src ? (
        <img src={src} alt={alt || 'Avatar'} />
      ) : (
        <div className="avatar-fallback">{initials}</div>
      )}
      
      {status && (
        <span className={`avatar-status ${status}`} aria-label={`Status: ${status}`} />
      )}
    </div>
  );
};

/**
 * Avatar group for multiple avatars
 */
export interface AvatarGroupProps {
  /** Avatars to display */
  avatars: {
    src?: string;
    alt?: string;
    fallback?: string;
  }[];
  /** Maximum avatars to show */
  max?: number;
  /** Size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Custom class name */
  className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  max = 5,
  size = 'md',
  className = '',
}) => {
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <div className={`avatar-group ${className}`}>
      {visibleAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          src={avatar.src}
          alt={avatar.alt}
          fallback={avatar.fallback}
          size={size}
          bordered
        />
      ))}
      
      {remainingCount > 0 && (
        <Avatar
          fallback={`+${remainingCount}`}
          size={size}
          bordered
        />
      )}
    </div>
  );
};

export default Avatar;
