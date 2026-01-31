import { memo, useCallback } from 'react';
import { Star } from 'lucide-react';
import clsx from 'clsx';
import { useFavoriteCircles } from '../hooks/useFavoriteCircles';
import './FavoriteButton.css';

interface FavoriteButtonProps {
  /** Circle ID to favorite */
  circleId: number;
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg';
  /** Show label text */
  showLabel?: boolean;
  /** Optional class name */
  className?: string;
}

const SIZES = {
  sm: 16,
  md: 20,
  lg: 24,
};

/**
 * FavoriteButton Component
 * 
 * A button to favorite/unfavorite a circle.
 * State persists via localStorage.
 */
const FavoriteButton = memo(function FavoriteButton({
  circleId,
  size = 'md',
  showLabel = false,
  className
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavoriteCircles();
  const favorited = isFavorite(circleId);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(circleId);
  }, [circleId, toggleFavorite]);

  return (
    <button
      className={clsx(
        'favorite-button',
        `favorite-button--${size}`,
        favorited && 'favorite-button--active',
        className
      )}
      onClick={handleClick}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={favorited}
      title={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Star 
        size={SIZES[size]} 
        className="favorite-button__icon"
        fill={favorited ? 'currentColor' : 'none'}
      />
      {showLabel && (
        <span className="favorite-button__label">
          {favorited ? 'Favorited' : 'Favorite'}
        </span>
      )}
    </button>
  );
});

export { FavoriteButton };
export default FavoriteButton;
