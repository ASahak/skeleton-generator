import { atom, RecoilState } from 'recoil';
import { IGrid, ISkeleton } from '@/common/types';

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
