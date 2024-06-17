import { defineStyleConfig } from '@chakra-ui/react';

export default defineStyleConfig({
	baseStyle: {},
	sizes: {},
	variants: {
		base: ({ colorMode }) => ({
			list: {
				boxShadow: 'lg',
				border: '1px solid',
				borderColor: colorMode === 'dark' ? 'darcula.400' : 'gray.100',
				padding: '.5rem',
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				backgroundColor: colorMode === 'dark' ? 'darcula.550' : 'white',
			},
			item: {
				display: 'inline-flex !important',
				minH: '3.4rem',
				alignItems: 'center',
				justifyContent: 'start',
				color: colorMode === 'dark' ? 'white' : 'gray.800',
				fontWeight: '500',
				fontSize: '1.2rem',
				textAlign: 'left',
				bgColor: 'transparent',
				borderRadius: '.4rem',
				_disabled: {
					cursor: 'not-allowed !important',
				},
				_hover: {
					bgColor:
						colorMode === 'dark'
							? 'darcula.510 !important'
							: 'gray.50 !important',
				},
			},
		}),
	},
	defaultProps: {},
});
