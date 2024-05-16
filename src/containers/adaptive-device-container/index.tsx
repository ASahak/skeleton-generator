import React, { memo, useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { useContainerQuery } from 'react-container-query';
import { useRecoilState } from 'recoil';
import { useThemeColors } from '@/hooks';
import {
	autoDeviceCheckingIsActiveState,
	deviceState,
} from '@/store/atoms/global';
import { breakpoints } from '@/styles/theme';
import { filterFromPx } from '@/utils/helpers';
import { Device } from '@/common/types';

const query = {
	mobile: {
		minWidth: 0,
		maxWidth: filterFromPx(breakpoints.sm),
	},
	tablet: {
		minWidth: filterFromPx(breakpoints.sm) + 1,
		maxWidth: filterFromPx(breakpoints.lg),
	},
	desktop: {
		minWidth: filterFromPx(breakpoints.lg) + 1,
	},
};
const calcContainerWidth = (device: Device | null) => {
	if (device === 'mobile') return `${filterFromPx(breakpoints.sm)}px`;
	else if (device === 'tablet') return `${filterFromPx(breakpoints.lg)}px`;
	return 'full';
};

export const AdaptiveDeviceContainer = memo(
	({
		children,
		initialSize,
	}: Readonly<{
		children: React.ReactNode;
		initialSize: { width: number; height: number };
	}>) => {
		const { white_dark700 } = useThemeColors();
		const [device, setDeviceState] = useRecoilState(deviceState);
		const [isAutoCheckingDevice, setIsAutoCheckingDevice] = useRecoilState(
			autoDeviceCheckingIsActiveState
		);
		const [containerWidth, setContainerWidth] = useState(
			calcContainerWidth(device)
		);
		const [{ mobile, tablet, desktop }, containerRef] = useContainerQuery(
			query,
			initialSize
		);

		useEffect(() => {
			if (isAutoCheckingDevice) {
				setDeviceState(mobile ? 'mobile' : tablet ? 'tablet' : 'desktop');
			}
		}, [mobile, tablet, desktop, isAutoCheckingDevice]);

		useEffect(() => {
			setContainerWidth(calcContainerWidth(device));
		}, [device]);

		useEffect(() => {
			return () => {
				setIsAutoCheckingDevice(true);
			};
		}, []);

		return (
			<Box ref={containerRef} h="full">
				<Box
					mx="auto"
					maxW={containerWidth}
					rounded="md"
					bgColor={white_dark700}
					boxShadow="md"
					p={4}
					h="full"
				>
					{children}
				</Box>
			</Box>
		);
	}
);
