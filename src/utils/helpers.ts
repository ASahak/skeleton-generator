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
	DEFAULT_HEIGHT,
	DEFAULT_WIDTH,
	ROOT_KEY,
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
): string[] => {
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
		let [t, r, b, l] = convertToArray(marginProp as string);
		if (t && !r && !b && !l) {
			r = t;
			b = t;
			l = t;
		} else {
			if (!t) {
				t = b || '0';
			}
			if (!r) {
				r = l || '0';
			}
			if (!b) {
				b = t || '0';
			}
			if (!l) {
				l = r || '0';
			}
		}
		return [t, r, b, l].reduce((acc, item: string) => {
			acc += isNumber(item) ? item + 'px ' : item + ' ';
			return acc;
		}, '');
	};

	return marginDetect();
};

export const generateGridArea = (
	row: (ISkeleton | IGrid)[],
	cb: (index: number, prop: 'w', value: string | number) => void
) => {
	return row.reduce((acc: string, item, index) => {
		const isFunction = typeof item.w === 'function';
		if (isFunction) {
			const w = (item.w as any)();
			acc += Array.isArray(item) ? DEFAULT_GRID_CONTAINER_WIDTH : w;
			cb(index, 'w', w);
		} else {
			acc += Array.isArray(item)
				? DEFAULT_GRID_CONTAINER_WIDTH
				: (item.w === DEFAULT_WIDTH ? '1fr' : item.w) + ' ';
		}
		return acc;
	}, '1fr / ');
};

export const generateGridAreaAsColDirection = (
	items: (ISkeleton | IGrid)[],
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
						: !item.h || item.h === DEFAULT_HEIGHT
							? DEFAULT_GRID_CONTAINER_HEIGHT
							: item.h) + ' ';
			}
			return acc;
		}, '') + ' / 1fr'
	);
};

export const itemsWithRepeat = (
	skeletons: (ISkeleton | IGrid)[],
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
	skeletons,
	children,
	repeatCount,
	reservedProps,
	keyLevel,
}: IGenerateCSSGridAreaArgs) => {
	return grid.direction === DIRECTION.ROW
		? generateGridArea(
				(hasChildren
					? children
					: itemsWithRepeat((skeletons || []) as ISkeleton[], repeatCount)
				).map(({ w = DEFAULT_GRID_CONTAINER_WIDTH }) => ({ w })),
				(index, prop, val) => {
					if (!reservedProps[`${keyLevel}_${index + 1}` as any]) {
						reservedProps[`${keyLevel}_${index + 1}`] = {};
					}
					reservedProps[`${keyLevel}_${index + 1}`][prop] = val;
				}
			)
		: generateGridAreaAsColDirection(
				(children || skeletons) as (IGrid | ISkeleton)[],
				grid.alignItems as ALIGN_ITEMS,
				(index, prop, val) => {
					if (!reservedProps[`${keyLevel}_${index + 1}`]) {
						reservedProps[`${keyLevel}_${index + 1}`] = {};
					}
					reservedProps[`${keyLevel}_${index + 1}`][prop] = val;
				}
			);
};

export const findAbsentIndex = (base: string, arr: string[]): number => {
	if (!arr.length) return 1;

	const splitted = arr
		.join('')
		.split(base)
		.filter((e) => e !== '')
		.map((e) => +e);
	const max = Math.max(...splitted);
	for (let i = 1; i <= max; i++) {
		if (!splitted.includes(i)) {
			return i;
		}
	}
	return max + 1;
};

export const generateBorders = ({
	keyLevel,
	highlightedNode,
	parent,
	isDark,
	hasChildren,
}: {
	keyLevel: string;
	highlightedNode: string;
	parent: string | undefined;
	isDark: boolean;
	hasChildren: boolean;
}) =>
	keyLevel === highlightedNode
		? {
				boxShadow: '0px 0px 1px 1px var(--chakra-colors-brand-500)',
			}
		: parent === highlightedNode
			? {
					boxShadow: `0px 0px 1px 1px inset ${isDark ? '#323441' : '#e6e6e6'}`,
				}
			: !hasChildren
				? {
						boxShadow: `0px 0px 0px 1px inset ${isDark ? 'rgba(50,52,65,0.24)' : 'rgba(230,230,230,0.27)'}`,
					}
				: {};

export const findTrap = (
	node: HTMLElement | null,
	highlightedNode: string,
	trap: (key: string) => void
) => {
	if (node) {
		const keyLevel = node.getAttribute('data-key') || '';

		const currentSplit = keyLevel.split('_');
		// if trap is the same as highlighted
		if (keyLevel === highlightedNode) {
			// if trap is the root node
			if (keyLevel === ROOT_KEY) return;

			trap([...currentSplit].slice(0, currentSplit.length - 1).join('_'));
			return;
		}

		// if keyLevel is parent of highlightedNode
		if (highlightedNode.indexOf(keyLevel) > -1) {
			trap(keyLevel);
			return;
		}

		const highlightedNodeSplit = highlightedNode.split('_');

		const inTheSameLevel = (current: string[]) =>
			current.length === highlightedNodeSplit.length &&
			[...current].slice(0, current.length - 1).join('_') ===
				[...highlightedNodeSplit]
					.slice(0, highlightedNodeSplit.length - 1)
					.join('_');

		const isDirectChild = (current: string[]) =>
			[...current].slice(0, current.length - 1).join('_') ===
			[...highlightedNodeSplit].join('_');

		if (isDirectChild(currentSplit) || inTheSameLevel(currentSplit)) {
			trap(keyLevel);
			return;
		}

		for (let i = currentSplit.length - 1; i > 1; i--) {
			const newKey = [...currentSplit].splice(0, i);
			if (inTheSameLevel(newKey) || isDirectChild(newKey)) {
				trap(newKey.join('_'));
				return;
			}

			if (newKey.join('_') === highlightedNode) {
				trap(newKey.concat(currentSplit[i]).join('_'));
				return;
			}
		}

		trap(ROOT_KEY);
	}
};

export const getParent = (path: string): string => {
	if (path === ROOT_KEY) return path;

	const paths = path.split('_');
	paths.pop();
	return paths.join('_');
};
