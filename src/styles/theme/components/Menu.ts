import { defineStyleConfig } from '@chakra-ui/react'

export default defineStyleConfig({
  baseStyle: {},
  sizes: {},
  variants: {
    'base': ({ colorMode }) => ({
      list: {
        boxShadow: 'lg',
        border: '1px solid',
        borderColor: colorMode === 'dark' ? 'darcula.400' : 'gray.100',
        padding: '.5rem',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        backgroundColor: colorMode === 'dark' ? 'darcula.300' : 'white',
      }
    })
  },
  defaultProps: {},
})