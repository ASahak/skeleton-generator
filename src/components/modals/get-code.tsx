import { useContext, useMemo, useState } from 'react';
import {
	Box,
	Button,
	Flex,
	Tab,
	Text,
	TabIndicator,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Fade,
} from '@chakra-ui/react';
import stringify from 'json-stringify-pretty-compact';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useRecoilValue } from 'recoil';
import {
	ROOT_KEY,
	parseStyleObject,
	cssToReactStyle,
} from 'react-skeleton-builder';
import { ToastContext } from '@/contexts/toast';
import { useThemeColors } from '@/hooks';
import { colorThemeState } from '@/store/atoms/global';
import {
	selectAdaptiveDeviceEnabledState,
	selectBreakpointsState,
	selectGridState,
	selectRootStylesState,
	selectSkeletonAnimationState,
	selectSkeletonsState,
} from '@/store/selectors/global';
import { filterQuotes, getGridStructure } from '@/utils/helpers';

const TABS = [
	{ value: 'global-configs', label: 'Global configurations' },
	{ value: 'grid-structure', label: 'Grid structure' },
];

export const GetCode = () => {
	const { onToast } = useContext(ToastContext);
	const gridState = useRecoilValue(selectGridState);
	const skeletonsState = useRecoilValue(selectSkeletonsState);
	const skeletonAnimation = useRecoilValue(selectSkeletonAnimationState);
	const rootStyles = useRecoilValue(selectRootStylesState);
	const [tabIndex, setTabIndex] = useState(0);
	const { gray100_dark400, white_dark550 } = useThemeColors();
	const colorThemes = useRecoilValue(colorThemeState);
	const breakpoints = useRecoilValue(selectBreakpointsState);
	const adaptiveDeviceEnabled = useRecoilValue(
		selectAdaptiveDeviceEnabledState
	);

	const generateGlobalConfigs = useMemo(() => {
		const value = stringify({
			skeletonAnimation,
			colorTheme: colorThemes,
			breakpoints,
		});

		return `import { ReactSkeletonProvider } from 'react-skeleton-builder';

<ReactSkeletonProvider 
  value={${filterQuotes(value)}}
>
  {children}
</ReactSkeletonProvider>
`;
	}, [colorThemes, breakpoints, skeletonAnimation]);

	const generateGridStructure = useMemo(() => {
		console.log(gridState, skeletonsState);
		const styles = parseStyleObject(rootStyles);
		let styleObj = {};
		if (styles) {
			styleObj = cssToReactStyle(styles);
		}

		const value = stringify({
			...getGridStructure(
				gridState[ROOT_KEY],
				gridState,
				skeletonsState,
				adaptiveDeviceEnabled
			),
		});

		return `<Skeleton 
  styles={${filterQuotes(stringify(styleObj))}}
  grid={${filterQuotes(value)}}
/>
`;
	}, [gridState, skeletonsState, rootStyles]);

	const onCopy = () => {
		onToast({
			description: 'Copied!',
			status: 'success',
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
						<Fade in={tabIndex === 0}>
							<Box
								border="1px solid"
								as="pre"
								maxH="30rem"
								overflowX="hidden"
								fontSize="1.2rem"
								className="custom-scrollbar-content"
								sx={{
									'&::-webkit-scrollbar-track': {
										backgroundColor: gray100_dark400,
									},
								}}
								p={4}
								borderRadius="md"
								borderColor={gray100_dark400}
								bgColor={white_dark550}
								boxShadow="none"
								outline="0"
								transition="box-shadow .3s"
								_focus={{
									boxShadow: '0px 0px 1px 1px var(--chakra-colors-brand-500)',
								}}
							>
								{generateGlobalConfigs}
							</Box>
						</Fade>
					</TabPanel>
					<TabPanel p={0}>
						<Fade in={tabIndex === 1}>
							<Box
								border="1px solid"
								as="pre"
								maxH="30rem"
								overflowX="hidden"
								fontSize="1.2rem"
								className="custom-scrollbar-content"
								sx={{
									'&::-webkit-scrollbar-track': {
										backgroundColor: gray100_dark400,
									},
								}}
								p={4}
								borderRadius="md"
								borderColor={gray100_dark400}
								bgColor={white_dark550}
								boxShadow="none"
								outline="0"
								transition="box-shadow .3s"
								_focus={{
									boxShadow: '0px 0px 1px 1px var(--chakra-colors-brand-500)',
								}}
							>
								{generateGridStructure}
							</Box>
							<Text color="gray.200" mt={2}>
								Note: If the object is empty it means you haven&apos;t made any
								and it will apply the default style for each of property
							</Text>
						</Fade>
					</TabPanel>
				</TabPanels>
			</Tabs>
			<Flex justifyContent="flex-end" mt={8} gap={3}>
				<CopyToClipboard
					text={tabIndex === 0 ? generateGlobalConfigs : generateGridStructure}
					onCopy={onCopy}
				>
					<Button variant="base" size="sm">
						Copy
					</Button>
				</CopyToClipboard>
			</Flex>
		</Box>
	);
};
