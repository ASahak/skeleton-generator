import { FC, LegacyRef, memo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
	parseStyleObject,
	ReactSkeletonProvider,
	ROOT_KEY,
	Skeleton,
	SKELETON_ANIMATION_VARIANTS,
} from 'react-skeleton-builder';
import { Box, useColorMode } from '@chakra-ui/react';
import {
	selectAdaptiveDeviceEnabledState,
	selectBreakpointsState,
	selectGridState,
	selectRootStylesState,
	selectSkeletonAnimationState,
	selectSkeletonsState,
} from '@/store/selectors/global';
import { colorThemeState } from '@/store/atoms/global';
import { getGridStructure } from '@/utils/helpers';
import { useMeasure } from 'react-use';

export const PreviewStructure: FC = memo(() => {
	const { colorMode } = useColorMode();
	const selectedVariant = useRecoilValue(selectSkeletonAnimationState);
	const [colorThemes] = useRecoilState(colorThemeState);
	const rootStyles = useRecoilValue(selectRootStylesState);
	const gridState = useRecoilValue(selectGridState);
	const skeletonsState = useRecoilValue(selectSkeletonsState);
	const adaptiveDeviceEnabled = useRecoilValue(
		selectAdaptiveDeviceEnabledState
	);
	const [ref, { width }] = useMeasure();
	const breakpoints = useRecoilValue(selectBreakpointsState);

	return (
		<Box ref={ref as LegacyRef<HTMLDivElement> | undefined} h="full">
			<ReactSkeletonProvider
				value={{
					isDark: colorMode === 'dark',
					skeletonAnimation: selectedVariant as SKELETON_ANIMATION_VARIANTS,
					colorTheme: {
						dark: colorThemes.dark,
						light: colorThemes.light,
					},
					breakpoints,
				}}
			>
				<Skeleton
					customContainerWidth={width}
					styles={parseStyleObject(rootStyles)}
					grid={getGridStructure(
						gridState[ROOT_KEY],
						gridState,
						skeletonsState,
						adaptiveDeviceEnabled
					)}
				/>
			</ReactSkeletonProvider>
		</Box>
	);
});
