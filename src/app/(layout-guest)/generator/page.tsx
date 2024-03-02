'use client';

import {
  Box,
  VStack
} from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { Header, Empty } from '@/components';
import { useThemeColors } from '@/hooks';
import { selectGridState } from '@/store/selectors/global';

export default function View() {
  const { gray80_dark800 } = useThemeColors();
  const gridState = useRecoilValue(selectGridState);
  console.log(gridState);
  return (
    <VStack bgColor={gray80_dark800} h="full">
      <Header />
      <Box flex={1}>
        <Box display="flex" alignItems="center" justifyContent="center" h="full">
          <Empty label="No Template" />
        </Box>
      </Box>
    </VStack>
  )
}