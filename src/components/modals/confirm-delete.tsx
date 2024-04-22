import { Box, Button, Flex, Text } from '@chakra-ui/react';

type IProps = {
	title: string;
	onConfirm: () => void;
	onCancel: () => void;
};
export const ConfirmDelete = ({ title, onConfirm, onCancel }: IProps) => {
	return (
		<Box>
			<Text fontSize="1.5rem">
				{title ? title : 'Are you sure to proceed?'}
			</Text>
			<Flex justifyContent="flex-end" mt={8} gap={3}>
				<Button variant="red" size="sm" onClick={onConfirm}>
					Confirm
				</Button>
				<Button variant="base" size="sm" onClick={onCancel}>
					Cancel
				</Button>
			</Flex>
		</Box>
	);
};
