import { ALIGN_ITEMS, MARGIN_SIDES, SIZE_UNITS } from '@/common/enums';
import {
  CONTAINER_INITIAL_VALUES,
  DEFAULT_GRID_CONTAINER_HEIGHT,
  DEFAULT_GRID_CONTAINER_WIDTH
} from '@/constants/general-settings';
import { IGrid, ISkeleton } from '@/common/types';

export const generateDefaultValues = () => {
  return Object.keys(CONTAINER_INITIAL_VALUES)
    .filter(e => isNaN(Number(e)))
    .reduce((acc, item) => {
      acc[item as keyof typeof CONTAINER_INITIAL_VALUES] = CONTAINER_INITIAL_VALUES[item as keyof typeof CONTAINER_INITIAL_VALUES];
      return acc;
    }, {} as Record<keyof typeof CONTAINER_INITIAL_VALUES, any>);
}

export const convertToArray = (str: string) => str
  .replace(/\[|\]/g, '')
  ?.split(',') || [];

export const overrideSides = (side: MARGIN_SIDES, value: string, newValue: string): Array<string> => {
  let [top, right, bottom, left] = convertToArray(value);
  switch (side) {
    case MARGIN_SIDES.TOP:
      top = newValue;
      break;
    case MARGIN_SIDES.RIGHT:
      right = newValue;
      break;
    case MARGIN_SIDES.BOTTOM:
      bottom = newValue;
      break;
    case MARGIN_SIDES.LEFT:
      left = newValue;
      break;
  }

  return [top, right, bottom, left];
}

export const valueWithPrefix = (v: string): { value: string, unit: string } => {
  try {
    if (v === 'auto') return {
      value: 'auto',
      unit: '',
    };

    const match = v.match(/^([\d.]+)([a-zA-Z%]+)$/);
    if (match) {
      return {
        value: match[1],
        unit: match[2],
      }
    } else {
      if (Object.values(SIZE_UNITS).includes(v as SIZE_UNITS)) {
        return {
          value: '',
          unit: v,
        }
      }

      throw 'not matched';
    }
  } catch {
    return {
      value: '',
      unit: '',
    }
  }
}

const isNumber = (n: string | number): boolean =>
  !isNaN(parseFloat(String(n))) && isFinite(Number(n));

export const generateMargin = (marginProp: IGrid['margin']) => {
  const marginDetect = () => {
    let [top, right, bottom, left] = convertToArray(marginProp as string);
    return [top, right, bottom, left].reduce((acc, item: string) => {
      acc += isNumber(item) ? item + 'px ' : item + ' ';
      return acc;
    }, '');
  };

  return marginDetect();
};

export const generateGridArea = (row: Array<ISkeleton | IGrid>) =>
  row.reduce((acc: string, item) => {
    acc += Array.isArray(item)
      ? DEFAULT_GRID_CONTAINER_WIDTH
      : typeof item.w === 'function'
        ? item.w()
        : item.w + ' ';
    return acc;
  }, '1fr / ');

export const generateGridAreaAsColDirection = (items: Array<ISkeleton | IGrid>, alignItems: ALIGN_ITEMS) => {
  return items.reduce((acc, item) => {
    acc += (alignItems === 'center'
      ? DEFAULT_GRID_CONTAINER_HEIGHT
      : typeof item.h === 'function'
        ? item.h()
        : item.h || DEFAULT_GRID_CONTAINER_HEIGHT) + ' ';
    return acc;
  }, '') + ' / 1fr'
}

export const itemsWithRepeat = (skeletons: Array<ISkeleton | IGrid>, repeatCount: number) => {
  return repeatCount > 0 ? [].constructor(repeatCount).fill(skeletons[0]) : skeletons;
};

export const setOpacity = (viewIndex: number, repeatCount: number, rowsLength: number, withOpacity?: boolean) => {
  return (repeatCount || rowsLength) > 0 && withOpacity ? 1 - (1 / (repeatCount || rowsLength)) * viewIndex : 1;
};