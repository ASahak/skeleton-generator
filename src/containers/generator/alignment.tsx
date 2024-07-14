import { FC, memo } from 'react';
import {
	Box,
	Button,
	Flex,
	Heading,
	Icon,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Portal,
} from '@chakra-ui/react';
import { useRecoilState, useRecoilValue } from 'recoil';
import cloneDeep from 'clone-deep';
import type { GridKeyType } from 'react-skeleton-builder';
import { ALIGN_ITEMS, JUSTIFY_CONTENT } from 'react-skeleton-builder';
import {
	selectDeviceState,
	selectHighlightedNodeGridPropState,
	selectHighlightedNodeState,
} from '@/store/selectors/global';
import { gridState } from '@/store/atoms/global';
import { RiArrowDownSLine } from 'react-icons/ri';
import { useThemeColors } from '@/hooks';

const ALIGN_ITEMS_OPTIONS: Array<{
	label: ALIGN_ITEMS;
	value: ALIGN_ITEMS;
}> = Object.values(ALIGN_ITEMS).map((unit) => ({ label: unit, value: unit }));
const JUSTIFY_CONTENT_OPTIONS: Array<{
	label: JUSTIFY_CONTENT;
	value: JUSTIFY_CONTENT;
}> = Object.values(JUSTIFY_CONTENT).map((unit) => ({
	label: unit,
	value: unit,
}));
export const Alignment: FC = memo(() => {
	const alignItems = useRecoilValue(
		selectHighlightedNodeGridPropState('alignItems')
	);
	const justifyContent = useRecoilValue(
		selectHighlightedNodeGridPropState('justifyContent')
	);
	const device = useRecoilValue(selectDeviceState);
	const highlightedNode = useRecoilValue(selectHighlightedNodeState);
	const [grid, setGridState] = useRecoilState(gridState);
	const { gray100_dark400 } = useThemeColors();

	const onSelectUnit = (
		v: ALIGN_ITEMS | JUSTIFY_CONTENT,
		alignment: 'alignItems' | 'justifyContent'
	) => {
		const _grid = cloneDeep(grid);
		const obj: Record<GridKeyType, any> = _grid[highlightedNode] as Record<
			GridKeyType,
			any
		>;
		let ref;

		if (device !== 'desktop') {
			ref = obj.responsive[device!];
		} else {
			ref = obj;
		}

		ref[alignment] = v;
		setGridState(_grid);
	};

	return (
		<Box p={4}>
			<Flex gap={4}>
				<Box flex={1}>
					<Heading variant="medium-title" mb={4}>
						AlignItems
					</Heading>
					<Menu variant="base" placement="bottom-end" matchWidth>
						<MenuButton
							as={Button}
							w="full"
							textAlign="left"
							px={2}
							size="sm"
							rightIcon={<Icon fontSize="1.6rem" as={RiArrowDownSLine} />}
							variant="menu-outline"
							gap={0}
						>
							{alignItems}
						</MenuButton>
						<Portal>
							<MenuList
								minW="xss"
								maxH="20rem"
								overflowX="hidden"
								className="custom-scrollbar-content"
								sx={{
									'&::-webkit-scrollbar-track': {
										backgroundColor: gray100_dark400,
									},
								}}
							>
								{ALIGN_ITEMS_OPTIONS.map((unit) => (
									<MenuItem
										as={Button}
										size="sm"
										key={unit.value}
										onClick={() => onSelectUnit(unit.value, 'alignItems')}
										gap={2}
										{...(alignItems === unit.value
											? {
													bgColor: 'brand.500 !important',
													color: 'white !important',
													_hover: {
														bgColor: 'brand.500 !important',
														color: 'white !important',
													},
												}
											: { bgColor: 'transparent' })}
									>
										{unit.label}
									</MenuItem>
								))}
							</MenuList>
						</Portal>
					</Menu>
				</Box>
				<Box flex={1}>
					<Heading variant="medium-title" mb={4}>
						JustifyContent
					</Heading>
					<Menu variant="base" placement="bottom-end" matchWidth>
						<MenuButton
							as={Button}
							w="full"
							textAlign="left"
							px={2}
							size="sm"
							rightIcon={<Icon fontSize="1.6rem" as={RiArrowDownSLine} />}
							variant="menu-outline"
							gap={0}
						>
							{justifyContent}
						</MenuButton>
						<Portal>
							<MenuList
								minW="xss"
								maxH="20rem"
								overflowX="hidden"
								className="custom-scrollbar-content"
								sx={{
									'&::-webkit-scrollbar-track': {
										backgroundColor: gray100_dark400,
									},
								}}
							>
								{JUSTIFY_CONTENT_OPTIONS.map((unit) => (
									<MenuItem
										as={Button}
										size="sm"
										key={unit.value}
										onClick={() => onSelectUnit(unit.value, 'justifyContent')}
										gap={2}
										{...(justifyContent === unit.value
											? {
													bgColor: 'brand.500 !important',
													color: 'white !important',
													_hover: {
														bgColor: 'brand.500 !important',
														color: 'white !important',
													},
												}
											: { bgColor: 'transparent' })}
									>
										{unit.label}
									</MenuItem>
								))}
							</MenuList>
						</Portal>
					</Menu>
				</Box>
			</Flex>
		</Box>
	);
});
