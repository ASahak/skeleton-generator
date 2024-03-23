import { FC, memo } from 'react';
import { Box, Heading, useColorMode, Text } from '@chakra-ui/react';
import { LiveProvider, LiveEditor } from 'react-live';
import { themes } from 'prism-react-renderer';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
	selectHighlightedNodeGridPropState,
	selectHighlightedNodeState,
} from '@/store/selectors/global';
import { GridKeyType } from '@/common/types';
import { gridState } from '@/store/atoms/global';

export const Styles: FC = memo(() => {
	const styles = useRecoilValue(selectHighlightedNodeGridPropState('styles'));
	const highlightedNode = useRecoilValue(selectHighlightedNodeState);
	const [grid, setGridState] = useRecoilState(gridState);
	const { colorMode } = useColorMode();
	const isDark = colorMode === 'dark';

	const onChange = async (code: string) => {
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
			<LiveProvider
				code={styles}
				theme={isDark ? themes.oneDark : themes.oneLight}
				transformCode={onChange}
			>
				<LiveEditor
					style={{
						maxHeight: '200px',
						overflowX: 'hidden',
						fontSize: '1.2rem',
						borderRadius: '.4rem',
					}}
				/>
			</LiveProvider>
			<Text color="gray.200" mt={2}>
				Note*: use plain css format only.
			</Text>
		</Box>
	);
});
