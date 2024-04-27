import { CSSProperties, useCallback, useEffect, useRef } from 'react';
import { Box, useColorMode } from '@chakra-ui/react';
import { useRecoilState, useRecoilValue } from 'recoil';
import parse from 'style-to-object';
import { HighlightPulse } from './highlight-pulse';
import {
	selectGridState,
	selectRootStylesState,
	selectSkeletonsState,
} from '@/store/selectors/global';
import { useConvertStringToStyleObject } from '@/hooks';
import {
	DEFAULT_HEIGHT,
	DEFAULT_SKELETON_GRADIENT_WIDTH,
	DEFAULT_WIDTH,
	ROOT_KEY,
	STYLE_PARSING_REGEXP,
	VARIANTS,
} from '@/constants/general-settings';
import { IGrid, ISkeleton, SizeFunction } from '@/common/types';
import {
	applicableValue,
	convertCssToReactStyles,
	findTrap,
	generateBorders,
	generateCSSGridArea,
	generateMargin,
	getDirectParentWithDataKeyAttr,
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
	const skeletonsState = useRecoilValue(selectSkeletonsState);
	const rootStyles = useRecoilValue(selectRootStylesState);
	const convertedStyles = useConvertStringToStyleObject(rootStyles);
	const [highlightedNode, setHighlightedNode] =
		useRecoilState(highlightedNodeState);
	const validStyles = useRef<Record<string, any>>({});
	const isDark = colorMode === 'dark';
	console.log(highlightedNode, gridState, skeletonsState);
	const renderSkeletons = (
		skeletons: Record<string, ISkeleton>,
		repeatCount: number,
		withOpacity?: boolean,
		reservedPropsFromParent?: Record<string, any>
	) => {
		const skeletonKeys = Object.keys(skeletons);
		return skeletonKeys.map((key, index) => (
			<WithContextMenu isAble={key === highlightedNode} key={key}>
				<Box
					data-key={key}
					key={key}
					style={{
						width: reservedPropsFromParent?.parent
							? DEFAULT_WIDTH
							: applicableValue(
									(typeof skeletons[key].w === 'function'
										? (skeletons[key].w as SizeFunction)()
										: skeletons[key].w)!.toString()
								),
						height: reservedPropsFromParent?.parent
							? DEFAULT_HEIGHT
							: applicableValue(
									(typeof skeletons[key].h !== 'function'
										? skeletons[key].h
										: (skeletons[key].h as SizeFunction)())!.toString()
								),
						borderRadius: skeletons[key].r || '0px',
						margin: generateMargin(skeletons[key].margin || ''),
						backgroundColor: VARIANTS.dark.main, //todo
						opacity: setOpacity(
							index,
							repeatCount,
							skeletonKeys.length,
							withOpacity
						),
						...generateBorders({
							keyLevel: key,
							highlightedNode,
							isDark,
							hasChildren: false,
						}),
					}}
					position="relative"
					overflow="hidden"
				>
					<Box
						left={0}
						position="absolute"
						h="full"
						top={0}
						style={{
							width: `${skeletons[key].skeletonW || DEFAULT_SKELETON_GRADIENT_WIDTH}px`,
							backgroundImage: `linear-gradient(
                90deg,
                ${VARIANTS.dark.main} 0px,
                ${VARIANTS.dark.gradient} ${(Number(skeletons[key].skeletonW) || DEFAULT_SKELETON_GRADIENT_WIDTH) / 2}px,
                ${VARIANTS.dark.main} ${skeletons[key].skeletonW || DEFAULT_SKELETON_GRADIENT_WIDTH}px
              )`,
						}}
					/>
				</Box>
			</WithContextMenu>
		));
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
		const node: HTMLElement | null = getDirectParentWithDataKeyAttr(
			e.target as HTMLElement
		);
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
			const collectedSkeletons: Record<string, ISkeleton> = {};
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
				grid.skeletons!.forEach(
					(key: string) =>
						(collectedSkeletons[key] = skeletonsState[key] as ISkeleton)
				);
			}
			const children = hasChildren
					? itemsWithRepeat(
							Object.values(collectedChildren) as IGrid[],
							repeatCount
						)
					: [],
				skeletons = hasSkeletons
					? itemsWithRepeat(
							Object.values(collectedSkeletons) as ISkeleton[],
							repeatCount
						)
					: [],
				gridStyle = generateCSSGridArea({
					grid,
					hasChildren,
					children,
					skeletons,
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
								? renderSkeletons(
										collectedSkeletons,
										repeatCount,
										withOpacity,
										_reservedPropsFromParent
									)
								: null}
					</Box>
				</WithContextMenu>
			);
		},
		[gridState, skeletonsState, highlightedNode, isDark]
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
