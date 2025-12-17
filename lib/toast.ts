import { toast } from 'sonner';

export const showSuccessToast = (message: string) => {
    toast.success(message, {
        duration: 3000,
        position: 'top-right',
    });
};

export const showErrorToast = (message: string) => {
    toast.error(message, {
        duration: 4000,
        position: 'top-right',
    });
};

export const showLoadingToast = (message: string) => {
    return toast.loading(message, {
        position: 'top-right',
    });
};

export const dismissToast = (toastId: string | number) => {
    toast.dismiss(toastId);
};

export const showInfoToast = (message: string) => {
    toast.info(message, {
        duration: 3000,
        position: 'top-right',
    });
};
