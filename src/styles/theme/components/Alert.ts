import { defineStyleConfig } from '@chakra-ui/react';

export default defineStyleConfig({
	baseStyle: {
		container: {
			padding: 5,
		},
		title: {
			marginBottom: 2,
			fontWeight: 500,
			fontSize: '1.4rem',
		},
		description: {
			fontSize: '1.3rem',
		},
		icon: {
			width: '2rem',
		},
	},
});
