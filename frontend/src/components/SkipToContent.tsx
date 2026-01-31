import { memo, useCallback, KeyboardEvent } from 'react';
import './SkipToContent.css';

interface SkipToContentProps {
  /** ID of the main content element to skip to */
  targetId?: string;
  /** Custom label for the skip link */
  label?: string;
}

/**
 * SkipToContent Component
 * 
 * Accessibility feature that allows keyboard users to skip directly 
 * to the main content, bypassing navigation and header elements.
 * The link is only visible when focused.
 */
const SkipToContent = memo(function SkipToContent({
  targetId = 'main-content',
  label = 'Skip to main content'
}: SkipToContentProps) {
  const handleClick = useCallback(() => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }, [targetId]);

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLAnchorElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  return (
    <a
      href={`#${targetId}`}
      className="skip-to-content"
      onClick={(e) => {
        e.preventDefault();
        handleClick();
      }}
      onKeyDown={handleKeyDown}
    >
      {label}
    </a>
  );
});

export { SkipToContent };
export default SkipToContent;
