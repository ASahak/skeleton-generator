import {
	Box,
	Button,
	Icon,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
} from '@chakra-ui/react';
import { RxTriangleDown } from 'react-icons/rx';
import { useModal } from '@/providers/custom-modal';
import { useState } from 'react';
import { useThemeColors } from '@/hooks';

const OPTIONS: { label: string; value: string }[] = [
	{ label: 'Slide', value: 'slide' },
	{ label: 'Fade', value: 'fade' },
];
export const SkeletonVariants = () => {
	const { onClose } = useModal();
	const [selected, setSelected] = useState<{ label: string; value: string }>(
		OPTIONS[0]
	);
	const { white_dark650 } = useThemeColors();

	const onSelect = (opt: { label: string; value: string }) => {
		setSelected(opt);
		console.log(onClose);
	};

	return (
		<Box py={8}>
			<Menu variant="base" placement="bottom-start" matchWidth>
				<MenuButton
					as={Button}
					px="1rem"
					w="full"
					variant="menu-outline"
					bgColor={white_dark650}
					gap={2}
				>
					<Text
						as="span"
						display="flex"
						justifyContent="space-between"
						alignItems="center"
					>
						{selected.label}
						<Icon as={RxTriangleDown} fontSize="1.8rem" />
					</Text>
				</MenuButton>
				<MenuList minW="20rem">
					{OPTIONS.map((opt) => (
						<MenuItem key={opt.value} onClick={() => onSelect(opt)} gap={2}>
							{opt.label}
						</MenuItem>
					))}
				</MenuList>
			</Menu>
		</Box>
	);
};
