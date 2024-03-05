import { selector } from 'recoil';
import {
  gridState,
  highlightedNodeState,
  optionsPanelIsOpenState,
  rootStylesState,
  treeElementsSpacingState,
} from '@/store/atoms/global';

export const selectGridState = selector({
  key: 'select-grid',
  get: ({ get }) => {
    return get(gridState)
  }
});

export const selectHighlightedNodeState = selector({
  key: 'select-highlighted-node',
  get: ({ get }) => {
    return get(highlightedNodeState)
  }
});


export const selectOptionsPanelIsOpenState = selector({
  key: 'select-options-panel-is-open',
  get: ({ get }) => {
    return get(optionsPanelIsOpenState)
  }
});

export const selectRootStylesState = selector({
  key: 'select-root-styles',
  get: ({ get }) => {
    return get(rootStylesState)
  }
});

export const selectTreeElementsSpacingState = selector({
  key: 'select-tree-elements-spacing',
  get: ({ get }) => {
    return get(treeElementsSpacingState)
  }
});