import { CSSProperties, useCallback, useEffect, useRef } from 'react';
import { Box, useColorMode } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import parse from 'style-to-object';
import { HighlightPulse } from './highlight-pulse';
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
	generateBorders,
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
	reservedPropsFromParent?: Record<string, any>;
}

export const GridLayout = () => {
	const { colorMode } = useColorMode();
	const gridState = useRecoilValue(selectGridState);
	const rootStyles = useRecoilValue(selectRootStylesState);
	const convertedStyles = useConvertStringToStyleObject(rootStyles);
	const highlightedNode = useRecoilValue(selectHighlightedNodeState);
	const validStyles = useRef<Record<string, any>>({});
	const isDark = colorMode === 'dark';

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
		({
			grid,
			dataKey,
			index,
			length,
			reservedPropsFromParent,
		}: IGridLayout) => {
			const keyLevel = dataKey;
			const _reservedPropsFromParent: any = { parent: keyLevel };
			let collectedChildren: IGrid[] = [];
			let collectedSkeletons: ISkeleton[] = [];
			const gridGap = (grid.gridGap || 0) + 'rem',
				hasChildren =
					Object.hasOwn(grid, 'children') && Array.isArray(grid.children),
				hasSkeletons =
					Object.hasOwn(grid, 'skeletons') && Array.isArray(grid.skeletons),
				repeatCount: number = grid.repeatCount as number;

			if (hasChildren) {
				collectedChildren = grid.children!.map(
					(key: string) => gridState[key]
				) as IGrid[];
			}
			if (hasSkeletons) {
				collectedSkeletons = grid.skeletons!.map(
					(key: string) => gridState[key]
				) as ISkeleton[];
			}
			const children = hasChildren
					? itemsWithRepeat(collectedChildren as IGrid[], repeatCount)
					: [],
				gridStyle = generateCSSGridArea({
					grid,
					hasChildren,
					children,
					skeletons: collectedSkeletons,
					repeatCount,
					reservedProps: _reservedPropsFromParent,
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
							reservedPropsFromParent?.[keyLevel]?.h ??
							(typeof grid.h === 'function' ? grid.h() : grid.h),
						width:
							reservedPropsFromParent?.[keyLevel]?.w ??
							(typeof grid.w === 'function' ? grid.w() : grid.w),
						alignItems: grid.alignItems,
						justifyContent: grid.justifyContent,
						opacity: setOpacity(index, repeatCount, length, withOpacity),
						...convertCssToReactStyles(style),
						...generateBorders({
							keyLevel,
							highlightedNode,
							isDark,
							parent: reservedPropsFromParent?.parent,
						}),
					}}
					className={grid.className || ''}
				>
					{hasChildren
						? (collectedChildren as IGrid[]).map((g, gridItemIndex) =>
								renderGridLayout({
									grid: g,
									dataKey: `${keyLevel}_${gridItemIndex + 1}`,
									index: gridItemIndex,
									length: children.length,
									reservedPropsFromParent: _reservedPropsFromParent,
								})
							)
						: hasSkeletons
							? (collectedSkeletons as ISkeleton[]).map((s) =>
									renderSkeletons(s)
								)
							: null}
				</Box>
			);
		},
		[gridState, highlightedNode, isDark]
	);

	useEffect(() => {
		validStyles.current = {};
	}, [highlightedNode]);

	return (
		<>
			<HighlightPulse />
			<Box style={convertedStyles as CSSProperties} p="1px" overflow="hidden">
				{renderGridLayout({
					grid: gridState[ROOT_KEY] as IGrid,
					dataKey: ROOT_KEY,
					index: 0,
					length: 1,
				})}
			</Box>
		</>
	);
};
