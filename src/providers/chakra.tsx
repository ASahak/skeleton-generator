import PropTypes from 'prop-types';
import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react';
import { CacheProvider } from '@chakra-ui/next-js';
import theme from '@/styles/theme';

export const Chakra = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <CacheProvider>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: false,
          }}
        >
        {children}
        </ColorModeProvider>
      </ChakraProvider>
    </CacheProvider>
  )
}
Chakra.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
}