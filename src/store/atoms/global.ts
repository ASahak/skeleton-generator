import { atom, RecoilState } from 'recoil';
import { Device, IGrid, ISkeleton } from '@/common/types';
import { COLOR_MODE } from '@/common/enums';
import { breakpoints } from '@/styles/theme';
import { filterFromPx } from '@/utils/helpers';

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
	default: {
		dark: {
			main: '#282c34',
			gradient: '#2c303a',
		},
		light: {
			main: '#f1f1f1',
			gradient: '#ececec',
		},
	},
});

export const breakpointsState: RecoilState<Record<Device, string>> = atom({
	key: 'breakpoints',
	default: {
		mobile: `${filterFromPx(breakpoints.sm) - 1}px`, // max-width
		tablet: `${filterFromPx(breakpoints.lg) - 1}px`, // max-width
		desktop: breakpoints.lg, // min-width
	},
});
