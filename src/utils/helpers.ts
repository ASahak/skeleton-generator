import { CONTAINER_INITIAL_VALUES, MARGIN_SIDES, SIZE_UNITS } from '@/common/enums';

export const generateDefaultValues = () => {
  return Object.keys(CONTAINER_INITIAL_VALUES)
    .filter(e => isNaN(Number(e)))
    .reduce((acc, item) => {
      acc[item as CONTAINER_INITIAL_VALUES] = CONTAINER_INITIAL_VALUES[item as keyof typeof CONTAINER_INITIAL_VALUES];
      return acc;
    }, {} as Record<CONTAINER_INITIAL_VALUES, any>);
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
