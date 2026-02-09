/**
 * DOM utilities
 */

/**
 * Get element by ID
 */
export function getElementById<T extends HTMLElement = HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

/**
 * Get elements by class name
 */
export function getElementsByClassName<T extends HTMLElement = HTMLElement>(
  className: string
): T[] {
  return Array.from(document.getElementsByClassName(className)) as T[];
}

/**
 * Get elements by tag name
 */
export function getElementsByTagName<T extends HTMLElement = HTMLElement>(
  tagName: string
): T[] {
  return Array.from(document.getElementsByTagName(tagName)) as T[];
}

/**
 * Query selector single
 */
export function querySelector<T extends HTMLElement = HTMLElement>(
  selector: string
): T | null {
  return document.querySelector(selector) as T | null;
}

/**
 * Query selector all
 */
export function querySelectorAll<T extends HTMLElement = HTMLElement>(
  selector: string
): T[] {
  return Array.from(document.querySelectorAll(selector)) as T[];
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= window.innerHeight &&
    rect.right <= window.innerWidth
  );
}

/**
 * Get element's scroll position
 */
export function getScrollPosition(element: HTMLElement): { x: number; y: number } {
  return {
    x: element.scrollLeft,
    y: element.scrollTop,
  };
}

/**
 * Set element's scroll position
 */
export function setScrollPosition(element: HTMLElement, x: number, y: number): void {
  element.scrollLeft = x;
  element.scrollTop = y;
}

/**
 * Smooth scroll to element
 */
export function scrollToElement(element: HTMLElement, offset = 0): void {
  const top = element.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

/**
 * Get document height
 */
export function getDocumentHeight(): number {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight
  );
}

/**
 * Get viewport dimensions
 */
export function getViewportSize(): { width: number; height: number } {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
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
 * Debounced resize observer
 */
export function onResize(callback: () => void, delay = 200): () => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  const handleResize = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(callback, delay);
  };

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}

/**
 * Focus trap for modals
 */
export function createFocusTrap(element: HTMLElement): () => void {
  const focusableElements = querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    }
  };

  element.addEventListener('keydown', handleKeyDown);
  firstFocusable?.focus();

  return () => element.removeEventListener('keydown', handleKeyDown);
}
