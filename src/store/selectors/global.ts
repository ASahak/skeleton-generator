import { selector } from 'recoil';
import { gridState } from '@/store/atoms/global';

export const selectGridState = selector({
  key: 'select-grid',
  get: ({ get }) => {
    return get(gridState)
  }
});