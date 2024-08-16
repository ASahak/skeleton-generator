import { useRef, useState } from 'react';
import { Box, Button, Flex, Text, Heading } from '@chakra-ui/react';
// import StyleEditor from 'react-style-editor';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useThemeColors } from '@/hooks';
import {
	gridState,
	highlightedNodeState,
	rootStylesState,
	skeletonsState,
} from '@/store/atoms/global';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { useModal } from '@/providers/custom-modal';
import { ROOT_KEY } from 'react-skeleton-builder';
import {
	generateDefaultValues,
	generateGridStructureFromImport,
	mergeWithExistingProps,
} from '@/utils/helpers';
import {
	selectAdaptiveDeviceEnabledState,
	selectRootStylesState,
} from '@/store/selectors/global';
import { IGrid, ISkeleton } from '@/common/types';

export const Import = () => {
	const { onClose } = useModal();
	const [, setRootStyles] = useRecoilState(rootStylesState);
	const [, setGridState] = useRecoilState(gridState);
	const [, setSkeletonsState] = useRecoilState(skeletonsState);
	const rootStyles = useRecoilValue(selectRootStylesState);
	const adaptiveDeviceEnabled = useRecoilValue(
		selectAdaptiveDeviceEnabledState
	);
	const { gray100_dark400, white_dark550 } = useThemeColors();
	const [, setHighlightedNode] = useRecoilState(highlightedNodeState);

	const [localValueRootStyles, setLocalValueRootStyles] = useState(rootStyles);
	const [localValueGrid, setLocalValueGrid] = useState('');
	// {
	// 	children: [
	// 		{h: "100px", skeletons: [{r: "10px"}]},
	// 		{responsive: {tablet: {direction: "column"}}, skeletons: [{}, {}]}
	// 	]
	// }
	const filteredValueRootStyles = useRef(localValueRootStyles);
	const filteredValueGrid = useRef(localValueGrid);

	const onApply = () => {
		try {
			const gridStateData = JSON.parse(
				filteredValueGrid.current.replace(/(\w+):/g, '"$1":')
			);
			const { gridState, skeletonsState } = generateGridStructureFromImport(
				gridStateData,
				{
					[ROOT_KEY]: mergeWithExistingProps(gridStateData, {
						...generateDefaultValues(adaptiveDeviceEnabled),
					}),
				} as IGrid,
				{} as ISkeleton,
				ROOT_KEY,
				adaptiveDeviceEnabled
			);

			setGridState(gridState);
			setSkeletonsState(skeletonsState);
			setHighlightedNode(ROOT_KEY);
			setRootStyles(filteredValueRootStyles.current);
		} catch (err) {
			console.error(err);
		} finally {
			onClose();
		}
	};

	const onChangeRootStyle = (e: ContentEditableEvent) => {
		setLocalValueRootStyles(e.target.value);
		filteredValueRootStyles.current = (
			e.currentTarget as unknown as HTMLElement
		).innerText;
	};

	const onChangeGrid = (e: ContentEditableEvent) => {
		setLocalValueGrid(e.target.value);
		filteredValueGrid.current = (
			e.currentTarget as unknown as HTMLElement
		).innerText;
	};

	return (
		<Box>
			<Heading fontSize="1.8rem" mb={4} fontWeight="500">
				Import Template structure
			</Heading>
			<Heading variant="medium-title" mb={4}>
				Root element&apos;s styles
			</Heading>
			{/*<StyleEditor*/}
			{/*	defaultValue={`*/}
			{/*              div {color:red;}*/}
			{/*              @media screen {*/}
			{/*                  article {*/}
			{/*                      display: flex;*/}
			{/*                  }*/}
			{/*              }*/}
			{/*          `}*/}
			{/*/>*/}

			<Box
				as={ContentEditable}
				html={localValueRootStyles}
				onChange={onChangeRootStyle}
				tagName="pre"
				maxH="200px"
				overflowX="hidden"
				fontSize="1.2rem"
				p={4}
				borderRadius="md"
				border="1px solid"
				borderColor={gray100_dark400}
				bgColor={white_dark550}
				boxShadow="none"
				outline="0"
				transition="box-shadow .3s"
				_focus={{
					boxShadow: '0px 0px 1px 1px var(--chakra-colors-brand-500)',
				}}
			/>
			<Text color="gray.200" mt={2}>
				Note*: use plain css format only.
			</Text>
			<Heading variant="medium-title" my={4}>
				Grid
			</Heading>
			<Box
				as={ContentEditable}
				html={localValueGrid}
				onChange={onChangeGrid}
				tagName="pre"
				maxH="200px"
				overflowX="hidden"
				fontSize="1.2rem"
				p={4}
				borderRadius="md"
				border="1px solid"
				borderColor={gray100_dark400}
				bgColor={white_dark550}
				boxShadow="none"
				outline="0"
				transition="box-shadow .3s"
				_focus={{
					boxShadow: '0px 0px 1px 1px var(--chakra-colors-brand-500)',
				}}
			/>
			<Flex justifyContent="flex-end" mt={8} gap={3}>
				<Button variant="base" size="sm" onClick={onApply}>
					Apply
				</Button>
			</Flex>
		</Box>
	);
};
