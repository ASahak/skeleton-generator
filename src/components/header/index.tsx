import { FC, memo } from 'react';
import {
	Box,
	Button,
	Flex,
	HStack,
	Icon,
	useColorMode,
} from '@chakra-ui/react';
import {
	RiListSettingsLine,
	RiMoonLine,
	RiSunLine,
	RiCodeSSlashFill,
} from 'react-icons/ri';
import { RxShadow } from 'react-icons/rx';
import { useRecoilState, useRecoilValue } from 'recoil';
import { ROOT_KEY } from 'react-skeleton-builder';
import { useThemeColors } from '@/hooks';
import {
	gridState,
	highlightedNodeState,
	optionsPanelIsOpenState,
} from '@/store/atoms/global';
import { HighlightedNode } from '@/components/header/highlighted-node';
import { generateDefaultValues } from '@/utils/helpers';
import { MODALS_KEYS, useModal } from '@/providers/custom-modal';
import { Devices } from './devices';
import { DeviceResize } from '@/assets/chakra-icons';
import { selectAdaptiveDeviceEnabledState } from '@/store/selectors/global';

export const Header: FC = memo(() => {
	const { setModal } = useModal();
	const { colorMode, toggleColorMode } = useColorMode();
	const { white_dark700, gray100_dark400 } = useThemeColors();
	const [getGridState, setGridState] = useRecoilState(gridState);
	const [, setOptionsPanelIsOpen] = useRecoilState(optionsPanelIsOpenState);
	const [, setHighlightedNode] = useRecoilState(highlightedNodeState);
	const adaptiveDeviceEnabled = useRecoilValue(
		selectAdaptiveDeviceEnabledState
	);
	const ableToPreview = Object.keys(getGridState).length > 0;

	const onCreateRootTemplate = () => {
		setGridState({
			[ROOT_KEY]: { ...generateDefaultValues() },
		});
		setHighlightedNode(ROOT_KEY);
	};

	const onOpenGetCodeModal = () => {
		setModal({
			key: MODALS_KEYS.GET_CODE,
			props: {},
		});
	};

	const onPreview = () => {};

	const openBreakpointsModal = () => {
		setModal({
			key: MODALS_KEYS.BREAKPOINTS,
			props: {},
		});
	};

	const onOpenSkeletonThemeModal = () => {
		setModal({
			key: MODALS_KEYS.SKELETON_THEME,
			props: {},
		});
	};

	return (
		<Box
			as="header"
			w="full"
			h="7.8rem"
			display="flex"
			alignItems="center"
			px={{ base: 2, sm: 8 }}
			bgColor={white_dark700}
			borderBottom="1px solid"
			borderColor={gray100_dark400}
			position="relative"
			gap={{ base: 8, md: 4 }}
		>
			<HStack justifyContent="space-between" w="full">
				<Flex alignItems="center" gap={4} flex={1}>
					<Button
						variant="base"
						onClick={ableToPreview ? onPreview : onCreateRootTemplate}
					>
						{ableToPreview ? 'Preview' : 'Create Root'}
					</Button>
					{ableToPreview ? (
						<>
							<Button
								variant="menu-outline"
								px={4}
								gap={2}
								fontSize="1.3rem"
								onClick={onOpenGetCodeModal}
							>
								Get code <Icon fontSize="1.5rem" as={RiCodeSSlashFill} />
							</Button>
							<HighlightedNode />
						</>
					) : null}
				</Flex>
				{ableToPreview && adaptiveDeviceEnabled ? <Devices /> : null}
				<Flex alignItems="center" gap={6} flex={1} justifyContent="end">
					<Button
						alignItems="center"
						display="flex"
						p={0}
						variant="unstyled"
						onClick={onOpenSkeletonThemeModal}
					>
						<Icon as={RxShadow} fontSize="4xl" />
					</Button>
					{ableToPreview ? (
						<>
							<Button
								alignItems="center"
								display="flex"
								p={0}
								variant="unstyled"
								onClick={openBreakpointsModal}
							>
								<Icon as={DeviceResize} fontSize="4xl" />
							</Button>
							<Button
								alignItems="center"
								display="flex"
								p={0}
								variant="unstyled"
								onClick={() => setOptionsPanelIsOpen(true)}
							>
								<Icon as={RiListSettingsLine} fontSize="4xl" />
							</Button>
						</>
					) : null}
					<Button
						variant="unstyled"
						alignItems="center"
						display="flex"
						p={0}
						onClick={toggleColorMode}
					>
						<Icon
							fontSize="3xl"
							as={colorMode === 'dark' ? RiMoonLine : RiSunLine}
						/>
					</Button>
				</Flex>
			</HStack>
		</Box>
	);
});
