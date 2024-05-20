import { ChangeEvent, FC, memo, useEffect, useState } from 'react';
import { Box, Heading, Input } from '@chakra-ui/react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useDebounce } from 'react-use';
import cloneDeep from 'clone-deep';
import {
	selectDeviceState,
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
	const device = useRecoilValue(selectDeviceState);

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

			ref.className = localValue;
			setGridState(_grid);
		},
		300,
		[localValue]
	);

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setLocalValue(e.target.value);
	};

	useEffect(() => {
		setLocalValue(value);
	}, [device]);

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
