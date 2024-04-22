import { ChangeEvent, FC, memo, useState } from 'react';
import { Box, Heading, Input } from '@chakra-ui/react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useDebounce } from 'react-use';
import cloneDeep from 'clone-deep';
import {
	selectHighlightedNodeGridPropState,
	selectHighlightedNodeState,
} from '@/store/selectors/global';
import { gridState } from '@/store/atoms/global';
import { GridKeyType } from '@/common/types';

export const ClassName: FC = memo(() => {
	const value = useRecoilValue(selectHighlightedNodeGridPropState('className'));
	const [localValue, setLocalValue] = useState(value);
	const highlightedNode = useRecoilValue(selectHighlightedNodeState);
	const [grid, setGridState] = useRecoilState(gridState);

	useDebounce(
		() => {
			const _grid = cloneDeep(grid);
			const obj: Record<GridKeyType, any> = _grid[highlightedNode] as Record<
				GridKeyType,
				any
			>;
			obj.className = localValue;
			setGridState(_grid);
		},
		300,
		[localValue]
	);

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setLocalValue(e.target.value);
	};

	return (
		<Box p={4}>
			<Heading variant="medium-title" mb={4}>
				className
			</Heading>
			<Input
				variant="base"
				value={localValue}
				onChange={onChange}
				size="sm"
				type="text"
			/>
		</Box>
	);
});
