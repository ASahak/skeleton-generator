import {
	convertToArray,
	MARGIN_SIDES,
	SIZE_UNITS,
	ROOT_KEY,
	CONTAINER_INITIAL_VALUES,
	SKELETON_INITIAL_VALUES,
} from 'react-skeleton-builder';
import type {
	GridKeyType,
	SkeletonKeyType,
	Responsive,
	Device,
} from 'react-skeleton-builder';
import { IGrid, ISkeleton } from '@/common/types';

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

export const generateDefaultValues = (adaptiveDeviceEnabled?: boolean) => {
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
			{
				...(adaptiveDeviceEnabled && {
					responsive: responsiveInstance(CONTAINER_INITIAL_VALUES),
				}),
			}
		);
};

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
				zIndex: 2,
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

export const filterQuotes = (str: string) => {
	return str.replace(/"([^"]+)":/g, '$1:');
};
