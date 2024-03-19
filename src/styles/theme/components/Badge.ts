import { defineStyleConfig } from '@chakra-ui/react';

export default defineStyleConfig({
	baseStyle: {
		fontFamily: 'inherit',
		wordBreak: 'break-all',
	},
	sizes: {
		md: {
			fontSize: '1.2rem',
			fontWeight: 500,
			lineHeight: '1.6rem',
		},
	},
	variants: {
		'gray-outline-filled': ({ colorMode }) => ({
			boxShadow:
				colorMode === 'dark'
					? '0 0 0 0.1rem var(--chakra-colors-gray-400) inset'
					: '0 0 0 0.1rem var(--chakra-colors-gray-150) inset',
			backgroundColor: colorMode === 'dark' ? 'darcula.550' : 'gray.50',
			color: colorMode === 'dark' ? 'gray.100' : 'black',
			padding: '0.5rem 0.8rem',
			borderRadius: '0.6rem',
			textTransform: 'capitalize',
			fontSize: '1.2rem',
			fontWeight: 500,
		}),
		'pill-gray-filled': ({ colorMode }) => ({
			backgroundColor: colorMode === 'dark' ? 'darcula.550' : 'gray.100',
			color: colorMode === 'dark' ? 'gray.100' : 'gray.800',
			padding: '0.3rem 0.8rem',
			borderRadius: '0.6rem',
			textTransform: 'capitalize',
			fontSize: '1.4rem',
			fontWeight: 400,
			lineHeight: '2.3rem',
		}),
		'pill-unstyled': ({ colorMode }) => ({
			color: colorMode === 'dark' ? 'white' : 'gray.400',
			textTransform: 'capitalize',
			fontSize: '1.4rem',
			fontWeight: 'normal',
		}),
		'pill-docs': ({ colorMode }) => ({
			backgroundColor: colorMode === 'dark' ? 'darcula.550' : 'gray.50',
			color: colorMode === 'dark' ? 'gray.100' : 'gray.800',
			padding: '0.3rem 0.8rem',
			borderRadius: '0.6rem',
			fontFamily: 'gitbook-code-font, Menlo, monospace',
			fontWeight: 400,
			textTransform: 'initial',
			fontSize: '1.4rem',
		}),
	},
	defaultProps: {},
});
