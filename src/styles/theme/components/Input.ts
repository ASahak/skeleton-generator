import { defineStyleConfig } from '@chakra-ui/react';

export default defineStyleConfig({
	baseStyle: {
		fontFamily: 'inherit',
	},
	sizes: {
		sm: {
			field: {
				height: '3rem',
				px: 4,
				fontSize: '1.3rem',
			},
		},
		md: {
			field: {
				height: '4rem',
				px: 10,
				fontSize: '1.4rem',
			},
		},
		lg: {
			field: {
				height: '5rem',
				px: 10,
				fontSize: '1.6rem',
			},
		},
	},
	variants: {
		base: ({ colorMode }) => ({
			field: {
				border: '1px solid',
				transition: 'box-shadow .3s',
				borderColor: colorMode === 'dark' ? 'darcula.400' : 'gray.100',
				bgColor: colorMode === 'dark' ? 'darcula.550' : 'white',
				color: colorMode === 'dark' ? 'white' : 'black',
				boxShadow: '0px 0px 2px 1px transparent',
				borderRadius: 'md',
				fontSize: '1.2rem',
				_placeholder: {
					color: colorMode === 'dark' ? 'gray.200' : 'gray.300',
				},
				_invalid: {
					borderColor: 'red.400',
				},
				_focus: {
					boxShadow: '0px 0px 1px 1px var(--chakra-colors-brand-500)',
					borderColor: 'transparent',
				},
			},
		}),
	},
	defaultProps: {},
});
