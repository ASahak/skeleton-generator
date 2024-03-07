import { CSSProperties } from 'react';
import { Box } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { selectGridState, selectRootStylesState } from '@/store/selectors/global';
import { useConvertStringToStyleObject } from '@/hooks';

export const GridLayout = () => {
  const gridState = useRecoilValue(selectGridState);
  const rootStyles = useRecoilValue(selectRootStylesState);
  const convertedStyles = useConvertStringToStyleObject(rootStyles);
  const renderGridLayout = () => {
    console.log(gridState);

    return null
  }

  return (
    <Box style={convertedStyles as CSSProperties} border="1px dashed" borderColor="brand.500">
      {renderGridLayout()}
    </Box>
  )
}