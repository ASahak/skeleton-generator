import { defineStyleConfig } from '@chakra-ui/react';

export default defineStyleConfig({
	baseStyle: {},
	sizes: {},
	variants: {
		base: ({ colorMode }) => ({
			dialog: {
				boxShadow: 'lg',
				border: '1px solid',
				borderColor: colorMode === 'dark' ? 'darcula.400' : 'gray.100',
				padding: '.5rem',
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				backgroundColor: colorMode === 'dark' ? 'darcula.550' : 'white',
			},
		}),
	},
	defaultProps: {},
});
