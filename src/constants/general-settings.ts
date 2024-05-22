/*TODO need to import from npm package*/
import { DIRECTION, SIZE_UNITS } from '@/common/enums';
import { GridKeyType } from '@/common/types';

export const STYLE_PARSING_REGEXP = /(^\{|\}$)/g;

export const DEFAULT_RADIUS = '0px';
export const DEFAULT_GAP = '1'; // expressed by rem
export const DEFAULT_SKELETON_WIDTH = '100%';
export const DEFAULT_GRID_CONTAINER_WIDTH = '1fr';
export const DEFAULT_GRID_CONTAINER_HEIGHT = '1fr';
export const DEFAULT_HEIGHT = '100%';
export const DEFAULT_WIDTH = '100%';
export const DEFAULT_DIRECTION_GRID_COLS = 'row';
export const DEFAULT_JUSTIFY_ALIGNMENT = 'flex-start';
export const DEFAULT_ALIGN_ITEMS_ALIGNMENT = 'flex-start';
export const DEFAULT_GRID_STYLE = '1fr / 1fr';
export const DEFAULT_REPEAT_COUNT = 0;
export const DEFAULT_VARIANT = 'gray';
export const DEFAULT_SKELETON_GRADIENT_WIDTH = 100;

export const ROOT_KEY = 'grid_1';

export const TREE_ELEMENTS_SPACING = {
	MAX: 20,
	MIN: 0,
	DEFAULT: 10,
};

export const REPEAT_COUNT_RANGE = {
	MAX: 1000,
	MIN: 0,
	DEFAULT: DEFAULT_REPEAT_COUNT,
};

export const CONTAINER_INITIAL_VALUES: Partial<Record<GridKeyType, any>> = {
	direction: DIRECTION.ROW,
	gridGap: DEFAULT_GAP,
	repeatCount: DEFAULT_REPEAT_COUNT,
	className: '',
	margin: '0',
	w: DEFAULT_WIDTH,
	h: DEFAULT_HEIGHT,
	alignItems: DEFAULT_ALIGN_ITEMS_ALIGNMENT,
	justifyContent: DEFAULT_JUSTIFY_ALIGNMENT,
	withOpacity: false,
	styles: `{}`,
};

export const SKELETON_INITIAL_VALUES = {
	margin: '0',
	w: DEFAULT_WIDTH,
	h: DEFAULT_HEIGHT,
	r: '0px',
	skeletonW: DEFAULT_SKELETON_GRADIENT_WIDTH,
};

export const SIZE_UNITS_INITIAL_VALUES = {
	[SIZE_UNITS.FN]: '',
	[SIZE_UNITS.AUTO]: '',
	[SIZE_UNITS.PERCENT]: '100',
	[SIZE_UNITS.PX]: '100',
	[SIZE_UNITS.FR]: '1',
	[SIZE_UNITS.REM]: '1',
	[SIZE_UNITS.VH]: '100',
	[SIZE_UNITS.VW]: '100',
	[SIZE_UNITS.PC]: '1',
	[SIZE_UNITS.CM]: '1',
	[SIZE_UNITS.MM]: '100',
	[SIZE_UNITS.IN]: '1',
	[SIZE_UNITS.PT]: '1',
	[SIZE_UNITS.CH]: '1',
	[SIZE_UNITS.EM]: '1',
	[SIZE_UNITS.V_MIN]: '100',
	[SIZE_UNITS.V_MAX]: '100',
};
