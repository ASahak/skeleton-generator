import { ReactNode } from 'react';
import { useToast } from '@chakra-ui/react';
import { ToastContext } from '@/contexts/toast';

export const Toast = ({ children }: { children: ReactNode }) => {
	const toast = useToast();

	const onToast = ({ status, description, title }: any) => {
		toast({
			title,
			description,
			status,
		});
	};

	return (
		<ToastContext.Provider
			value={{
				onToast,
			}}
		>
			{children}
		</ToastContext.Provider>
	);
};
