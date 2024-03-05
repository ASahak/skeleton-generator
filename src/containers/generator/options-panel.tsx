import { FC } from 'react';
import { Box, Button, Icon } from '@chakra-ui/react';
import { RiCloseFill } from 'react-icons/ri';
import { useRecoilState } from 'recoil';
import { AnimatePresence, motion } from 'framer-motion';
import { useThemeColors } from '@/hooks';
import { RootStyle } from '@/containers/generator/root-style';
import { TreeSpacing } from '@/containers/generator/tree-spacing';
import { optionsPanelIsOpenState } from '@/store/atoms/global';

export const OptionsPanel: FC = () => {
  const { white_dark700, gray100_dark400 } = useThemeColors();
  const [optionsPanelIsOpen, setOptionsPanelIsOpen] = useRecoilState(optionsPanelIsOpenState);

  const togglePanel = () => {
    setOptionsPanelIsOpen(!optionsPanelIsOpen);
  }

  return (
    <AnimatePresence mode="wait">
      {optionsPanelIsOpen
        ? <motion.div
          key="options-panel"
          transition={{ duration: .3 }}
          initial={{ left: '100%', opacity: 0 }}
          animate={{ left: '0', opacity: 1 }}
          exit={{ left: '100%', opacity: 0 }}
          style={{ position: 'absolute', height: '100%', width: '100%' }}
        >
          <Box
            h="full"
            rounded="md"
            bgColor={white_dark700}
            boxShadow="md"
            whiteSpace="nowrap"
          >
            <Box p={4} borderBottom="1px solid" borderColor={gray100_dark400}>
              <Button variant="unstyled" alignItems="center" h="fit-content" display="flex" p={0} onClick={togglePanel}>
                <Icon as={RiCloseFill} fontSize="4xl" />
              </Button>
            </Box>
            <Box>
              <RootStyle />
            </Box>
            <TreeSpacing />
          </Box>
        </motion.div>
        : null
      }
    </AnimatePresence>
  )
}