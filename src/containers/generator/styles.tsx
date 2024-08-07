import { FC, memo, useEffect, useRef, useState } from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useDebounce } from 'react-use';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import type { GridKeyType } from 'react-skeleton-builder';
import cloneDeep from 'clone-deep';
import {
	selectDeviceState,
	selectHighlightedNodeGridPropState,
	selectHighlightedNodeState,
} from '@/store/selectors/global';
import { gridState } from '@/store/atoms/global';
import { useThemeColors } from '@/hooks';

export const Styles: FC = memo(() => {
	const device = useRecoilValue(selectDeviceState);
	const styles = useRecoilValue(selectHighlightedNodeGridPropState('styles'));
	const [localValue, setLocalValue] = useState(styles);
	const highlightedNode = useRecoilValue(selectHighlightedNodeState);
	const [grid, setGridState] = useRecoilState(gridState);
	const { gray100_dark400, white_dark550 } = useThemeColors();
	const filteredValue = useRef(localValue);

	useDebounce(
		() => {
			const code = filteredValue.current;
			const _grid = cloneDeep(grid);
			const obj: Record<GridKeyType, any> = _grid[highlightedNode] as Record<
				GridKeyType,
				any
			>;
			if (code !== obj.styles) {
				try {
					let ref;

					if (device !== 'desktop') {
						ref = obj.responsive[device!];
					} else {
						ref = obj;
					}

					ref.styles = code;
					setGridState(_grid);
				} catch {
					console.warn('Invalid CSS');
				}
			}
		},
		300,
		[localValue]
	);

	const onChange = async (e: ContentEditableEvent) => {
		setLocalValue(e.target.value);
		filteredValue.current = (
			e.currentTarget as unknown as HTMLElement
		).innerText;
	};

	useEffect(() => {
		setLocalValue(styles);
	}, [device]);

	return (
		<Box p={4}>
			<Heading variant="medium-title" mb={4}>
				Styles
			</Heading>
			<Box
				border="1px solid"
				as={ContentEditable}
				html={localValue}
				onChange={onChange}
				tagName="pre"
				maxH="200px"
				overflowX="hidden"
				fontSize="1.2rem"
				p={4}
				borderRadius="md"
				borderColor={gray100_dark400}
				bgColor={white_dark550}
				boxShadow="none"
				outline="0"
				transition="box-shadow .3s"
				_focus={{
					boxShadow: '0px 0px 1px 1px var(--chakra-colors-brand-500)',
				}}
			/>
			<Text color="gray.200" mt={2} wordBreak="break-word" whiteSpace="wrap">
				Note*: use plain css format only.
				<br />
				The margin, gap, height, width, align-items and justify-content will be
				removed cause of in the options we have already them.
			</Text>
		</Box>
	);
});
