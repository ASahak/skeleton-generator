import { useContext, useMemo, useState } from 'react';
import {
	Box,
	Button,
	Flex,
	Tab,
	TabIndicator,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Fade,
} from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { ToastContext } from '@/contexts/toast';
import { useThemeColors } from '@/hooks';
import { colorThemeState } from '@/store/atoms/global';
import { selectBreakpointsState } from '@/store/selectors/global';

const TABS = [
	{ value: 'global-configs', label: 'Global configurations' },
	{ value: 'grid-structure', label: 'Grid structure' },
];

export const GetCode = () => {
	const { onToast } = useContext(ToastContext);
	const [tabIndex, setTabIndex] = useState(0);
	const { gray100_dark400, white_dark550 } = useThemeColors();
	const colorThemes = useRecoilValue(colorThemeState);
	const breakpoints = useRecoilValue(selectBreakpointsState);

	const generateGlobalConfigs = useMemo(() => {
		const value = JSON.stringify(
			{
				colorTheme: colorThemes,
				breakpoints,
			},
			null,
			'  '
		);

		return `<ReactSkeletonProvider 
  value={${value}}
>
  {children}
</ReactSkeletonProvider>
`;
	}, [colorThemes, breakpoints]);

	const generateGridStructure = useMemo(() => {
		const value = JSON.stringify(
			{
				colorTheme: colorThemes,
			},
			null,
			'  '
		);

		return `<ReactSkeletonProvider 
  value={${value}}
>
  {children}
</ReactSkeletonProvider>
`;
	}, [colorThemes]);

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
						</Fade>
					</TabPanel>
				</TabPanels>
			</Tabs>
			<Flex justifyContent="flex-end" mt={8} gap={3}>
				<Button variant="base" size="sm" onClick={onCopy}>
					Copy
				</Button>
			</Flex>
		</Box>
	);
};
