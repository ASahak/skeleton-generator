import { memo, FC } from 'react';
import { Box, Button, HStack, Icon, useColorMode, Flex } from '@chakra-ui/react';
import { RiListSettingsLine, RiMoonLine, RiSunLine } from 'react-icons/ri';
import { useRecoilState } from 'recoil';
import { useThemeColors } from '@/hooks';
import { gridState, highlightedNodeState, optionsPanelIsOpenState } from '@/store/atoms/global';
import { HighlightedNode } from '@/components/header/highlighted-node';
import { generateDefaultValues } from '@/utils/helpers';

export const Header: FC = memo(() => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { white_dark700, gray100_dark400 } = useThemeColors();
  const [getGridState, setGridState] = useRecoilState(gridState);
  const [, setOptionsPanelIsOpen] = useRecoilState(optionsPanelIsOpenState);
  const [, setHighlightedNode] = useRecoilState(highlightedNodeState);
  const ableToPreview = Object.keys(getGridState).length > 0;

  const onCreateRootTemplate = () => {
    setGridState({
      grid_1: { ...generateDefaultValues() }
    });
    setHighlightedNode('grid_1');
  }

  const onPreview = () => {}

  return (
    <Box
      as="header"
      w="full"
      h="7.8rem"
      display="flex"
      alignItems="center"
      px={{ base: 2, sm: 8 }}
      bgColor={white_dark700}
      borderBottom="1px solid"
      borderColor={gray100_dark400}
      position="relative"
      gap={{ base: 8, md: 4 }}
    >
      <HStack justifyContent="space-between" w="full">
        <Flex alignItems="center" gap={4}>
          <Button variant="base" onClick={ableToPreview ? onPreview : onCreateRootTemplate}>
            {ableToPreview ? 'Preview' : 'Create Root'}
          </Button>
          {ableToPreview
            ? <HighlightedNode />
            : null
          }
        </Flex>
        <Flex alignItems="center" gap={6}>
          {ableToPreview
            ? <Button
              alignItems="center" display="flex" p={0}
              variant="unstyled"
              onClick={() => setOptionsPanelIsOpen(true)}
            >
              <Icon as={RiListSettingsLine} fontSize="4xl"/>
            </Button>
            : null
          }
          <Button variant="unstyled" alignItems="center" display="flex" p={0} onClick={toggleColorMode}>
            <Icon fontSize="3xl" as={colorMode === 'dark' ? RiMoonLine : RiSunLine} />
          </Button>
        </Flex>
      </HStack>
    </Box>
  )
})