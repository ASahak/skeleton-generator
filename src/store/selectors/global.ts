import { selector, selectorFamily } from 'recoil';
import dlv from 'dlv';
import {
	adaptiveDeviceEnabledState,
	autoDeviceCheckingIsActiveState,
	breakpointsState,
	colorThemeState,
	deviceState,
	gridState,
	highlightedNodeState,
	optionsPanelIsOpenState,
	rootStylesState,
	skeletonsState,
} from '@/store/atoms/global';
import {
	Device,
	GridKeyType,
	ISkeleton,
	SkeletonKeyType,
} from '@/common/types';
import {
	CONTAINER_INITIAL_VALUES,
	SKELETON_INITIAL_VALUES,
} from '@/constants/general-settings';
import { isSkeletonHighlighted } from '@/utils/helpers';
import { COLOR_MODE } from '@/common/enums';

export const selectGridState = selector({
	key: 'select-grid',
	get: ({ get }) => {
		return get(gridState);
	},
});

export const selectSkeletonsState = selector({
	key: 'select-skeletons',
	get: ({ get }) => {
		return get(skeletonsState);
	},
});

export const selectHighlightedNodeState = selector({
	key: 'select-highlighted-node',
	get: ({ get }) => {
		return get(highlightedNodeState);
	},
});

export const selectHighlightedNodeGridPropState = selectorFamily({
	key: 'select-highlighted-node-grid-prop',
	get:
		(propName: GridKeyType | SkeletonKeyType) =>
		({ get }) => {
			const dataKey: string = get(highlightedNodeState);
			const device: Device | null = get(selectDeviceState);
			if (isSkeletonHighlighted(dataKey)) {
				const skeleton: Record<string, any> = dlv(get(skeletonsState), dataKey);

				if (device && device !== 'desktop') {
					return (
						skeleton.responsive[device][propName as string] ??
						SKELETON_INITIAL_VALUES[
							propName as keyof typeof SKELETON_INITIAL_VALUES
						]
					);
				}

				return (
					skeleton[propName as string] ??
					SKELETON_INITIAL_VALUES[
						propName as keyof typeof SKELETON_INITIAL_VALUES
					]
				);
			}

			const grid: Record<string, any> = dlv(get(gridState), dataKey);

			if (device && device !== 'desktop') {
				return (
					grid.responsive[device][propName as string] ??
					CONTAINER_INITIAL_VALUES[
						propName as keyof typeof CONTAINER_INITIAL_VALUES
					]
				);
			}

			return (
				grid[propName as string] ??
				CONTAINER_INITIAL_VALUES[
					propName as keyof typeof CONTAINER_INITIAL_VALUES
				]
			);
		},
});

export const selectSkeletonsByParentKey = selectorFamily({
	key: 'select-skeletons-by-parent-key',
	get:
		(parentKey: string) =>
		({ get }) => {
			return dlv(get(skeletonsState), parentKey) as ISkeleton[];
		},
});

export const selectOptionsPanelIsOpenState = selector({
	key: 'select-options-panel-is-open',
	get: ({ get }) => {
		return get(optionsPanelIsOpenState);
	},
});

export const selectRootStylesState = selector({
	key: 'select-root-styles',
	get: ({ get }) => {
		return get(rootStylesState);
	},
});

export const selectColorThemeState = selectorFamily({
	key: 'select-color-theme',
	get:
		(colorMode: COLOR_MODE) =>
		({ get }) => {
			const state = get(colorThemeState);

			return state[colorMode];
		},
});

export const selectDeviceState = selector({
	key: 'select-device',
	get: ({ get }) => get(deviceState),
});

export const selectAutoDeviceCheckingIsActiveState = selector({
	key: 'select-auto-device-checking',
	get: ({ get }) => get(autoDeviceCheckingIsActiveState),
});

export const selectBreakpointsState = selector({
	key: 'select-breakpoints',
	get: ({ get }) => get(breakpointsState),
});

export const selectAdaptiveDeviceEnabledState = selector({
	key: 'select-adaptive-device-enabled',
	get: ({ get }) => get(adaptiveDeviceEnabledState),
});
