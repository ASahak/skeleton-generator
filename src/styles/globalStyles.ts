import type { GlobalStyleProps } from '@chakra-ui/theme-tools';
import { mode } from '@chakra-ui/theme-tools';

export default {
	global: (props: GlobalStyleProps) => ({
		html: {
			fontSize: '10px',
			[`@media only screen and (max-width: ${props.theme.breakpoints.lg})`]: {
				fontSize: '8px',
			},
		},
		body: {
			background: mode('gray.80', 'darcula.800')(props),
		},
		'body, *': {
			fontFamily: 'Poppins,sans-serif;',
			margin: '0',
			boxSizing: 'border-box',
			padding: '0',
			fontSize: '100%',
		},
		'html, body, #root': {
			width: '100%',
			height: '100%;',
		},
		'.custom-scrollbar-content': {
			'&.lg': {
				'&::-webkit-scrollbar': {
					width: '4px',
					height: '4px',
				},
			},
			'&::-webkit-scrollbar': {
				width: '2px',
				height: '2px',
			},
			'&::-webkit-scrollbar-thumb': {
				backgroundColor: 'brand.500',
				borderRadius: '4px',
			},
			'&::-webkit-scrollbar-track': {
				backgroundColor: mode('gray.100', 'darcula.400')(props),
			},
		},
	}),
};
