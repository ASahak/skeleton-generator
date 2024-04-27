import { FC, memo } from 'react';
import {
	Menu,
	MenuButton,
	Button,
	MenuList,
	MenuItem,
	Icon,
	Box,
	Popover,
	PopoverTrigger,
	Portal,
	PopoverContent,
	PopoverBody,
} from '@chakra-ui/react';
import cloneDeep from 'clone-deep';
import { RiLayout2Fill, RiRectangleLine } from 'react-icons/ri';
import { RxTriangleDown } from 'react-icons/rx';
import { useRecoilState, useRecoilValue } from 'recoil';
import { selectHighlightedNodeState } from '@/store/selectors/global';
import { gridState, skeletonsState } from '@/store/atoms/global';
import { GridKeyType } from '@/common/types';
import { findAbsentIndex, generateDefaultValues } from '@/utils/helpers';
import { GridTree } from '@/components/header/grid-tree';
import { SKELETON_INITIAL_VALUES } from '@/constants/general-settings';

const OPTIONS = [
	{
		label: 'Create Container',
		value: 'create-container',
		icon: RiRectangleLine,
	},
	{ label: 'Create Skeleton', value: 'create-skeleton', icon: RiLayout2Fill },
];
export const HighlightedNode: FC = memo(() => {
	const highlightedNode = useRecoilValue(selectHighlightedNodeState);
	const [grid, setGridState] = useRecoilState(gridState);
	const [skeletons, setSkeletonsState] = useRecoilState(skeletonsState);

	const isContainer =
		!Object.hasOwn(skeletons, highlightedNode) &&
		Object.hasOwn(grid, highlightedNode);

	const disableContainerCreation = (type: string) => {
		if (
			Object.hasOwn(
				(grid[highlightedNode] as Record<GridKeyType, any>) || {},
				'skeletons'
			) &&
			type === 'create-container'
		) {
			return true;
		}
	};

	const disableSkeletonCreation = (type: string) => {
		if (
			Object.hasOwn(
				(grid[highlightedNode] as Record<GridKeyType, any>) || {},
				'children'
			) &&
			type === 'create-skeleton'
		) {
			return true;
		}
	};

	const onSelect = (value: string) => {
		const _grid = cloneDeep(grid);
		const obj: Record<GridKeyType, any> = _grid[highlightedNode] as Record<
			GridKeyType,
			any
		>;
		if (value === 'create-container') {
			const newRoot = highlightedNode + '_';
			const newKey = newRoot + findAbsentIndex(newRoot, obj.children || []);
			_grid[newKey] = { ...generateDefaultValues() };
			obj.children = (obj.children || []).concat(newKey);
		} else {
			const _skeletons = cloneDeep(skeletons);
			const newRoot = highlightedNode + '_skeleton_';
			const newKey = newRoot + findAbsentIndex(newRoot, obj.skeletons || []);
			obj.skeletons = (obj.skeletons || []).concat(newKey);
			_skeletons[newKey] = { ...SKELETON_INITIAL_VALUES };
			setSkeletonsState(_skeletons);
		}
		setGridState(_grid);
	};

	return (
		<Box display="flex" alignItems="center">
			<Popover placement="bottom-start" variant="base" isLazy>
				<PopoverTrigger>
					<Button
						variant="menu-outline"
						{...(isContainer && {
							borderTopRightRadius: 0,
							borderBottomRightRadius: 0,
						})}
					>
						{highlightedNode}
					</Button>
				</PopoverTrigger>
				<Portal>
					<PopoverContent minW="20rem">
						<PopoverBody p={0}>
							<GridTree />
						</PopoverBody>
					</PopoverContent>
				</Portal>
			</Popover>
			{isContainer ? (
				<Menu variant="base" placement="bottom-end">
					<MenuButton
						as={Button}
						borderTopLeftRadius={0}
						borderBottomLeftRadius={0}
						ml="-1px"
						px="1rem"
						variant="menu-outline"
						gap={2}
					>
						<Icon as={RxTriangleDown} fontSize="1.8rem" />
					</MenuButton>
					<MenuList minW="20rem">
						{OPTIONS.map((opt) => (
							<MenuItem
								isDisabled={
									disableContainerCreation(opt.value) ||
									disableSkeletonCreation(opt.value)
								}
								key={opt.value}
								onClick={() => onSelect(opt.value)}
								gap={2}
							>
								<Icon fontSize="1.6rem" as={opt.icon} /> {opt.label}
							</MenuItem>
						))}
					</MenuList>
				</Menu>
			) : null}
		</Box>
	);
});
