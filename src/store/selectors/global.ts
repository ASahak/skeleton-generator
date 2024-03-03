import { selector } from 'recoil';
import { gridState, optionsPanelIsOpenState, rootStylesState } from '@/store/atoms/global';

export const selectGridState = selector({
  key: 'select-grid',
  get: ({ get }) => {
    return get(gridState)
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