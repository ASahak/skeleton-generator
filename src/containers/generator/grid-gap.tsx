import { ChangeEvent, FC, memo, useState } from 'react';
import { Box, Heading, Input } from '@chakra-ui/react';
import { useDebounce } from 'react-use';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
	DEFAULT_GAP,
	TREE_ELEMENTS_SPACING,
} from '@/constants/general-settings';
import {
	selectHighlightedNodeGridPropState,
	selectHighlightedNodeState,
} from '@/store/selectors/global';
import { gridState } from '@/store/atoms/global';
import { GridKeyType } from '@/common/types';

export const GridGap: FC = memo(() => {
	const value = useRecoilValue(selectHighlightedNodeGridPropState('gridGap'));
	const highlightedNode = useRecoilValue(selectHighlightedNodeState);
	const [grid, setGridState] = useRecoilState(gridState);
	const [localValue, setLocalValue] = useState(value);

	useDebounce(
		() => {
			const _grid = structuredClone(grid);
			const obj: Record<GridKeyType, any> = _grid[highlightedNode] as Record<
				GridKeyType,
				any
			>;
			obj.gridGap = localValue;
			setGridState(_grid);
		},
		300,
		[localValue]
	);

	const onBlur = (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.value) {
			setLocalValue(DEFAULT_GAP);
		}
	};

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.value) {
			setLocalValue('');
			return;
		}

		const v = Number(e.target.value);
		if (v > TREE_ELEMENTS_SPACING.MAX || v < TREE_ELEMENTS_SPACING.MIN) {
			return;
		}
		setLocalValue(v.toString());
	};

	return (
		<Box p={4}>
			<Heading variant="medium-title" mb={4}>
				Grid Gap (REM)
			</Heading>
			<Input
				variant="base"
				value={localValue}
				onChange={onChange}
				size="sm"
				onBlur={onBlur}
				type="number"
				max={TREE_ELEMENTS_SPACING.MAX}
				min={TREE_ELEMENTS_SPACING.MIN}
			/>
		</Box>
	);
});
