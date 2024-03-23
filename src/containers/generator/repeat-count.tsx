import { ChangeEvent, FC, useState, memo } from 'react';
import { Box, Heading, Input } from '@chakra-ui/react';
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
	const [inputVal, setInputVal] = useState(value);
	const highlightedNode = useRecoilValue(selectHighlightedNodeState);
	const [grid, setGridState] = useRecoilState(gridState);

	const onBlur = () => {
		const _grid = structuredClone(grid);
		const obj: Record<GridKeyType, any> = _grid[highlightedNode] as Record<
			GridKeyType,
			any
		>;
		if (!inputVal) {
			obj.repeatCount = DEFAULT_REPEAT_COUNT;
			setGridState(_grid);
		} else {
			obj.repeatCount = parseInt(inputVal);
			setGridState(_grid);
		}
		setInputVal(obj.repeatCount);
	};

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.value) {
			setInputVal('');
			return;
		}

		const v = parseInt(e.target.value);
		if (v < REPEAT_COUNT_RANGE.MIN || v > REPEAT_COUNT_RANGE.MAX) {
			return;
		}
		setInputVal(v);
	};

	return (
		<Box p={4}>
			<Heading variant="medium-title" mb={4}>
				Repeat count
			</Heading>
			<Input
				variant="base"
				value={inputVal}
				onChange={onChange}
				size="sm"
				onBlur={onBlur}
				type="text"
			/>
		</Box>
	);
});
