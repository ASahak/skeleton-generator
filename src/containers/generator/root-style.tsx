import { FC, memo, useRef, useState } from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { useRecoilState } from 'recoil';
import { useDebounce } from 'react-use';
import { rootStylesState } from '@/store/atoms/global';
import { useThemeColors } from '@/hooks';

export const RootStyle: FC = memo(() => {
	const [rootStyles, setRootStyles] = useRecoilState(rootStylesState);
	const [localValue, setLocalValue] = useState(rootStyles);
	const filteredValue = useRef(localValue);
	const { gray100_dark400, white_dark550 } = useThemeColors();

	useDebounce(
		() => {
			setRootStyles(filteredValue.current);
		},
		300,
		[localValue]
	);

	const onChange = (e: ContentEditableEvent) => {
		setLocalValue(e.target.value);
		filteredValue.current = (
			e.currentTarget as unknown as HTMLElement
		).innerText;
	};

	return (
		<Box p={4}>
			<Heading variant="medium-title" mb={4}>
				Root element&apos;s styles
			</Heading>
			<Box
				as={ContentEditable}
				html={localValue}
				onChange={onChange}
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
		</Box>
	);
});
