import { useState } from 'react';
import cloneDeep from 'clone-deep';
import { useRecoilState } from 'recoil';
import {
	Box,
	Button,
	Flex,
	Heading,
	Icon,
	Input,
	InputGroup,
	InputLeftAddon,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	useColorMode,
	VStack,
} from '@chakra-ui/react';
import { RxTriangleDown } from 'react-icons/rx';
import { useModal } from '@/providers/custom-modal';
import { useThemeColors } from '@/hooks';
import { COLOR_MODE } from '@/common/enums';
import { colorThemeState } from '@/store/atoms/global';

const OPTIONS: { label: string; value: string }[] = [
	{ label: 'Slide', value: 'slide' },
	{ label: 'Fade', value: 'fade' },
];
const THEMES = [
	{ value: 'light', label: 'Light' },
	{ value: 'dark', label: 'Dark' },
];
export const SkeletonTheme = () => {
	const { onClose } = useModal();
	const { colorMode } = useColorMode();
	const [selectedVariant, setSelectedVariant] = useState<{
		label: string;
		value: string;
	}>(OPTIONS[0]);
	const [selectedTheme, setSelectedTheme] = useState<{
		label: string;
		value: string;
	}>(THEMES[colorMode === 'dark' ? 1 : 0]);
	const [colorThemes, setColorTheme] = useRecoilState(colorThemeState);
	const [themeLocalValue, setThemeLocalValue] = useState(colorThemes);
	const { white_dark650 } = useThemeColors();

	const onSelectVariant = (opt: { label: string; value: string }) => {
		setSelectedVariant(opt);
	};

	const onSelectTheme = (opt: { label: string; value: string }) => {
		setSelectedTheme(opt);
	};

	const onApply = () => {
		setColorTheme(themeLocalValue);
		onClose();
	};

	const onChangeThemeColors = (color: string, type: 'main' | 'gradient') => {
		setThemeLocalValue((prevState: any) => {
			const cloned = cloneDeep(prevState);
			cloned[selectedTheme.value as COLOR_MODE][type] = color;

			return cloned;
		});
	};

	return (
		<Box pt={8}>
			<Heading variant="medium-title" mb={4}>
				Skeleton&apos;s animation variant
			</Heading>
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
						{selectedVariant.label}
						<Icon as={RxTriangleDown} fontSize="1.8rem" />
					</Text>
				</MenuButton>
				<MenuList minW="20rem">
					<VStack spacing={2}>
						{OPTIONS.map((opt) => (
							<MenuItem
								key={opt.value}
								onClick={() => onSelectVariant(opt)}
								gap={2}
								{...(selectedVariant.value === opt.value && {
									bgColor: colorMode === 'dark' ? 'darcula.510' : 'gray.50',
								})}
							>
								{opt.label}
							</MenuItem>
						))}
					</VStack>
				</MenuList>
			</Menu>
			<Box>
				<Heading variant="medium-title" my={4}>
					Skeleton&apos;s theme
				</Heading>
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
							{selectedTheme.label}
							<Icon as={RxTriangleDown} fontSize="1.8rem" />
						</Text>
					</MenuButton>
					<MenuList minW="20rem">
						<VStack spacing={2}>
							{THEMES.map((opt) => (
								<MenuItem
									key={opt.value}
									onClick={() => onSelectTheme(opt)}
									gap={2}
									{...(selectedTheme.value === opt.value && {
										bgColor: colorMode === 'dark' ? 'darcula.510' : 'gray.50',
									})}
								>
									{opt.label}
								</MenuItem>
							))}
						</VStack>
					</MenuList>
				</Menu>
				<Heading variant="medium-title" my={4}>
					Main color
				</Heading>
				<InputGroup>
					<InputLeftAddon border="none" h="inherit" w="4rem" p={2}>
						<Input
							cursor="pointer"
							h="full"
							w="full"
							border="none"
							p={0}
							type="color"
							value={themeLocalValue[selectedTheme.value as COLOR_MODE].main}
							onChange={(e) => onChangeThemeColors(e.target.value, 'main')}
						/>
					</InputLeftAddon>
					<Input
						variant="base"
						type="text"
						opacity="1 !important"
						readOnly
						isDisabled
						value={themeLocalValue[selectedTheme.value as COLOR_MODE].main}
					/>
				</InputGroup>
			</Box>
			<br />
			<Box>
				<Heading variant="medium-title" mb={4}>
					Gradient color
				</Heading>
				<InputGroup>
					<InputLeftAddon border="none" h="inherit" w="4rem" p={2}>
						<Input
							h="full"
							w="full"
							border="none"
							cursor="pointer"
							p={0}
							type="color"
							value={
								themeLocalValue[selectedTheme.value as COLOR_MODE].gradient
							}
							onChange={(e) => onChangeThemeColors(e.target.value, 'gradient')}
						/>
					</InputLeftAddon>
					<Input
						variant="base"
						type="text"
						opacity="1 !important"
						readOnly
						isDisabled
						value={themeLocalValue[selectedTheme.value as COLOR_MODE].gradient}
					/>
				</InputGroup>
			</Box>
			<Flex justifyContent="flex-end" w="full" mt={8}>
				<Button variant="base" size="sm" onClick={onApply}>
					Save
				</Button>
			</Flex>
		</Box>
	);
};
