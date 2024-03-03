import { defineStyleConfig } from '@chakra-ui/react';

export default defineStyleConfig({
  baseStyle: {
    fontFamily: 'inherit',
    _hover: {}
  },
  sizes: {
    md: {
      h: '4rem',
      px: 10,
      fontSize: '1.4rem'
    },
    lg: {
      h: '5rem',
      px: 10,
      fontSize: '1.6rem'
    }
  },
  variants: {
    'base': {
      backgroundColor: 'brand.500',
      color: 'white',
      _hover: {
        backgroundColor: 'brand.600',
      }
    },
    'options-panel-btn': {
      w: '4.5rem',
      h: '4.5rem',
      display: 'flex',
      alignItems: 'center',
      color: 'white',
      bgColor: 'brand.500',
      boxShadow: 'md',
      borderRadius: 0,
      position: 'absolute',
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
    }
  },
  defaultProps: {},
})