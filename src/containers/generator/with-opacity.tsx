import { ChangeEvent, FC } from 'react';
import { Box, Checkbox } from '@chakra-ui/react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
	selectHighlightedNodeGridPropState,
	selectHighlightedNodeState,
} from '@/store/selectors/global';
import { gridState } from '@/store/atoms/global';
import { GridKeyType } from '@/common/types';

export const WithOpacity: FC = () => {
	const withOpacity = useRecoilValue(
		selectHighlightedNodeGridPropState('withOpacity')
	);
	const highlightedNode = useRecoilValue(selectHighlightedNodeState);
	const [grid, setGridState] = useRecoilState(gridState);

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		const _grid = structuredClone(grid);
		const obj: Record<GridKeyType, any> = _grid[highlightedNode] as Record<
			GridKeyType,
			any
		>;

		obj.withOpacity = e.target.checked;
		setGridState(_grid);
	};

	return (
		<Box p={4}>
			<Checkbox size="lg" isChecked={withOpacity} onChange={onChange}>
				With opacity
			</Checkbox>
		</Box>
	);
};
