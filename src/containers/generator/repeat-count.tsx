import { ChangeEvent, FC, useState, memo, useMemo } from 'react';
import { Box, Heading, Input } from '@chakra-ui/react';
import { useDebounce } from 'react-use';
import cloneDeep from 'clone-deep';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
	DEFAULT_REPEAT_COUNT,
	REPEAT_COUNT_RANGE,
} from '@/constants/general-settings';
import {
	selectHighlightedNodeGridPropState,
	selectHighlightedNodeState,
} from '@/store/selectors/global';
import { gridState } from '@/store/atoms/global';
import { GridKeyType } from '@/common/types';

export const RepeatCount: FC = memo(() => {
	const value = useRecoilValue(
		selectHighlightedNodeGridPropState('repeatCount')
	);
	const highlightedNode = useRecoilValue(selectHighlightedNodeState);
	const [grid, setGridState] = useRecoilState(gridState);
	const [localValue, setLocalValue] = useState(value);

	useDebounce(
		() => {
			const _grid = cloneDeep(grid);
			const obj: Record<GridKeyType, any> = _grid[highlightedNode] as Record<
				GridKeyType,
				any
			>;
			obj.repeatCount = localValue;
			setGridState(_grid);
		},
		300,
		[localValue]
	);

	const isDisabled = useMemo(() => {
		if (Object.hasOwn(grid[highlightedNode], 'children')) {
			return grid[highlightedNode].children!.length !== 1;
		} else if (Object.hasOwn(grid[highlightedNode], 'skeletons')) {
			return grid[highlightedNode].skeletons!.length !== 1;
		}

		return true;
	}, [highlightedNode, grid]);

	const onBlur = () => {
		if (!localValue) {
			setLocalValue(DEFAULT_REPEAT_COUNT);
		} else {
			setLocalValue(parseInt(localValue));
		}
	};

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.value) {
			setLocalValue('');
			return;
		}

		const v = parseInt(e.target.value);
		if (v < REPEAT_COUNT_RANGE.MIN || v > REPEAT_COUNT_RANGE.MAX) {
			return;
		}
		setLocalValue(v);
	};

	return (
		<Box p={4}>
			<Heading variant="medium-title" mb={4}>
				Repeat count
			</Heading>
			<Input
				disabled={isDisabled}
				readOnly={isDisabled}
				variant="base"
				value={localValue}
				onChange={onChange}
				size="sm"
				onBlur={onBlur}
				type="text"
			/>
		</Box>
	);
});
