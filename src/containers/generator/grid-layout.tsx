import { CSSProperties } from 'react';
import { Box } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { selectRootStylesState } from '@/store/selectors/global';
import { useConvertStringToStyleObject } from '@/hooks';

export const GridLayout = () => {
  const rootStyles = useRecoilValue(selectRootStylesState);
  const convertedStyles = useConvertStringToStyleObject(rootStyles);

  return (
    <Box style={convertedStyles as CSSProperties}>

    </Box>
  )
}