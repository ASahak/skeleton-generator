import { CSSProperties, useCallback, useEffect, useRef } from 'react';
import { Box, useColorMode } from '@chakra-ui/react';
import { useRecoilState, useRecoilValue } from 'recoil';
import parse from 'style-to-object';
import { HighlightPulse } from './highlight-pulse';
import {
	selectGridState,
	selectRootStylesState,
} from '@/store/selectors/global';
import { useConvertStringToStyleObject } from '@/hooks';
import {
	DEFAULT_HEIGHT,
	DEFAULT_WIDTH,
	ROOT_KEY,
	STYLE_PARSING_REGEXP,
} from '@/constants/general-settings';
import { IGrid, ISkeleton } from '@/common/types';
import {
	applicableValue,
	convertCssToReactStyles,
	findTrap,
	generateBorders,
	generateCSSGridArea,
	generateMargin,
	itemsWithRepeat,
	setOpacity,
} from '@/utils/helpers';
import { highlightedNodeState } from '@/store/atoms/global';
import { WithContextMenu } from '@/containers/generator/with-context-menu';

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
	const [highlightedNode, setHighlightedNode] =
		useRecoilState(highlightedNodeState);
	const validStyles = useRef<Record<string, any>>({});
	const isDark = colorMode === 'dark';
	console.log(gridState);
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

	const highlightNode = (e: Event) => {
		const node: HTMLElement | null = e.target as HTMLElement;
		findTrap(node, highlightedNode, (key) => {
			setHighlightedNode(key);
		});
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
			const collectedChildren: Record<string, IGrid> = {};
			let collectedSkeletons: ISkeleton[] = [];
			const gridGap = (grid.gridGap || 0) + 'rem',
				hasChildren =
					Object.hasOwn(grid, 'children') && Array.isArray(grid.children),
				hasSkeletons =
					Object.hasOwn(grid, 'skeletons') && Array.isArray(grid.skeletons),
				repeatCount: number = grid.repeatCount as number;

			if (hasChildren) {
				grid.children!.forEach(
					(key: string) => (collectedChildren[key] = gridState[key] as IGrid)
				);
			}
			if (hasSkeletons) {
				collectedSkeletons = grid.skeletons!.map(
					(key: string) => gridState[key]
				) as ISkeleton[];
			}
			const children = hasChildren
					? itemsWithRepeat(
							Object.values(collectedChildren) as IGrid[],
							repeatCount
						)
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
				<WithContextMenu isAble={keyLevel === highlightedNode} key={keyLevel}>
					<Box
						display="grid"
						data-key={keyLevel}
						style={{
							gap: gridGap,
							margin: generateMargin(grid.margin || ''),
							grid: gridStyle,
							height: reservedPropsFromParent?.parent
								? DEFAULT_HEIGHT
								: applicableValue(
										reservedPropsFromParent?.[keyLevel]?.h ??
											(typeof grid.h === 'function' ? grid.h() : grid.h)
									),
							width: reservedPropsFromParent?.parent
								? DEFAULT_WIDTH
								: applicableValue(
										reservedPropsFromParent?.[keyLevel]?.w ??
											(typeof grid.w === 'function' ? grid.w() : grid.w)
									),
							alignItems: grid.alignItems,
							justifyContent: grid.justifyContent,
							opacity: setOpacity(index, repeatCount, length, withOpacity),
							...convertCssToReactStyles(style),
							...generateBorders({
								keyLevel,
								highlightedNode,
								isDark,
								parent: reservedPropsFromParent?.parent,
								hasChildren,
							}),
						}}
						className={grid.className || ''}
					>
						{hasChildren
							? (Object.keys(collectedChildren) as string[]).map(
									(key, gridItemIndex) =>
										renderGridLayout({
											grid: collectedChildren[key],
											dataKey: key,
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
				</WithContextMenu>
			);
		},
		[gridState, highlightedNode, isDark]
	);

	useEffect(() => {
		validStyles.current = {};
	}, [highlightedNode]);

	return (
		<>
			<Box
				style={convertedStyles as CSSProperties}
				p="1px"
				overflow="hidden"
				onDoubleClick={highlightNode as any}
			>
				{renderGridLayout({
					grid: gridState[ROOT_KEY] as IGrid,
					dataKey: ROOT_KEY,
					index: 0,
					length: 1,
				})}
			</Box>
			<HighlightPulse />
		</>
	);
};
