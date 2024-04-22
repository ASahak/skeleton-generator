import { FC, memo } from 'react';
import {
	Box,
	Button,
	Heading,
	Icon,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
} from '@chakra-ui/react';
import cloneDeep from 'clone-deep';
import { RiArrowDownSLine } from 'react-icons/ri';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
	selectHighlightedNodeGridPropState,
	selectHighlightedNodeState,
} from '@/store/selectors/global';
import { gridState } from '@/store/atoms/global';
import { GridKeyType } from '@/common/types';
import { DIRECTION } from '@/common/enums';

const OPTIONS = Object.values(DIRECTION)
	.filter((v) => isNaN(Number(v)))
	.map((e) => ({ label: e, value: e }));
export const Direction: FC = memo(() => {
	const value = useRecoilValue(selectHighlightedNodeGridPropState('direction'));
	const highlightedNode = useRecoilValue(selectHighlightedNodeState);
	const [grid, setGridState] = useRecoilState(gridState);

	const onSelect = (value: DIRECTION) => {
		const _grid = cloneDeep(grid);
		const obj: Record<GridKeyType, any> = _grid[highlightedNode] as Record<
			GridKeyType,
			any
		>;

		obj.direction = value;
		setGridState(_grid);
	};

	return (
		<Box p={4}>
			<Heading variant="medium-title" mb={4}>
				Direction
			</Heading>
			<Menu variant="base">
				<MenuButton
					as={Button}
					w="full"
					textAlign="left"
					size="sm"
					rightIcon={<Icon fontSize="1.6rem" as={RiArrowDownSLine} />}
					variant="menu-outline"
					gap={2}
				>
					{value}
				</MenuButton>
				<MenuList minW="20rem">
					{OPTIONS.map((opt) => (
						<MenuItem
							as={Button}
							size="sm"
							variant="dropdown-item"
							key={opt.value}
							onClick={() => onSelect(opt.value)}
							bgColor="transparent"
							gap={2}
							{...(value === opt.value && {
								bgColor: 'brand.500 !important',
								color: 'white !important',
							})}
						>
							{opt.label}
						</MenuItem>
					))}
				</MenuList>
			</Menu>
		</Box>
	);
});
