import { toast } from 'svelte-sonner';

// Helper functions for toast notifications
export const showSuccessToast = (title: string, description?: string) => {
  toast.success(title, {
    description,
    duration: 4000,
  });
};

export const showErrorToast = (title: string, description?: string) => {
  toast.error(title, {
    description,
    duration: 6000,
  });
};

export const showInfoToast = (title: string, description?: string) => {
  toast.info(title, {
    description,
    duration: 4000,
  });
};

export const showLoadingToast = (title: string, description?: string) => {
  return toast.loading(title, {
    description,
  });
};

export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};
