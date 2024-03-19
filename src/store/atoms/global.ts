import { atom, RecoilState } from 'recoil';
import { TREE_ELEMENTS_SPACING } from '@/constants/general-settings';

export const gridState: RecoilState<Record<string, unknown>> = atom({
	key: 'grid',
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
