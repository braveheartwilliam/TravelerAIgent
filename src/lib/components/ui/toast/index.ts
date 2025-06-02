import { writable } from 'svelte/store';

export type ToastVariant = 'default' | 'destructive' | 'success';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
}

const createToastStore = () => {
  const { subscribe, update } = writable<ToastStore>({ toasts: [] });

  const add = (toast: Omit<Toast, 'id'>) => {
    const id = crypto.randomUUID();
    update((state) => {
      const newToast = {
        id,
        title: toast.title,
        description: toast.description,
        variant: toast.variant || 'default',
        duration: toast.duration || 5000,
      };
      return {
        toasts: [...state.toasts, newToast],
      };
    });

    // Auto-dismiss toast after duration
    if (toast.duration !== Infinity) {
      setTimeout(() => {
        dismiss(id);
      }, toast.duration || 5000);
    }

    return id;
  };

  const dismiss = (id: string) => {
    update((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  };

  const dismissAll = () => {
    update(() => ({ toasts: [] }));
  };

  return {
    subscribe,
    add,
    dismiss,
    dismissAll,
  };
};

export const toasts = createToastStore();

export const toast = (toast: Omit<Toast, 'id'>) => {
  return toasts.add(toast);
};
