import { FC } from 'react';
import {
	Tooltip,
	Menu,
	MenuButton,
	Button,
	MenuList,
	MenuItem,
	Icon,
} from '@chakra-ui/react';
import { RiLayout2Fill, RiRectangleLine, RiAddFill } from 'react-icons/ri';
import { useRecoilState, useRecoilValue } from 'recoil';
import { selectHighlightedNodeState } from '@/store/selectors/global';
import { gridState } from '@/store/atoms/global';
import { GridKeyType } from '@/common/types';
import { findAbsentIndex, generateDefaultValues } from '@/utils/helpers';
import { ROOT_KEY } from '@/constants/general-settings';

const OPTIONS = [
	{
		label: 'Create Container',
		value: 'create-children',
		icon: RiRectangleLine,
	},
	{ label: 'Create Skeleton', value: 'create-skeleton', icon: RiLayout2Fill },
];
export const HighlightedNode: FC = () => {
	const highlightedNode = useRecoilValue(selectHighlightedNodeState);
	const [grid, setGridState] = useRecoilState(gridState);

	const onSelect = (value: string) => {
		if (value === 'create-children') {
			const _grid = structuredClone(grid);
			const obj: Record<GridKeyType, any> = _grid[highlightedNode] as Record<
				GridKeyType,
				any
			>;
			const newKey =
				highlightedNode +
				'_' +
				findAbsentIndex(ROOT_KEY.split('1')[0], obj.children || []);
			_grid[newKey] = { ...generateDefaultValues() };
			obj.children = (obj.children || []).concat(newKey);
			setGridState(_grid);
		}
	};

	return (
		<Menu variant="base">
			<Tooltip
				motionProps={{ borderRadius: 4 } as never}
				hasArrow
				label="Highlighted Node"
				placement="right"
				variant="base"
			>
				<MenuButton
					as={Button}
					rightIcon={<Icon fontSize="1.6rem" as={RiAddFill} />}
					variant="menu-outline"
					gap={2}
				>
					{highlightedNode}
				</MenuButton>
			</Tooltip>
			<MenuList minW="20rem">
				{OPTIONS.map((opt) => (
					<MenuItem
						as={Button}
						variant="dropdown-item"
						key={opt.value}
						onClick={() => onSelect(opt.value)}
						bgColor="transparent"
						gap={2}
					>
						<Icon fontSize="1.6rem" as={opt.icon} /> {opt.label}
					</MenuItem>
				))}
			</MenuList>
		</Menu>
	);
};
