import { ChangeEvent, FC, memo, useEffect, useState } from 'react';
import { Box, Heading, Input } from '@chakra-ui/react';
import { useDebounce } from 'react-use';
import { useRecoilState, useRecoilValue } from 'recoil';
import cloneDeep from 'clone-deep';
import {
	DEFAULT_GAP,
	TREE_ELEMENTS_SPACING,
} from '@/constants/general-settings';
import {
	selectDeviceState,
	selectHighlightedNodeGridPropState,
	selectHighlightedNodeState,
} from '@/store/selectors/global';
import { gridState } from '@/store/atoms/global';
import { GridKeyType } from '@/common/types';

export const GridGap: FC = memo(() => {
	const device = useRecoilValue(selectDeviceState);
	const value = useRecoilValue(selectHighlightedNodeGridPropState('gridGap'));
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
			let ref;

			if (device !== 'desktop') {
				ref = obj.responsive[device!];
			} else {
				ref = obj;
			}

			ref.gridGap = localValue;
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

	useEffect(() => {
		setLocalValue(value);
	}, [device]);

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
