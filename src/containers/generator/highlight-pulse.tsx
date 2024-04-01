import { useEffect, useRef, useState, memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePrevious } from 'react-use';
import { useRecoilValue } from 'recoil';
import { useDiffArray } from '@/hooks';
import { IGrid } from '@/common/types';
import {
	selectGridState,
	selectHighlightedNodeState,
} from '@/store/selectors/global';

export const HighlightPulse = memo(() => {
	const highlightedNode = useRecoilValue(selectHighlightedNodeState);
	const gridState = useRecoilValue(selectGridState);
	const prevGridState = usePrevious<IGrid>(gridState);
	const [rect, setRect] = useState<Record<string, unknown> | null>(null);
	const key = useRef(null);
	const { added } = useDiffArray(
		(gridState[highlightedNode] as IGrid)?.children || [],
		prevGridState
			? (prevGridState[highlightedNode as keyof IGrid] as IGrid)?.children || []
			: []
	);

	useEffect(() => {
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
