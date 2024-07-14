'use client';

import { useCallback, useState } from 'react';
import { Box, VStack, Grid, GridItem } from '@chakra-ui/react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Header, Empty } from '@/components';
import { OptionsPanel } from '@/containers/generator/options-panel';
import { GridLayout } from '@/containers/generator/grid-layout';
import { useThemeColors } from '@/hooks';
import { selectGridState } from '@/store/selectors/global';
import { optionsPanelIsOpenState } from '@/store/atoms/global';
import { AdaptiveDeviceContainer } from '@/containers/adaptive-device-container';

export default function View() {
	const { gray80_dark800 } = useThemeColors();
	const [initialLayoutSize, setInitialLayoutSize] = useState<{
		height: number;
		width: number;
	} | null>(null);
	const getGridState = useRecoilValue(selectGridState);
	const [optionsPanelIsOpen] = useRecoilState(optionsPanelIsOpenState);
	const ableToPreview = Object.keys(getGridState).length > 0;

	const layoutContainerRefCallback = useCallback((node: HTMLElement | null) => {
		if (node) {
			const { width, height } = node.getBoundingClientRect();
			setInitialLayoutSize({ height, width });
		}
	}, []);

	return (
		<VStack bgColor={gray80_dark800} h="full" spacing={0}>
			<Header />
			<Box flex={1} w="full" p={4} overflow="hidden">
				{ableToPreview ? (
					<>
						<Grid
							h="full"
							templateColumns={optionsPanelIsOpen ? '6fr 2fr' : '1fr 0fr'}
							gap={optionsPanelIsOpen ? 4 : 0}
							transition=".3s"
						>
							<GridItem
								overflow="hidden"
								maxH="full"
								ref={layoutContainerRefCallback}
							>
								{initialLayoutSize ? (
									<AdaptiveDeviceContainer initialSize={initialLayoutSize}>
										<GridLayout />
									</AdaptiveDeviceContainer>
								) : null}
							</GridItem>
							<GridItem position="relative">
								<OptionsPanel />
							</GridItem>
						</Grid>
					</>
				) : (
					<Box
						display="flex"
						alignItems="center"
						justifyContent="center"
						h="full"
					>
						<Empty label="No Template" />
					</Box>
				)}
			</Box>
		</VStack>
	);
}
