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
import type { GridKeyType } from 'react-skeleton-builder';
import { DIRECTION } from 'react-skeleton-builder';
import {
	selectDeviceState,
	selectHighlightedNodeGridPropState,
	selectHighlightedNodeState,
} from '@/store/selectors/global';
import { gridState } from '@/store/atoms/global';

const OPTIONS = Object.values(DIRECTION)
	.filter((v) => isNaN(Number(v)))
	.map((e) => ({ label: e, value: e }));
export const Direction: FC = memo(() => {
	const device = useRecoilValue(selectDeviceState);
	const value = useRecoilValue(selectHighlightedNodeGridPropState('direction'));
	const highlightedNode = useRecoilValue(selectHighlightedNodeState);
	const [grid, setGridState] = useRecoilState(gridState);

	const onSelect = (value: DIRECTION) => {
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

		ref.direction = value;
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
							key={opt.value}
							onClick={() => onSelect(opt.value)}
							gap={2}
							{...(value === opt.value
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
							{opt.label}
						</MenuItem>
					))}
				</MenuList>
			</Menu>
		</Box>
	);
});
