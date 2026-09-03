export type ToastType = 'success' | 'info' | 'cart' | 'warning' | 'error';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type?: ToastType;
  image?: string;
}

export type ModalType = 'search' | 'cart' | 'size-guide' | 'quick-view' | 'mobile-menu' | null;
