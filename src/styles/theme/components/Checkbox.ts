import { defineStyleConfig } from '@chakra-ui/react';

export default defineStyleConfig({
	baseStyle: {},
	sizes: {
		md: {
			icon: {
				fontSize: '.8rem',
			},
			control: {
				w: '1.5rem',
				h: '1.5rem',
			},
		},
		lg: {
			icon: {
				fontSize: '1rem',
			},
			control: {
				w: '1.8rem',
				h: '1.8rem',
			},
			label: {
				fontSize: '1.4rem',
			},
		},
	},
	variants: {},
	defaultProps: {},
});
