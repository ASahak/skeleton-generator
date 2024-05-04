import { useState } from 'react';
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

const TABS = [
	{ value: 'global-configs', label: 'Global configurations' },
	{ value: 'grid-structure', label: 'Grid structure' },
];
export const GetCode = () => {
	const [tabIndex, setTabIndex] = useState(0);

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
						<Fade in={tabIndex === 0}>Global configs</Fade>
					</TabPanel>
					<TabPanel p={0}>
						<Fade in={tabIndex === 1}>Grid structure</Fade>
					</TabPanel>
				</TabPanels>
			</Tabs>
			<Flex justifyContent="flex-end" mt={8} gap={3}>
				<Button variant="base" size="sm">
					Copy
				</Button>
			</Flex>
		</Box>
	);
};
