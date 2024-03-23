import { CSSProperties, useCallback, useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import parse from 'style-to-object';
import {
	selectGridState,
	selectHighlightedNodeState,
	selectRootStylesState,
} from '@/store/selectors/global';
import { useConvertStringToStyleObject } from '@/hooks';
import { ROOT_KEY, STYLE_PARSING_REGEXP } from '@/constants/general-settings';
import { IGrid, ISkeleton } from '@/common/types';
import {
	convertCssToReactStyles,
	generateCSSGridArea,
	generateMargin,
	itemsWithRepeat,
	setOpacity,
} from '@/utils/helpers';

interface IGridLayout {
	grid: IGrid;
	dataKey: string;
	index: number;
	length: number;
	reservedProps?: Record<string, any>;
}

export const GridLayout = () => {
	const gridState = useRecoilValue(selectGridState);
	const rootStyles = useRecoilValue(selectRootStylesState);
	const convertedStyles = useConvertStringToStyleObject(rootStyles);
	const highlightedNode = useRecoilValue(selectHighlightedNodeState);
	const validStyles = useRef<Record<string, any>>({});

	const renderSkeletons = (skeleton: ISkeleton) => {
		console.log(skeleton);
		return <Box></Box>;
	};

	const convertStyles = (styles: string) => {
		try {
			if (styles.replace(/\s/g, '') === '{}') {
				validStyles.current = {};
				return validStyles.current;
			}
			const converted = parse(styles.replace(STYLE_PARSING_REGEXP, ''));
			if (converted) {
				// should remove all margins to avoid duplication because in the options already have that option
				Object.keys(converted).forEach((e: string) => {
					if (e.includes('margin')) {
						delete converted[e];
					}
				});
				validStyles.current = converted;
				return validStyles.current;
			}
		} catch {
			return validStyles.current;
		}
	};

	const renderGridLayout = useCallback(
		({ grid, dataKey, index, length, reservedProps }: IGridLayout) => {
			const keyLevel = dataKey;
			const _reservedProps: any = {};
			const gridGap = (grid.gridGap || 0) + 'rem',
				hasChildren =
					Object.hasOwn(grid, 'children') && Array.isArray(grid.children),
				hasSkeletons =
					Object.hasOwn(grid, 'skeletons') && Array.isArray(grid.skeletons),
				repeatCount: number = grid.repeatCount as number,
				children = hasChildren
					? itemsWithRepeat(grid.children as IGrid[], repeatCount)
					: [],
				gridStyle = generateCSSGridArea({
					grid,
					hasChildren,
					children,
					repeatCount,
					reservedProps: _reservedProps,
					keyLevel,
				}),
				withOpacity = grid.withOpacity,
				style = convertStyles(grid.styles as string) || {};

			return (
				<Box
					display="grid"
					data-key={keyLevel}
					key={keyLevel}
					style={{
						gap: gridGap,
						margin: generateMargin(grid.margin || ''),
						grid: gridStyle,
						height:
							reservedProps?.[keyLevel]?.h ??
							(typeof grid.h === 'function' ? grid.h() : grid.h),
						width:
							reservedProps?.[keyLevel]?.w ??
							(typeof grid.w === 'function' ? grid.w() : grid.w),
						alignItems: grid.alignItems,
						justifyContent: grid.justifyContent,
						opacity: setOpacity(index, repeatCount, length, withOpacity),
						...convertCssToReactStyles(style),
					}}
					className={grid.className || ''}
				>
					{hasChildren
						? (grid.children as IGrid[]).map((g, gridItemIndex) =>
								renderGridLayout({
									grid: g,
									dataKey: `${keyLevel}_${gridItemIndex}`,
									index: gridItemIndex,
									length: children.length,
									reservedProps: _reservedProps,
								})
							)
						: hasSkeletons
							? (grid.skeletons as ISkeleton[]).map((s) => renderSkeletons(s))
							: null}
				</Box>
			);
		},
		[]
	);

	useEffect(() => {
		validStyles.current = {};
	}, [highlightedNode]);

	return (
		<Box
			style={convertedStyles as CSSProperties}
			border="1px dashed"
			borderColor="brand.500"
			overflow="hidden"
		>
			{renderGridLayout({
				grid: gridState[ROOT_KEY] as IGrid,
				dataKey: ROOT_KEY,
				index: 0,
				length: 1,
			})}
		</Box>
	);
};
