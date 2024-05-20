import { ChangeEvent, FC, memo } from 'react';
import { Box, Checkbox } from '@chakra-ui/react';
import { useRecoilState, useRecoilValue } from 'recoil';
import cloneDeep from 'clone-deep';
import {
	selectDeviceState,
	selectHighlightedNodeGridPropState,
	selectHighlightedNodeState,
} from '@/store/selectors/global';
import { gridState } from '@/store/atoms/global';
import { GridKeyType } from '@/common/types';

export const WithOpacity: FC = memo(() => {
	const device = useRecoilValue(selectDeviceState);
	const withOpacity = useRecoilValue(
		selectHighlightedNodeGridPropState('withOpacity')
	);
	const highlightedNode = useRecoilValue(selectHighlightedNodeState);
	const [grid, setGridState] = useRecoilState(gridState);

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
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

		ref.withOpacity = e.target.checked;
		setGridState(_grid);
	};

	return (
		<Box p={4}>
			<Checkbox size="lg" isChecked={withOpacity} onChange={onChange}>
				With opacity
			</Checkbox>
		</Box>
	);
});
