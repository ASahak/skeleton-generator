import { DEFAULT_GAP, DEFAULT_HEIGHT, DEFAULT_REPEAT_COUNT, DEFAULT_WIDTH } from '@/constants/general-settings';

export enum DIRECTION {
  ROW = 'row',
  COLUMN = 'column',
}

export enum MARGIN_SIDES {
  TOP = 'top',
  RIGHT = 'right',
  BOTTOM = 'bottom',
  LEFT = 'left',
}

export enum CONTAINER_INITIAL_VALUES {
  direction = DIRECTION.ROW,
  gridGap = DEFAULT_GAP,
  repeatCount = DEFAULT_REPEAT_COUNT,
  className = '',
  margin = '0',
  w = DEFAULT_WIDTH,
  h = DEFAULT_HEIGHT,
}

export enum SIZE_UNITS {
  AUTO = 'auto',
  PERCENT = '%',
  PX = 'px',
  REM = 'rem',
  VH = 'vh',
  VW = 'vw',
  PC = 'pc',
  CM = 'cm',
  MM = 'mm',
  IN = 'in',
  PT = 'pt',
  CH = 'ch',
  EM = 'em',
  V_MIN = 'vmin',
  V_MAX = 'vmax',
}