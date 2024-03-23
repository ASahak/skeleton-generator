import {
	ALIGN_ITEMS,
	DIRECTION,
	MARGIN_SIDES,
	SIZE_UNITS,
} from '@/common/enums';
import {
	CONTAINER_INITIAL_VALUES,
	DEFAULT_GRID_CONTAINER_HEIGHT,
	DEFAULT_GRID_CONTAINER_WIDTH,
} from '@/constants/general-settings';
import { IGenerateCSSGridAreaArgs, IGrid, ISkeleton } from '@/common/types';

export const generateDefaultValues = () => {
	return Object.keys(CONTAINER_INITIAL_VALUES)
		.filter((e) => isNaN(Number(e)))
		.reduce(
			(acc, item) => {
				acc[item as keyof typeof CONTAINER_INITIAL_VALUES] =
					CONTAINER_INITIAL_VALUES[
						item as keyof typeof CONTAINER_INITIAL_VALUES
					];
				return acc;
			},
			{} as Record<keyof typeof CONTAINER_INITIAL_VALUES, any>
		);
};

export const convertToArray = (str: string) =>
	str.replace(/\[|\]/g, '')?.split(',') || [];

export const overrideSides = (
	side: MARGIN_SIDES,
	value: string,
	newValue: string
): Array<string> => {
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
};

export const valueWithPrefix = (v: string): { value: string; unit: string } => {
	try {
		if (v === 'auto')
			return {
				value: 'auto',
				unit: '',
			};

		const match = v.match(/^([\d.]+)([a-zA-Z%]+)$/);
		if (match) {
			return {
				value: match[1],
				unit: match[2],
			};
		} else {
			if (Object.values(SIZE_UNITS).includes(v as SIZE_UNITS)) {
				return {
					value: '',
					unit: v,
				};
			}

			throw 'not matched';
		}
	} catch {
		return {
			value: '',
			unit: '',
		};
	}
};

const isNumber = (n: string | number): boolean =>
	!isNaN(parseFloat(String(n))) && isFinite(Number(n));

export const generateMargin = (marginProp: IGrid['margin']) => {
	const marginDetect = () => {
		const [top, right, bottom, left] = convertToArray(marginProp as string);
		return [top, right, bottom, left].reduce((acc, item: string) => {
			acc += isNumber(item) ? item + 'px ' : (item || '0') + ' ';
			return acc;
		}, '');
	};

	return marginDetect();
};

export const generateGridArea = (
	row: Array<ISkeleton | IGrid>,
	cb: (index: number, prop: 'w', value: string | number) => void
) => {
	return row.reduce((acc: string, item, index) => {
		const isFunction = typeof item.w === 'function';
		if (isFunction) {
			const w = (item.w as any)();
			acc += Array.isArray(item) ? DEFAULT_GRID_CONTAINER_WIDTH : w;
			cb(index, 'w', w);
		} else {
			acc += Array.isArray(item) ? DEFAULT_GRID_CONTAINER_WIDTH : item.w + ' ';
		}
		return acc;
	}, '1fr / ');
};

export const generateGridAreaAsColDirection = (
	items: Array<ISkeleton | IGrid>,
	alignItems: ALIGN_ITEMS,
	cb: (index: number, prop: 'h', value: string | number) => void
) => {
	return (
		items.reduce((acc, item, index) => {
			const isFunction = typeof item.h === 'function';
			if (isFunction) {
				const h = (item.h as any)();
				acc += alignItems === 'center' ? DEFAULT_GRID_CONTAINER_HEIGHT : h;
				cb(index, 'h', h);
			} else {
				acc +=
					(alignItems === 'center'
						? DEFAULT_GRID_CONTAINER_HEIGHT
						: item.h || DEFAULT_GRID_CONTAINER_HEIGHT) + ' ';
			}
			return acc;
		}, '') + ' / 1fr'
	);
};

export const itemsWithRepeat = (
	skeletons: Array<ISkeleton | IGrid>,
	repeatCount: number
) => {
	return repeatCount > 0
		? [].constructor(repeatCount).fill(skeletons[0])
		: skeletons;
};

export const setOpacity = (
	viewIndex: number,
	repeatCount: number,
	rowsLength: number,
	withOpacity?: boolean
) => {
	return (repeatCount || rowsLength) > 0 && withOpacity
		? 1 - (1 / (repeatCount || rowsLength)) * viewIndex
		: 1;
};

export const convertCssToReactStyles = (cssStyles: Record<string, any>) => {
	const reactStyles: Record<string, any> = {};

	for (const key in cssStyles) {
		// Convert CSS property names to camelCase
		const camelCaseKey: string = key.replace(/-([a-z])/g, (g) =>
			g[1].toUpperCase()
		);
		reactStyles[camelCaseKey] = cssStyles[key];
	}

	return reactStyles;
};

export const generateCSSGridArea = ({
	grid,
	hasChildren,
	children,
	repeatCount,
	reservedProps,
	keyLevel,
}: IGenerateCSSGridAreaArgs) => {
	return grid.direction === DIRECTION.ROW
		? generateGridArea(
				(hasChildren
					? children
					: itemsWithRepeat((grid.skeletons || []) as ISkeleton[], repeatCount)
				).map(({ w = DEFAULT_GRID_CONTAINER_WIDTH }) => ({ w })),
				(index, prop, val) => {
					if (!reservedProps[`${keyLevel}_${index}` as any]) {
						reservedProps[`${keyLevel}_${index}`] = {};
					}
					reservedProps[`${keyLevel}_${index}`][prop] = val;
				}
			)
		: generateGridAreaAsColDirection(
				(grid.children || grid.skeletons) as (IGrid | ISkeleton)[],
				grid.alignItems as ALIGN_ITEMS,
				(index, prop, val) => {
					if (!reservedProps[`${keyLevel}_${index}`]) {
						reservedProps[`${keyLevel}_${index}`] = {};
					}
					reservedProps[`${keyLevel}_${index}`][prop] = val;
				}
			);
};
