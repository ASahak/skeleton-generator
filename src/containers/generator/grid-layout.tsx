import { CSSProperties } from 'react';
import { Box } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { selectGridState, selectRootStylesState } from '@/store/selectors/global';
import { useConvertStringToStyleObject } from '@/hooks';
import { ROOT_KEY } from '@/constants/general-settings';
import { IGrid, ISkeleton } from '@/common/types';
import { DIRECTION } from '@/common/enums';
import parse from 'style-to-object';

interface IGridLayout {
  grid: IGrid,
  dataKey: string,
  index: number,
  length: number,
}
export const GridLayout = () => {
  const gridState = useRecoilValue(selectGridState);
  const rootStyles = useRecoilValue(selectRootStylesState);
  const convertedStyles = useConvertStringToStyleObject(rootStyles);

  const renderSkeletons = (skeleton: ISkeleton) => {
    return <Box></Box>
  }

  const renderGridLayout = ({ grid, dataKey, index, length }: IGridLayout) => {
    const key_level = dataKey;
    const gridGap = grid.gridGap,
      hasChildren = Object.hasOwn(grid, 'children') && Array.isArray(grid.children),
      hasSkeletons = Object.hasOwn(grid, 'skeletons'),
      repeatCount = grid.repeatCount,
      children = hasChildren ? itemsWithRepeat(grid.children, repeatCount) : [],
      // gridStyle =
      //   grid.direction === DIRECTION.ROW
      //     ? generateGridArea((hasChildren ? children : itemsWithRepeat(grid.skeletons, repeatCount)).map(({ w = CONSTANTS.DEFAULT_GRID_CONTAINER_WIDTH }) => ({ w })))
      //     : generateGridAreaAsColDirection(grid.children || grid.skeletons, grid.alignItems),
      withOpacity = grid.withOpacity,
      style = grid.styles ? parse(grid.styles.replace(/(^\{|\}$)/g, '')) : {};

    return <Box
      display="grid"
      data-key={key_level}
      key={key_level}
      style={{
        gap: gridGap,
        margin: generateMargin(grid.margin || []).margin,
        grid: gridStyle,
        height: typeof grid.h === 'function' ? grid.h() : grid.h,
        width: typeof grid.w === 'function' ? grid.w() : grid.w,
        alignItems: grid.alignItems,
        justifyContent: grid.justifyContent,
        opacity: setOpacity(index, repeatCount, withOpacity, length),
        ...style,
      }}
      className={grid.className || ''}
    >
      {hasChildren
        ? (grid.children as Array<IGrid>).map((g, gridItemIndex) => renderGridLayout({
          grid: g,
          dataKey: `${key_level}_${gridItemIndex}`,
          index: gridItemIndex,
          length: children.length,
        }))
        : hasSkeletons
          ? (grid.skeletons as Array<ISkeleton>).map(s => renderSkeletons(s))
          : null
      }
    </Box>
  }

  return (
    <Box style={convertedStyles as CSSProperties} border="1px dashed" borderColor="brand.500">
      {renderGridLayout({
        grid: gridState[ROOT_KEY] as IGrid,
        dataKey: ROOT_KEY,
        index: 0,
        length: 1,
      })}
    </Box>
  )
}