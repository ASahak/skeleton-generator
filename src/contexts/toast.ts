import { createContext } from 'react';

export const ToastContext = createContext({
	/* eslint-disable @typescript-eslint/no-unused-vars */
	onToast: ({
		title,
		description,
		status,
	}: {
		title?: string;
		description?: string;
		status: string;
	}): void => void 0,
});
