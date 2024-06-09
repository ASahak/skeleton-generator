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
	SKELETON_INITIAL_VALUES,
} from '@/constants/general-settings';
import {
	Device,
	GridKeyType,
	IGenerateCSSGridAreaArgs,
	IGrid,
	ISkeleton,
	Responsive,
	SkeletonKeyType,
} from '@/common/types';

export const responsiveInstance = (
	instance:
		| Partial<Record<GridKeyType, any>>
		| Partial<Record<SkeletonKeyType, any>>
): Responsive => {
	return {
		mobile: { ...instance },
		tablet: { ...instance },
	};
};

export const getAdaptiveData = (
	grid: Partial<Record<GridKeyType, any>>,
	device: Device | null
) => {
	return device !== 'desktop' && device
		? {
				...grid.responsive[device],
				...(Object.hasOwn(grid, 'children') && { children: grid.children }),
				...(Object.hasOwn(grid, 'skeletons') && {
					skeletons: grid.skeletons,
				}),
			}
		: grid;
};

export const generateDefaultValues = () => {
	return Object.keys(CONTAINER_INITIAL_VALUES)
		.filter((e) => isNaN(Number(e)))
		.reduce(
			(acc: any, item: string) => {
				acc[item] =
					CONTAINER_INITIAL_VALUES[
						item as keyof typeof CONTAINER_INITIAL_VALUES
					];
				return acc;
			},
			{ responsive: responsiveInstance(CONTAINER_INITIAL_VALUES) }
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

export const valueWithPrefix = (v: any): { value: string; unit: string } => {
	try {
		if (typeof v === 'function')
			return {
				value: 'function...',
				unit: SIZE_UNITS.FN,
			};
		if (v === SIZE_UNITS.AUTO)
			return {
				value: SIZE_UNITS.AUTO,
				unit: SIZE_UNITS.AUTO,
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
			acc += (Array.isArray(item) ? DEFAULT_GRID_CONTAINER_WIDTH : w) + ' ';
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
				acc +=
					(alignItems === 'center' ? DEFAULT_GRID_CONTAINER_HEIGHT : h) + ' ';
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

export const mutateWithRepeated = (
	repeatCount: number,
	key: string,
	index: number
) => {
	return repeatCount > 0
		? {
				path: key,
				...(index > 0
					? {
							isRepeated: true,
							key: key + '_repeated_' + index,
						}
					: { key }),
			}
		: { path: key, key };
};

export const itemsWithRepeat = (
	skeletons: (ISkeleton | IGrid | string)[],
	repeatCount: number
) => {
	return repeatCount > 0 && skeletons[0]
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
					: itemsWithRepeat(skeletons as ISkeleton[], repeatCount)
				).map(({ w = DEFAULT_GRID_CONTAINER_WIDTH }) => ({ w })),
				(index, prop, val) => {
					if (!reservedProps[`${keyLevel}_${index + 1}` as any]) {
						reservedProps[`${keyLevel}_${index + 1}`] = {};
					}
					reservedProps[`${keyLevel}_${index + 1}`][prop] = val;
				}
			)
		: generateGridAreaAsColDirection(
				(hasChildren
					? children
					: itemsWithRepeat(skeletons as ISkeleton[], repeatCount)) as (
					| ISkeleton
					| IGrid
				)[],
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

const notRepeated = (key?: string, parentKey?: string | undefined) => {
	return !key?.includes('repeated') && !parentKey?.includes('repeated');
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
	parent?: string | undefined;
	isDark: boolean;
	hasChildren: boolean;
}) =>
	keyLevel === highlightedNode && notRepeated(keyLevel, parent)
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

		const currentSplit = keyLevel.split('_').filter(filterFromSkeleton);
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

		const highlightedNodeSplit = highlightedNode
			.split('_')
			.filter(filterFromSkeleton);

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

	const paths = path.split('_').filter(filterFromSkeleton);
	paths.pop();
	return paths.join('_');
};

export const copyExecCommand = (target: HTMLElement) => {
	let range, select;
	if (document.createRange) {
		range = document.createRange();
		range.selectNodeContents(target);
		select = window.getSelection();
		if (select) {
			select.removeAllRanges();
			select.addRange(range);
			document.execCommand('copy');
			select.removeAllRanges();
		}
	} else {
		range = (document.body as any).createTextRange();
		range.moveToElementText(target);
		range.select();
		document.execCommand('copy');
	}
};

export const applicableValue = (v: string): string => {
	if (v.indexOf('fr') > -1) {
		return 'auto';
	}

	return v;
};

export const isClickedOnSkeleton = (
	key: string,
	skeletons: Record<string, ISkeleton>
) => {
	return Object.hasOwn(skeletons, key);
};

export const filterFromSkeleton = (e: string) => e !== 'skeleton';

export const isSkeletonHighlighted = (highlightedNode: string) =>
	highlightedNode.includes('skeleton');

export const getDirectParentWithDataKeyAttr = (node: HTMLElement) => {
	let parent = node;
	let hasExactAttr = parent.hasAttribute('data-key');

	while (!hasExactAttr) {
		if (parent === document.body) {
			return null;
		}
		parent = node.parentElement as HTMLElement;
		hasExactAttr = parent.hasAttribute('data-key');
	}

	return parent;
};

export const filterFromPx = (value: string): number =>
	Number(value.split('px')[0]);

export const convertInitialZeroToValueItSelf = (newValue: string) => {
	if (newValue.length > 1 && /^0/.test(newValue)) {
		return newValue.replace(/^0/, '');
	}
	return newValue;
};

const filterResponsiveValues = (
	responsiveState: Responsive,
	gridState: IGrid
): Responsive => {
	return Object.keys(responsiveState).reduce((acc: any, item: any) => {
		Object.keys(responsiveState[item as Device]).forEach((key: string) => {
			// mobile
			if (responsiveState.mobile[key] !== gridState[key as GridKeyType]) {
				if (!acc.mobile) {
					acc.mobile = {};
				}
				acc.mobile[key] = responsiveState.mobile[key];
			}
			// tablet
			if (responsiveState.tablet[key] !== gridState[key as GridKeyType]) {
				if (!acc.tablet) {
					acc.tablet = {};
				}
				acc.tablet[key] = responsiveState.tablet[key];
			}
		});

		return acc;
	}, {}) as Responsive;
};

const filterNonChangedValues = (data: IGrid & ISkeleton) => {
	return Object.keys(data).reduce(
		(acc, item) => {
			type Key = keyof (IGrid & ISkeleton);
			const key = item as Key;

			if (
				(Object.prototype.hasOwnProperty.call(CONTAINER_INITIAL_VALUES, key) &&
					data[key] !==
						CONTAINER_INITIAL_VALUES[
							key as keyof typeof CONTAINER_INITIAL_VALUES
						]) ||
				(Object.prototype.hasOwnProperty.call(SKELETON_INITIAL_VALUES, key) &&
					data[key] !==
						SKELETON_INITIAL_VALUES[
							key as keyof typeof SKELETON_INITIAL_VALUES
						])
			) {
				((acc as IGrid & ISkeleton)[key] as any) = data[key];
			}

			return acc;
		},
		{} satisfies Partial<IGrid & ISkeleton>
	);
};

export const getGridStructure = (
	grid: IGrid | ISkeleton,
	gridState: Record<string, IGrid>,
	skeletonsState: Record<string, ISkeleton>,
	adaptiveDeviceEnabled: boolean
): Record<string, any> => {
	return {
		...filterNonChangedValues(grid),
		...(adaptiveDeviceEnabled && {
			responsive: filterResponsiveValues(grid.responsive!, grid),
		}),
		...(Object.hasOwn(grid, 'children') && {
			children: (grid as IGrid).children!.map((child: string) =>
				getGridStructure(
					gridState[child],
					gridState,
					skeletonsState,
					adaptiveDeviceEnabled
				)
			),
		}),
		...(Object.hasOwn(grid, 'skeletons') && {
			skeletons: (grid as IGrid).skeletons!.map((child: string) =>
				getGridStructure(
					skeletonsState[child],
					gridState,
					skeletonsState,
					adaptiveDeviceEnabled
				)
			),
		}),
	};
};
