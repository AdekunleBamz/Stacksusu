/**
 * DOM utilities
 */

/**
 * Check if element is in viewport
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Get element's position relative to viewport
 */
export function getViewportPosition(element: HTMLElement): {
  top: number;
  left: number;
  bottom: number;
  right: number;
} {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
    bottom: rect.bottom,
    right: rect.right,
  };
}

/**
 * Get element's offset from document
 */
export function getOffset(element: HTMLElement): { top: number; left: number } {
  const rect = element.getBoundingClientRect();
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft,
  };
}

/**
 * Scroll element into view
 */
export function scrollIntoView(
  element: HTMLElement,
  options?: ScrollIntoViewOptions
): void {
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    ...options,
  });
}

/**
 * Get scroll position
 */
export function getScrollPosition(): { x: number; y: number } {
  return {
    x: window.scrollX || document.documentElement.scrollLeft,
    y: window.scrollY || document.documentElement.scrollTop,
  };
}

/**
 * Set scroll position
 */
export function setScrollPosition(x: number, y: number): void {
  window.scrollTo(x, y);
}

/**
 * Get element's computed style
 */
export function getStyle(element: HTMLElement, property: string): string {
  return window.getComputedStyle(element).getPropertyValue(property);
}

/**
 * Add class to element
 */
export function addClass(element: HTMLElement, className: string): void {
  element.classList.add(className);
}

/**
 * Remove class from element
 */
export function removeClass(element: HTMLElement, className: string): void {
  element.classList.remove(className);
}

/**
 * Toggle class on element
 */
export function toggleClass(element: HTMLElement, className: string): void {
  element.classList.toggle(className);
}

/**
 * Check if element has class
 */
export function hasClass(element: HTMLElement, className: string): boolean {
  return element.classList.contains(className);
}

/**
 * Debounced scroll handler
 */
export function debounceScroll(
  callback: (position: { x: number; y: number }) => void,
  delay = 100
): () => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(getScrollPosition());
    }, delay);
  };
}

/**
 * Throttled scroll handler
 */
export function throttleScroll(
  callback: (position: { x: number; y: number }) => void,
  limit = 100
): () => void {
  let lastExecution = 0;
  return () => {
    const now = Date.now();
    if (now - lastExecution >= limit) {
      lastExecution = now;
      callback(getScrollPosition());
    }
  };
}
