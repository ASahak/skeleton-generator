import { ALIGN_ITEMS, DIRECTION, JUSTIFY_CONTENT } from '@/common/enums';

export type GridKeyType = 'gridGap' | 'repeatCount' | 'direction' | 'className' | 'margin' | 'w' | 'h' | 'alignItems' | 'justifyContent' | 'withOpacity' | 'styles';

export interface ISkeleton extends Pick<IGrid, 'w' | 'h' | 'margin'> {
  r?: string | number,
  skeletonW?: number
}

export interface IGrid {
  direction?: DIRECTION,
  gridGap?: number | string,
  repeatCount?: number,
  className?: string,
  margin?: Array<number | string> | number,
  w?: (() => number | string) | number | string,
  h?: (() => number | string) | number | string,
  alignItems?: ALIGN_ITEMS,
  justifyContent?: JUSTIFY_CONTENT,
  withOpacity?: boolean,
  styles?: string,
  children?: Array<IGrid>
  skeletons?: ISkeleton
}