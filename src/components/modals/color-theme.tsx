import { useState } from 'react';
import {
	Box,
	Button,
	Flex,
	Heading,
	Input,
	InputGroup,
	InputLeftAddon,
	Tab,
	TabIndicator,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Fade,
	useColorMode,
} from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import cloneDeep from 'clone-deep';
import { COLOR_MODE } from '@/common/enums';
import { colorThemeState } from '@/store/atoms/global';
import { useModal } from '@/providers/custom-modal';

const TABS = [
	{ value: 'light', label: 'Light' },
	{ value: 'dark', label: 'Dark' },
];
const TabPanelComponent = ({
	index,
	tabIndex,
	changeColor,
	value,
}: {
	index: number;
	tabIndex: number;
	changeColor: (color: string, type: 'main' | 'gradient') => void;
	value: Record<'main' | 'gradient', string>;
}) => {
	return (
		<Fade in={tabIndex === index}>
			<Box>
				<Heading variant="medium-title" mb={4}>
					Main color
				</Heading>
				<InputGroup>
					<InputLeftAddon h="inherit" w="4rem" p={2}>
						<Input
							h="full"
							w="full"
							p={0}
							type="color"
							value={value.main}
							onChange={(e) => changeColor(e.target.value, 'main')}
						/>
					</InputLeftAddon>
					<Input
						variant="base"
						type="text"
						opacity="1 !important"
						readOnly
						isDisabled
						value={value.main}
					/>
				</InputGroup>
			</Box>
			<br />
			<Box>
				<Heading variant="medium-title" mb={4}>
					Gradient color
				</Heading>
				<InputGroup>
					<InputLeftAddon h="inherit" w="4rem" p={2}>
						<Input
							h="full"
							w="full"
							p={0}
							type="color"
							value={value.gradient}
							onChange={(e) => changeColor(e.target.value, 'gradient')}
						/>
					</InputLeftAddon>
					<Input
						variant="base"
						type="text"
						opacity="1 !important"
						readOnly
						isDisabled
						value={value.gradient}
					/>
				</InputGroup>
			</Box>
		</Fade>
	);
};
export const ColorTheme = () => {
	const { onClose } = useModal();
	const { colorMode } = useColorMode();
	const [tabIndex, setTabIndex] = useState(colorMode === 'dark' ? 1 : 0);
	const [colorThemes, setColorTheme] = useRecoilState(colorThemeState);
	const [localValue, setLocalValue] = useState(colorThemes);

	const onApply = () => {
		setColorTheme(localValue);
		onClose();
	};

	const changeColor = (color: string, type: 'main' | 'gradient') => {
		setLocalValue((prevState: any) => {
			const cloned = cloneDeep(prevState);
			cloned[TABS[tabIndex].value as COLOR_MODE][type] = color;

			return cloned;
		});
	};

	return (
		<Box>
			<Tabs
				position="relative"
				variant="unstyled"
				defaultIndex={tabIndex}
				onChange={(index) => setTabIndex(index)}
			>
				<TabList>
					{TABS.map((tab) => (
						<Tab key={tab.value} fontSize="1.4rem">
							{tab.label}
						</Tab>
					))}
				</TabList>
				<TabIndicator
					mt="-1.5px"
					height="2px"
					bg="brand.500"
					borderRadius="1px"
				/>
				<TabPanels pt={8}>
					<TabPanel p={0}>
						<TabPanelComponent
							value={localValue[TABS[tabIndex].value as COLOR_MODE]}
							changeColor={changeColor}
							index={0}
							tabIndex={tabIndex}
						/>
					</TabPanel>
					<TabPanel p={0}>
						<TabPanelComponent
							value={localValue[TABS[tabIndex].value as COLOR_MODE]}
							changeColor={changeColor}
							index={1}
							tabIndex={tabIndex}
						/>
					</TabPanel>
				</TabPanels>
			</Tabs>
			<Flex justifyContent="flex-end" mt={8} gap={3}>
				<Button variant="base" size="sm" onClick={onApply}>
					Apply
				</Button>
			</Flex>
		</Box>
	);
};
