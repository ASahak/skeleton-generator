import { DEFAULT_DIRECTION_GRID_COLS, DEFAULT_GAP, DEFAULT_REPEAT_COUNT } from '@/constants/general-settings';
import { GridKeyType } from '@/common/types';

export const putDefaultValue = (propName: GridKeyType) => {
  switch (propName) {
    case 'gridGap':
      return DEFAULT_GAP;
    case 'repeatCount':
      return DEFAULT_REPEAT_COUNT;
    case 'direction':
      return DEFAULT_DIRECTION_GRID_COLS;
  }
}
