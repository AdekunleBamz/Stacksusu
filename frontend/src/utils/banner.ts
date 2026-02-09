/**
 * Banner Utilities
 * Functions for creating and managing banner notifications
 */

export interface BannerOptions {
  /** Banner message */
  message: string;
  /** Banner type */
  type?: 'info' | 'success' | 'warning' | 'error';
  /** Duration in ms (0 = persistent) */
  duration?: number;
  /** Whether to show dismiss button */
  dismissible?: boolean;
  /** Custom action callback */
  action?: {
    label: string;
    onClick: () => void;
  };
}

class BannerManager {
  private banners: BannerOptions[] = [];
  private listeners: ((banners: BannerOptions[]) => void)[] = [];

  getBanners(): BannerOptions[] {
    return [...this.banners];
  }

  add(options: BannerOptions): void {
    const banner = {
      type: 'info' as const,
      duration: 5000,
      dismissible: true,
      ...options,
    };

    this.banners.push(banner);
    this.notifyListeners();

    if (banner.duration > 0) {
      setTimeout(() => {
        this.remove(banner);
      }, banner.duration);
    }
  }

  remove(banner: BannerOptions): void {
    const index = this.banners.indexOf(banner);
    if (index > -1) {
      this.banners.splice(index, 1);
      this.notifyListeners();
    }
  }

  clear(): void {
    this.banners = [];
    this.notifyListeners();
  }

  info(message: string, options?: Partial<BannerOptions>): void {
    this.add({ message, type: 'info', ...options });
  }

  success(message: string, options?: Partial<BannerOptions>): void {
    this.add({ message, type: 'success', ...options });
  }

  warning(message: string, options?: Partial<BannerOptions>): void {
    this.add({ message, type: 'warning', ...options });
  }

  error(message: string, options?: Partial<BannerOptions>): void {
    this.add({ message, type: 'error', ...options });
  }

  subscribe(listener: (banners: BannerOptions[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.banners));
  }
}

export const bannerManager = new BannerManager();

export default bannerManager;
