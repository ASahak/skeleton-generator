import { defineStyleConfig } from '@chakra-ui/react';
import { cssVar } from '@chakra-ui/theme-tools';

const $arrowBg = cssVar('popper-arrow-bg');
const $arrowShadowColor = cssVar('popper-arrow-shadow-color');
export default defineStyleConfig({
	baseStyle: {},
	sizes: {},
	variants: {
		base: ({ colorMode }) => ({
			background: colorMode === 'dark' ? 'darcula.600' : 'gray.700',
			border: '1px solid',
			color: 'white',
			fontSize: 'lg',
			px: 4,
			py: 2,
			borderColor: colorMode === 'dark' ? 'darcula.400' : 'gray.700',
			[$arrowBg.variable]:
				colorMode === 'dark'
					? 'var(--chakra-colors-darcula-600)'
					: 'var(--chakra-colors-gray-700)',
			[$arrowShadowColor.variable]:
				colorMode === 'dark'
					? 'var(--chakra-colors-darcula-400)'
					: 'var(--chakra-colors-gray-700)',
		}),
	},
	defaultProps: {},
});
