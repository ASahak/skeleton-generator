import {defineStyleConfig} from '@chakra-ui/react'

export default defineStyleConfig({
  baseStyle: {
    fontFamily: 'inherit',
  },
  sizes: {},
  variants: {
    'base': () => ({
      field: {
        border: '1px solid',
        borderColor: 'darcula.400',
        transition: 'box-shadow .3s',
        boxShadow: '0px 0px 2px 1px transparent',
        borderRadius: 'md',
        bgColor: 'darcula.500',
        color: 'white',
        fontSize: '1.2rem',
        _placeholder: {
          color: 'gray.200',
        },
        _invalid: {
          borderColor: 'red.400'
        },
        _focus: {
          boxShadow: '0px 0px 1px 1px var(--chakra-colors-brand-500)',
          borderColor: 'transparent',
        }
      }
    }),
  },
  defaultProps: {},
})