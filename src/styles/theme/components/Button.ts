import { defineStyleConfig } from '@chakra-ui/react';

export default defineStyleConfig({
	baseStyle: {
		fontFamily: 'inherit',
		_hover: {},
	},
	sizes: {
		sm: {
			h: '3rem',
			px: 4,
			fontSize: '1.3rem',
		},
		md: {
			h: '4rem',
			px: 10,
			fontSize: '1.4rem',
		},
		lg: {
			h: '5rem',
			px: 10,
			fontSize: '1.6rem',
		},
	},
	variants: {
		base: {
			borderRadius: '0.6rem',
			backgroundColor: 'brand.500',
			color: 'white',
			_hover: {
				backgroundColor: 'brand.600 !important',
			},
		},
		red: {
			backgroundColor: 'red.500',
			color: 'white',
			_hover: {
				backgroundColor: 'red.600',
			},
		},
		'group-dropdowns': ({ colorMode }) => ({
			padding: '1.3rem',
			borderRadius: '0.6rem',
			bgColor: colorMode === 'dark' ? 'darcula.300' : 'gray.50',
			height: '3.4rem',
			color: colorMode === 'dark' ? 'white' : 'gray.800',
			fontWeight: 500,
			fontSize: '1.2rem',
		}),
		'menu-outline': ({ colorMode }) => ({
			paddingLeft: '1.3rem',
			paddingRight: '1.3rem',
			borderRadius: '0.6rem',
			backgroundColor: colorMode === 'dark' ? 'darcula.550' : 'white',
			border: '1px solid',
			borderColor: colorMode === 'dark' ? 'darcula.400' : 'gray.100',
			color: colorMode === 'dark' ? 'white' : 'gray.800',
			fontWeight: 500,
			fontSize: '1.3rem',
			display: 'flex',
			alignItems: 'center',
		}),
	},
	defaultProps: {},
});
