import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'stacksusu-favorite-circles';

interface UseFavoriteCirclesReturn {
  /** Array of favorite circle IDs */
  favorites: number[];
  /** Check if a circle is favorited */
  isFavorite: (circleId: number) => boolean;
  /** Toggle favorite status */
  toggleFavorite: (circleId: number) => void;
  /** Add a circle to favorites */
  addFavorite: (circleId: number) => void;
  /** Remove a circle from favorites */
  removeFavorite: (circleId: number) => void;
  /** Get count of favorites */
  count: number;
}

/**
 * Hook to manage favorite/bookmarked circles
 * 
 * @example
 * ```tsx
 * const { isFavorite, toggleFavorite } = useFavoriteCircles();
 * 
 * <button onClick={() => toggleFavorite(circleId)}>
 *   {isFavorite(circleId) ? 'Unfavorite' : 'Favorite'}
 * </button>
 * ```
 */
export function useFavoriteCircles(): UseFavoriteCirclesReturn {
  const [favorites, setFavorites] = useState<number[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (err) {
      console.error('Failed to save favorites:', err);
    }
  }, [favorites]);

  const isFavorite = useCallback(
    (circleId: number) => favorites.includes(circleId),
    [favorites]
  );

  const addFavorite = useCallback((circleId: number) => {
    setFavorites((prev) => {
      if (prev.includes(circleId)) return prev;
      return [...prev, circleId];
    });
  }, []);

  const removeFavorite = useCallback((circleId: number) => {
    setFavorites((prev) => prev.filter((id) => id !== circleId));
  }, []);

  const toggleFavorite = useCallback((circleId: number) => {
    setFavorites((prev) => {
      if (prev.includes(circleId)) {
        return prev.filter((id) => id !== circleId);
      }
      return [...prev, circleId];
    });
  }, []);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    count: favorites.length,
  };
}

export default useFavoriteCircles;
