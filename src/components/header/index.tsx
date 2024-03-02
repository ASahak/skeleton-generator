import { memo, FC } from 'react';
import { Box, Button, HStack, Icon, useColorMode } from '@chakra-ui/react';
import { RiMoonLine, RiSunLine } from 'react-icons/ri';
import { useRecoilState } from 'recoil';
import { useThemeColors } from '@/hooks';
import { gridState } from '@/store/atoms/global';
export const Header: FC = memo(() => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { white_dark700, gray100_dark400 } = useThemeColors();
  const [getGridState, setGridState] = useRecoilState(gridState);
  const ableToPreview = Object.values(getGridState).length > 0;
  console.log(getGridState, 111);

  const onCreateRootTemplate = () => {
    setGridState({ test: 1})
  }

  const onPreview = () => {}

  return (
    <Box
      as="header"
      w="full"
      h="7.8rem"
      display="flex"
      alignItems="center"
      px={{ base: 4, sm: 16 }}
      bgColor={white_dark700}
      borderBottom="1px solid"
      borderColor={gray100_dark400}
      position="relative"
      gap={{ base: 8, md: 4 }}
    >
      <HStack justifyContent="space-between" w="full">
        <Box>
          <Button variant="base" onClick={ableToPreview ? onPreview : onCreateRootTemplate}>
            {ableToPreview ? 'Preview' : 'Create Root'}
          </Button>
        </Box>
        <Box>
          <Button variant="unstyled" alignItems="center" display="flex" p={0} onClick={toggleColorMode}>
            <Icon fontSize="3xl" as={colorMode === 'dark' ? RiMoonLine : RiSunLine} />
          </Button>
        </Box>
      </HStack>
    </Box>
  )
})