import { useRef, useState, memo, useLayoutEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePrevious } from 'react-use';
import { useRecoilValue } from 'recoil';
import { useDiffArray } from '@/hooks';
import { IGrid } from '@/common/types';
import {
	selectDeviceState,
	selectGridState,
	selectHighlightedNodeState,
} from '@/store/selectors/global';
import { getAdaptiveData, getParent } from '@/utils/helpers';

export const HighlightPulse = memo(() => {
	const device = useRecoilValue(selectDeviceState);
	const highlightedNode = useRecoilValue(selectHighlightedNodeState);
	const gridState = useRecoilValue(selectGridState);
	const prevGridState = usePrevious<IGrid>(gridState);
	const [rect, setRect] = useState<Record<string, unknown> | null>(null);
	const key = useRef(null);
	const parentGrid = gridState[getParent(highlightedNode)] as IGrid;
	const grid = gridState[highlightedNode] as IGrid;
	const prevParentGrid = prevGridState?.[
		getParent(highlightedNode) as keyof IGrid
	] as IGrid;
	const prevGrid = prevGridState?.[highlightedNode as keyof IGrid] as IGrid;
	const { added } = useDiffArray(
		[
			...(parentGrid ? getAdaptiveData(parentGrid, device).children || [] : []),
			...(grid ? getAdaptiveData(grid, device).children || [] : []),
		],
		prevGridState
			? [
					...(prevGrid ? getAdaptiveData(prevGrid, device).children || [] : []),
					...(prevParentGrid
						? getAdaptiveData(prevParentGrid, device).children || []
						: []),
				]
			: []
	);

	useLayoutEffect(() => {
		key.current = added[added.length - 1];
		const node = document.querySelector(`[data-key=${key.current}]`);
		if (node) {
			const { height, width, top, left } = node.getBoundingClientRect();
			setRect({ height, width, top, left });
		}

		return () => {
			setRect(null);
		};
	}, [added]);

	return (
		<AnimatePresence mode="wait">
			{!rect && !key.current ? null : (
				<motion.div
					key={key.current}
					style={{ ...rect, position: 'absolute' }}
					animate={{
						backgroundColor: ['#59a3f900', '#59a3f98f', '#59a3f900'],
					}}
					exit={{ opacity: 0.5 }}
					transition={{
						duration: 0.8,
						repeat: 1,
						repeatType: 'reverse',
					}}
				/>
			)}
		</AnimatePresence>
	);
});
