import { memo, useState, useEffect, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';
import clsx from 'clsx';
import './ScrollToTop.css';

interface ScrollToTopProps {
  /** Scroll threshold to show the button (in pixels) */
  threshold?: number;
  /** Smooth scroll behavior */
  smooth?: boolean;
  /** Position on screen */
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  /** Show scroll progress indicator */
  showProgress?: boolean;
  /** Additional class name */
  className?: string;
}

/**
 * ScrollToTop Component
 * 
 * A floating button that appears when the user scrolls down
 * and scrolls the page back to the top when clicked.
 */
const ScrollToTop = memo(function ScrollToTop({
  threshold = 300,
  smooth = true,
  position = 'bottom-right',
  showProgress = false,
  className
}: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > threshold);

      if (showProgress) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
        setScrollProgress(Math.min(progress, 100));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold, showProgress]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'auto'
    });
  }, [smooth]);

  if (!isVisible) return null;

  return (
    <button
      className={clsx(
        'scroll-to-top',
        `scroll-to-top--${position}`,
        showProgress && 'scroll-to-top--with-progress',
        className
      )}
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Scroll to top"
    >
      {showProgress && (
        <svg className="scroll-to-top__progress" viewBox="0 0 36 36">
          <circle
            className="scroll-to-top__progress-bg"
            cx="18"
            cy="18"
            r="16"
            fill="none"
            strokeWidth="2"
          />
          <circle
            className="scroll-to-top__progress-bar"
            cx="18"
            cy="18"
            r="16"
            fill="none"
            strokeWidth="2"
            strokeDasharray={`${scrollProgress}, 100`}
            transform="rotate(-90 18 18)"
          />
        </svg>
      )}
      <ArrowUp size={20} className="scroll-to-top__icon" />
    </button>
  );
});

export { ScrollToTop };
export default ScrollToTop;
