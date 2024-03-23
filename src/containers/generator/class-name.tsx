import { ChangeEvent, FC, memo } from 'react';
import { Box, Heading, Input } from '@chakra-ui/react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
	selectHighlightedNodeGridPropState,
	selectHighlightedNodeState,
} from '@/store/selectors/global';
import { gridState } from '@/store/atoms/global';
import { GridKeyType } from '@/common/types';

export const ClassName: FC = memo(() => {
	const value = useRecoilValue(selectHighlightedNodeGridPropState('className'));
	const highlightedNode = useRecoilValue(selectHighlightedNodeState);
	const [grid, setGridState] = useRecoilState(gridState);

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		const _grid = structuredClone(grid);
		const obj: Record<GridKeyType, any> = _grid[highlightedNode] as Record<
			GridKeyType,
			any
		>;

		obj.className = e.target.value;
		setGridState(_grid);
	};

	return (
		<Box p={4}>
			<Heading variant="medium-title" mb={4}>
				className
			</Heading>
			<Input
				variant="base"
				value={value}
				onChange={onChange}
				size="sm"
				type="text"
			/>
		</Box>
	);
});
