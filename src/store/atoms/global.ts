import { atom, RecoilState } from 'recoil';
import {
	COLOR_MODE,
	DEFAULT_COLOR_THEMES,
	SKELETON_ANIMATION_VARIANTS,
	DEFAULT_BREAKPOINTS,
} from 'react-skeleton-builder';
import type { Device } from 'react-skeleton-builder';
import type { IGrid, ISkeleton } from '@/common/types';

export const deviceState: RecoilState<Device | null> = atom<Device | null>({
	key: 'device',
	default: null,
});

export const previewModeState: RecoilState<boolean> = atom<boolean>({
	key: 'preview-mode',
	default: false,
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

export const skeletonAnimationState: RecoilState<SKELETON_ANIMATION_VARIANTS> =
	atom({
		key: 'skeleton-animation',
		default: SKELETON_ANIMATION_VARIANTS.SLIDE as SKELETON_ANIMATION_VARIANTS,
	});

export const breakpointsState: RecoilState<Record<Device, string>> = atom({
	key: 'breakpoints',
	default: DEFAULT_BREAKPOINTS,
});
