import { FC } from 'react';
import { Box, Heading, useColorMode, Text } from '@chakra-ui/react';
import { LiveProvider, LiveEditor } from 'react-live';
import { themes } from 'prism-react-renderer';
import { useRecoilState } from 'recoil';
import { rootStylesState } from '@/store/atoms/global';

export const RootStyle: FC = () => {
	const { colorMode } = useColorMode();
	const [rootStyles, setRootStyles] = useRecoilState(rootStylesState);
	const isDark = colorMode === 'dark';

	const onChange = (code: string) => {
		setRootStyles(code);
	};

	return (
		<Box p={4}>
			<Heading variant="medium-title" mb={4}>
				Root element&apos;s styles
			</Heading>
			<LiveProvider
				code={rootStyles}
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
};
