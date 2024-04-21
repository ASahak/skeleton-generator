import { useRef, useState } from 'react';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { useBus, useThemeColors } from '@/hooks';
import { ON_CLOSE_MODAL } from '@/constants/event-bus-types';

type IProps = {
	title: string;
	onApply: (v: string) => void;
	onClose: () => void;
};
const INITIAL_FUNC_EXEC = `() => {
	// your code here
}`;
export const FunctionUnitEditor = ({ title, onApply, onClose }: IProps) => {
	const [localValue, setLocalValue] = useState(INITIAL_FUNC_EXEC);
	const filteredValue = useRef(localValue);
	const { gray100_dark400, white_dark550 } = useThemeColors();

	const onChange = (e: ContentEditableEvent) => {
		setLocalValue(e.target.value);
		filteredValue.current = (
			e.currentTarget as unknown as HTMLElement
		).innerText;
	};

	useBus(
		ON_CLOSE_MODAL,
		() => {
			onClose();
		},
		[]
	);

	return (
		<Box>
			<Text fontSize="1.5rem" mb={4}>
				{title}
			</Text>
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
			<Flex justifyContent="flex-end" mt={8} gap={3}>
				<Button
					variant="base"
					size="sm"
					onClick={() => onApply(filteredValue.current)}
				>
					Apply
				</Button>
			</Flex>
		</Box>
	);
};
