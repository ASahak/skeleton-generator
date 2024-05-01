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
	mutateWithRepeated,
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

	const renderSkeletons = (
		skeletons: (ISkeleton & { key: string })[],
		repeatCount: number,
		withOpacity?: boolean,
		parentKey?: string | undefined
	) => {
		return skeletons.map(
			(
				skeleton: ISkeleton & { key: string; isRepeated?: boolean },
				index: number
			) => (
				<WithContextMenu
					isAble={skeleton.key === highlightedNode && !skeleton.isRepeated}
					disabledState={{
						copy: repeatCount > 0,
					}}
					key={skeleton.key}
				>
					<Box
						data-key={skeleton.key}
						style={{
							width: applicableValue(
								(typeof skeleton.w === 'function'
									? (skeleton.w as SizeFunction)()
									: skeleton.w)!.toString()
							),
							height: applicableValue(
								(typeof skeleton.h !== 'function'
									? skeleton.h
									: (skeleton.h as SizeFunction)())!.toString()
							),
							borderRadius: skeleton.r || '0px',
							margin: generateMargin(skeleton.margin || ''),
							backgroundColor: VARIANTS.dark.main, //todo
							opacity: setOpacity(
								index,
								repeatCount,
								skeletons.length,
								withOpacity
							),
							...generateBorders({
								keyLevel: skeleton.key,
								highlightedNode,
								isDark,
								parent: parentKey,
								hasChildren: false,
							}),
						}}
						position="relative"
						overflow="hidden"
						{...(skeleton.isRepeated && {
							'data-repeated-node': true,
							pointerEvents: 'none',
						})}
					>
						{!skeleton.isRepeated ? (
							<Box
								display={skeleton.isRepeated ? 'none' : 'block'}
								left={0}
								position="absolute"
								h="full"
								top={0}
								style={{
									width: `${skeleton.skeletonW || DEFAULT_SKELETON_GRADIENT_WIDTH}px`,
									backgroundImage: `linear-gradient(
                90deg,
                ${VARIANTS.dark.main} 0px,
                ${VARIANTS.dark.gradient} ${(Number(skeleton.skeletonW) || DEFAULT_SKELETON_GRADIENT_WIDTH) / 2}px,
                ${VARIANTS.dark.main} ${skeleton.skeletonW || DEFAULT_SKELETON_GRADIENT_WIDTH}px
              )`,
								}}
							/>
						) : null}
					</Box>
				</WithContextMenu>
			)
		);
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
		if (node?.hasAttribute('data-repeated-node')) return;

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
			const _reservedPropsFromParent: any = {
				parent: keyLevel,
				withOpacity: grid.withOpacity,
			};
			const collectedChildren: (IGrid & { key: string })[] = [];
			const collectedSkeletons: (ISkeleton & { key: string })[] = [];
			const gridGap = (grid.gridGap || 0) + 'rem',
				hasChildren =
					Object.hasOwn(grid, 'children') &&
					Array.isArray(grid.children) &&
					grid.children.length > 0,
				hasSkeletons =
					Object.hasOwn(grid, 'skeletons') &&
					Array.isArray(grid.skeletons) &&
					grid.skeletons.length > 0,
				repeatCount: number = grid.repeatCount as number;

			if (repeatCount > 0) {
				_reservedPropsFromParent.repeatCount = repeatCount;
			}
			if (hasChildren) {
				itemsWithRepeat(grid.children!, repeatCount)
					.map(mutateWithRepeated.bind(null, repeatCount))
					.forEach(
						({
							path,
							key,
							isRepeated,
						}: {
							path: string;
							key: string;
							isRepeated?: boolean;
						}) => {
							collectedChildren.push({
								...(gridState[path] as IGrid),
								key,
								isRepeated: Boolean(isRepeated),
							});
						}
					);
			}
			if (hasSkeletons) {
				itemsWithRepeat(grid.skeletons!, repeatCount)
					.map(mutateWithRepeated.bind(null, repeatCount))
					.forEach(
						({
							path,
							key,
							isRepeated,
						}: {
							path: string;
							key: string;
							isRepeated?: boolean;
						}) => {
							collectedSkeletons.push({
								...(skeletonsState[path] as ISkeleton),
								key,
								isRepeated: Boolean(isRepeated),
							});
						}
					);
			}
			const gridStyle = generateCSSGridArea({
					grid,
					hasChildren,
					children: collectedChildren,
					skeletons: collectedSkeletons,
					repeatCount,
					reservedProps: _reservedPropsFromParent,
					keyLevel,
				}),
				withOpacity = grid.withOpacity,
				style = convertStyles(grid.styles as string) || {};

			return (
				<WithContextMenu
					isAble={keyLevel === highlightedNode && !grid.isRepeated}
					key={keyLevel}
				>
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
							opacity: setOpacity(
								index,
								reservedPropsFromParent?.repeatCount,
								length,
								reservedPropsFromParent?.withOpacity
							),
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
						{...(grid.isRepeated && {
							'data-repeated-node': true,
							pointerEvents: 'none',
						})}
					>
						{hasChildren
							? collectedChildren.map((child, gridItemIndex) =>
									renderGridLayout({
										grid: child,
										dataKey: child.key,
										index: gridItemIndex,
										length: collectedChildren.length,
										reservedPropsFromParent: _reservedPropsFromParent,
									})
								)
							: hasSkeletons
								? renderSkeletons(
										collectedSkeletons,
										repeatCount,
										withOpacity,
										_reservedPropsFromParent.parent
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
