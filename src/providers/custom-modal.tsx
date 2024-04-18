import {
	FC,
	ReactNode,
	useContext,
	useState,
	createContext,
	SetStateAction,
	Dispatch,
	useEffect,
} from 'react';
import {
	Modal,
	ModalCloseButton,
	ModalContent,
	ModalOverlay,
	useDisclosure,
} from '@chakra-ui/react';
import { ConfirmDelete, FunctionUnitEditor } from '@/components/modals';
import { dispatchBus } from '@/hooks';
import { ON_CLOSE_MODAL } from '@/constants/event-bus-types';

type contextType = {
	isOpen: boolean;
	modal: { key: MODALS_KEYS; props: Record<string, any> } | null;
	setModal: Dispatch<
		SetStateAction<{ key: MODALS_KEYS; props: Record<string, any> } | null>
	>;
	onOpen: () => void;
	onClose: () => void;
};
const CustomModalContext = createContext<contextType>({
	isOpen: false,
	modal: null,
	onOpen: () => {},
	onClose: () => {},
	setModal: () => {},
});

export enum MODALS_KEYS {
	CONFIRM_DELETE = 'confirm-delete',
	FUNCTION_UNIT_EDITOR = 'function-unit-editor',
}

const MODALS: Record<MODALS_KEYS, FC<any>> = {
	[MODALS_KEYS.CONFIRM_DELETE]: ConfirmDelete,
	[MODALS_KEYS.FUNCTION_UNIT_EDITOR]: FunctionUnitEditor,
};
export const CustomModal = ({ children }: { children: ReactNode }) => {
	const [modal, setModal] = useState<{
		key: MODALS_KEYS;
		props: Record<string, any>;
	} | null>(null);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const renderModalContent = () => {
		if (modal) {
			const { key, props = {} } = modal;
			const ModalComponent = MODALS[key! as keyof typeof MODALS];
			return <ModalComponent {...(props as any)} />;
		}
		return null;
	};

	const onCloseMiddleware = () => {
		dispatchBus({ type: ON_CLOSE_MODAL });
		onClose();
	};

	useEffect(() => {
		if (modal) {
			onOpen();
		}
	}, [modal]);

	return (
		<CustomModalContext.Provider
			value={{ isOpen, modal, setModal, onOpen, onClose }}
		>
			{children}
			<Modal
				isCentered
				isOpen={isOpen}
				onClose={onCloseMiddleware}
				variant="base"
			>
				<ModalOverlay />
				<ModalContent pt={10} pb={6} px={6} minW="3xl">
					<ModalCloseButton fontSize="1rem" mt={1} />
					{renderModalContent()}
				</ModalContent>
			</Modal>
		</CustomModalContext.Provider>
	);
};

export const useModal = (): contextType => useContext(CustomModalContext);
