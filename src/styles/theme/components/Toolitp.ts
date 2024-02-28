import { defineStyleConfig } from '@chakra-ui/react';
import { cssVar } from '@chakra-ui/theme-tools';

const $arrowBg = cssVar('popper-arrow-bg');
const $arrowShadowColor = cssVar('popper-arrow-shadow-color');
export default defineStyleConfig({
  baseStyle: {
  },
  sizes: {},
  variants: {
    'base': () => ({
      background: 'darcula.600',
      border: '1px solid',
      color: 'white',
      px: 4,
      py: 2,
      borderColor: 'darcula.400',
      [$arrowBg.variable]: 'var(--chakra-colors-darcula-600)',
      [$arrowShadowColor.variable]: 'var(--chakra-colors-darcula-400)',
    })
  },
  defaultProps: {},
})