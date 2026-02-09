/**
 * Banner notification manager
 */

type BannerType = 'info' | 'success' | 'warning' | 'error';

interface Banner {
  id: string;
  type: BannerType;
  message: string;
  title?: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

type BannerListener = (banners: Banner[]) => void;

class BannerManager {
  private banners: Banner[] = [];
  private listeners: Set<BannerListener> = new Set();

  getBanners(): Banner[] {
    return [...this.banners];
  }

  show(banner: Omit<Banner, 'id'>): string {
    const id = `banner-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const newBanner: Banner = { ...banner, id };
    this.banners = [...this.banners, newBanner];
    this.notify();
    
    if (banner.duration && !banner.persistent) {
      setTimeout(() => this.dismiss(id), banner.duration);
    }
    
    return id;
  }

  dismiss(id: string): void {
    this.banners = this.banners.filter(b => b.id !== id);
    this.notify();
  }

  dismissAll(): void {
    this.banners = [];
    this.notify();
  }

  info(message: string, title?: string, duration?: number): string {
    return this.show({ type: 'info', message, title, duration });
  }

  success(message: string, title?: string, duration?: number): string {
    return this.show({ type: 'success', message, title, duration });
  }

  warning(message: string, title?: string, duration?: number): string {
    return this.show({ type: 'warning', message, title, duration });
  }

  error(message: string, title?: string, duration?: number): string {
    return this.show({ type: 'error', message, title, duration });
  }

  subscribe(listener: BannerListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(listener => listener(this.getBanners()));
  }
}

export const bannerManager = new BannerManager();

export function useBanner() {
  return {
    banners: bannerManager.getBanners(),
    show: (banner: Omit<Banner, 'id'>) => bannerManager.show(banner),
    dismiss: (id: string) => bannerManager.dismiss(id),
    dismissAll: () => bannerManager.dismissAll(),
    info: (msg: string, title?: string, d?: number) => bannerManager.info(msg, title, d),
    success: (msg: string, title?: string, d?: number) => bannerManager.success(msg, title, d),
    warning: (msg: string, title?: string, d?: number) => bannerManager.warning(msg, title, d),
    error: (msg: string, title?: string, d?: number) => bannerManager.error(msg, title, d),
  };
}
