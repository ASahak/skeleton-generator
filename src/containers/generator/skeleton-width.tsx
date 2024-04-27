import { ChangeEvent, FC, memo, useState } from 'react';
import { Box, Heading, Input, Text } from '@chakra-ui/react';
import { useDebounce } from 'react-use';
import { useRecoilState, useRecoilValue } from 'recoil';
import cloneDeep from 'clone-deep';
import {
	selectHighlightedNodeGridPropState,
	selectHighlightedNodeState,
} from '@/store/selectors/global';
import { skeletonsState } from '@/store/atoms/global';
import { SkeletonKeyType } from '@/common/types';
import { useThemeColors } from '@/hooks';

export const SkeletonWidth: FC = memo(() => {
	const skeletonW = useRecoilValue(
		selectHighlightedNodeGridPropState('skeletonW')
	);
	const highlightedNode = useRecoilValue(selectHighlightedNodeState);
	const [skeletons, setSkeletonsState] = useRecoilState(skeletonsState);
	const [localValue, setLocalValue] = useState(skeletonW);
	const { gray100_dark400 } = useThemeColors();

	useDebounce(
		() => {
			const _skeletons = cloneDeep(skeletons);
			const obj: Record<SkeletonKeyType, any> = _skeletons[
				highlightedNode
			] as Record<SkeletonKeyType, any>;
			obj.skeletonW = localValue;
			setSkeletonsState(_skeletons);
		},
		300,
		[localValue]
	);

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value ?? '';
		setLocalValue(newValue);
	};

	return (
		<Box p={4}>
			<Heading variant="medium-title" mb={4}>
				Skeleton&apos;s gradient width
			</Heading>
			<Input
				borderColor={!localValue ? 'red.400' : gray100_dark400}
				variant="base"
				value={localValue}
				onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e)}
				size="sm"
				type="number"
			/>
			{!localValue ? (
				<Text color="red.400" mt={1}>
					Required*
				</Text>
			) : null}
		</Box>
	);
});
