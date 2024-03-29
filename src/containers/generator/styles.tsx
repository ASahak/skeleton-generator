import { FC, memo } from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { useRecoilState, useRecoilValue } from 'recoil';
import ContentEditable from 'react-contenteditable';
import {
	selectHighlightedNodeGridPropState,
	selectHighlightedNodeState,
} from '@/store/selectors/global';
import { GridKeyType } from '@/common/types';
import { gridState } from '@/store/atoms/global';
import { useThemeColors } from '@/hooks';

export const Styles: FC = memo(() => {
	const styles = useRecoilValue(selectHighlightedNodeGridPropState('styles'));
	const highlightedNode = useRecoilValue(selectHighlightedNodeState);
	const [grid, setGridState] = useRecoilState(gridState);
	const { gray100_dark400, white_dark550 } = useThemeColors();

	const onChange = async (e: any) => {
		const code = e.target.value;
		const _grid = structuredClone(grid);
		const obj: Record<GridKeyType, any> = _grid[highlightedNode] as Record<
			GridKeyType,
			any
		>;
		if (code !== obj.styles) {
			try {
				obj.styles = code;
				setGridState(_grid);
			} catch {
				console.warn('Invalid CSS');
			}
		}
	};

	return (
		<Box p={4}>
			<Heading variant="medium-title" mb={4}>
				Styles
			</Heading>
			<Box
				as={ContentEditable}
				html={styles}
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
			<Text color="gray.200" mt={2}>
				Note*: use plain css format only.
			</Text>
		</Box>
	);
});
