import { ChangeEvent, FC, memo, useEffect, useState } from 'react';
import { Box, Heading, Input, Text } from '@chakra-ui/react';
import { useDebounce } from 'react-use';
import { useRecoilState, useRecoilValue } from 'recoil';
import cloneDeep from 'clone-deep';
import {
	selectDeviceState,
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
	const device = useRecoilValue(selectDeviceState);
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
			let ref;

			if (device !== 'desktop') {
				ref = obj.responsive[device!];
			} else {
				ref = obj;
			}

			ref.skeletonW = localValue;
			setSkeletonsState(_skeletons);
		},
		300,
		[localValue]
	);

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value ?? '';
		setLocalValue(newValue);
	};

	useEffect(() => {
		setLocalValue(skeletonW);
	}, [device]);

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
