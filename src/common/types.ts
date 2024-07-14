import type {
	IGrid as IGridBase,
	ISkeleton as ISkeletonBase,
} from 'react-skeleton-builder';

export type ISelect = {
	value: string;
	label: string;
};

export type IGrid = IGridBase & { children?: string[]; skeletons?: string[] };
export interface ISkeleton extends ISkeletonBase {
	children?: string[];
	skeletons?: string[];
}
