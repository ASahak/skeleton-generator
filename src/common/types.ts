import { ALIGN_ITEMS, DIRECTION, JUSTIFY_CONTENT } from '@/common/enums';

export type SkeletonKeyType = 'w' | 'h' | 'margin' | 'r' | 'skeletonW';

export type GridKeyType =
	| 'gridGap'
	| 'repeatCount'
	| 'direction'
	| 'className'
	| 'margin'
	| 'w'
	| 'h'
	| 'alignItems'
	| 'justifyContent'
	| 'withOpacity'
	| 'children'
	| 'skeletons'
	| 'styles';

export interface ISkeleton extends Pick<IGrid, 'w' | 'h' | 'margin'> {
	r?: string | number;
	skeletonW?: number | string;
}
export type SizeFunction = () => number | string;
export interface IGrid {
	direction?: DIRECTION;
	gridGap?: number | string;
	repeatCount?: number;
	className?: string;
	margin?: string;
	w?: SizeFunction | number | string;
	h?: SizeFunction | number | string;
	alignItems?: ALIGN_ITEMS;
	justifyContent?: JUSTIFY_CONTENT;
	withOpacity?: boolean;
	styles?: string;
	children?: string[];
	skeletons?: string[];
}

export interface IGenerateCSSGridAreaArgs {
	grid: IGrid;
	hasChildren: boolean;
	children: IGrid[];
	skeletons: ISkeleton[];
	repeatCount: number;
	reservedProps: Record<string, any>;
	keyLevel: string;
}
