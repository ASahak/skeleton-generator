import { FC, useState } from 'react';
import { Box, Heading, useColorMode, Text } from '@chakra-ui/react';
// import { LiveProvider, LiveEditor } from 'react-live';
// import { themes } from 'prism-react-renderer';
import { useRecoilState, useRecoilValue } from 'recoil';
import parse from 'style-to-object';
import Editor, { OnChange } from '@monaco-editor/react';
import {
	selectHighlightedNodeGridPropState,
	selectHighlightedNodeState,
} from '@/store/selectors/global';
import { GridKeyType } from '@/common/types';
import { gridState } from '@/store/atoms/global';
import { STYLE_PARSING_REGEXP } from '@/constants/general-settings';

export const Styles: FC = () => {
	const styles = useRecoilValue(selectHighlightedNodeGridPropState('styles'));
	const highlightedNode = useRecoilValue(selectHighlightedNodeState);
	const [invalidState, setInvalidState] = useState(false);
	const [grid, setGridState] = useRecoilState(gridState);
	const { colorMode } = useColorMode();
	const isDark = colorMode === 'dark';
	console.log(invalidState, isDark);
	const onChange = async (code: string) => {
		const _grid = structuredClone(grid);
		const obj: Record<GridKeyType, any> = _grid[highlightedNode] as Record<
			GridKeyType,
			any
		>;
		if (code !== obj.styles) {
			console.log(
				parse(code.replace(STYLE_PARSING_REGEXP, '')),
				code,
				obj.styles
			);
			try {
				const emptyState = code.replace(/ /g, '') === '{}';
				if (!emptyState) {
					throw Error();
				}

				setInvalidState(false);
				obj.styles = code;
				setGridState(_grid);
			} catch {
				setInvalidState(true);
				console.warn('Invalid CSS');
			}
		}
	};

	return (
		<Box p={4}>
			<Heading variant="medium-title" mb={4}>
				Styles
			</Heading>
			{/*<LiveProvider*/}
			{/*  code={styles}*/}
			{/*  theme={isDark ? themes.oneDark : themes.oneLight}*/}
			{/*  transformCode={onChange}*/}
			{/*>*/}
			<Box maxH="200px" overflowX="hidden" h="100px">
				<Editor
					defaultValue={`[data-key="${highlightedNode}"] ${styles}`}
					height="100%"
					defaultLanguage="css"
					onChange={onChange as OnChange}
					// style={{
					// maxHeight: '200px',
					// overflowX: 'hidden',
					// fontSize: '1.2rem',
					// borderRadius: '.4rem',
					// ...(invalidState && { border: '1px solid red' })
					// }}
				/>
			</Box>
			{/*</LiveProvider>*/}
			<Text color="gray.200" mt={2}>
				Note*: use plain css format only.
			</Text>
		</Box>
	);
};
