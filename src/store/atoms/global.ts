import { atom, RecoilState } from 'recoil';
import {
	COLOR_MODE,
	filterFromPx,
	DEFAULT_COLOR_THEMES,
} from 'react-skeleton-builder';
import type { Device } from 'react-skeleton-builder';
import type { IGrid, ISkeleton } from '@/common/types';
import { breakpoints } from '@/styles/theme';

export const deviceState: RecoilState<Device | null> = atom<Device | null>({
	key: 'device',
	default: null,
});

export const autoDeviceCheckingIsActiveState: RecoilState<boolean> = atom({
	key: 'auto-device-checking',
	default: true,
});

export const adaptiveDeviceEnabledState: RecoilState<boolean> = atom({
	key: 'adaptive-device-enabled',
	default: false,
});

export const gridState: RecoilState<Record<string, IGrid>> = atom({
	key: 'grid',
	default: {},
});

export const skeletonsState: RecoilState<Record<string, ISkeleton>> = atom({
	key: 'skeletons',
	default: {},
});

export const highlightedNodeState: RecoilState<string> = atom({
	key: 'highlighted-node',
	default: '',
});

export const rootStylesState: RecoilState<string> = atom({
	key: 'root-styles',
	default: `{ 
  width: 100%;
  height: 100%;
}`,
});

export const optionsPanelIsOpenState: RecoilState<boolean> = atom({
	key: 'options-panel-is-open',
	default: false,
});

export const colorThemeState: RecoilState<
	Record<COLOR_MODE, Record<'main' | 'gradient', string>>
> = atom({
	key: 'color-theme',
	default: DEFAULT_COLOR_THEMES,
});

export const skeletonAnimationState: RecoilState<string> = atom({
	key: 'skeleton-animation',
	default: 'slide', // todo
});

export const breakpointsState: RecoilState<Record<Device, string>> = atom({
	key: 'breakpoints',
	default: {
		mobile: `${filterFromPx(breakpoints.sm) - 1}px`, // max-width
		tablet: `${filterFromPx(breakpoints.lg) - 1}px`, // max-width
		desktop: breakpoints.lg, // min-width
	},
});
