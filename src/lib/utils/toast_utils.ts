import toast from 'svelte-5-french-toast';

export const sendErrorToast = (title: string, message: string) => {
	toast.error(`${title} - ${message}`, {
		duration: 5000,
		position: 'top-right',
		className: 'dark-toast'
	});
};

export const sendSuccessToast = (title: string, message: string) => {
	toast.success(`${title} - ${message}`, {
		duration: 5000,
		position: 'top-right',
		className: 'dark-toast'
	});
};
