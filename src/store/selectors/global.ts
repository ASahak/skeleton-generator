import { selector, selectorFamily } from 'recoil';
import dlv from 'dlv';
import {
	gridState,
	highlightedNodeState,
	optionsPanelIsOpenState,
	rootStylesState,
} from '@/store/atoms/global';
import { GridKeyType } from '@/common/types';
import { CONTAINER_INITIAL_VALUES } from '@/constants/general-settings';

export const selectGridState = selector({
	key: 'select-grid',
	get: ({ get }) => {
		return get(gridState);
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
		(propName: GridKeyType) =>
		({ get }) => {
			const dataKey = get(highlightedNodeState);
			const grid: Record<string, any> = dlv(get(gridState), dataKey);

			return (
				grid[propName as string] ??
				CONTAINER_INITIAL_VALUES[
					propName as keyof typeof CONTAINER_INITIAL_VALUES
				]
			);
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
