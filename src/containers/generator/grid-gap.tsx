import { ChangeEvent, FC, memo } from 'react';
import { Box, Heading, Input } from '@chakra-ui/react';
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

	const onBlur = (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.value) {
			const _grid = structuredClone(grid);
			const obj: Record<GridKeyType, any> = _grid[highlightedNode] as Record<
				GridKeyType,
				any
			>;
			obj.gridGap = DEFAULT_GAP;
			setGridState(_grid);
		}
	};

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		const _grid = structuredClone(grid);
		const obj: Record<GridKeyType, any> = _grid[highlightedNode] as Record<
			GridKeyType,
			any
		>;

		if (!e.target.value) {
			obj.gridGap = '';
			setGridState(_grid);
			return;
		}

		const v = Number(e.target.value);
		if (v > TREE_ELEMENTS_SPACING.MAX || v < TREE_ELEMENTS_SPACING.MIN) {
			return;
		}
		obj.gridGap = v.toString();
		setGridState(_grid);
	};

	return (
		<Box p={4}>
			<Heading variant="medium-title" mb={4}>
				Grid Gap (REM)
			</Heading>
			<Input
				variant="base"
				value={value}
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
