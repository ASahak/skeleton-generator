import { FC, useMemo, useRef, memo, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import Tree from 'rc-tree';
import { useRecoilState, useRecoilValue } from 'recoil';
import { selectHighlightedNodeState } from '@/store/selectors/global';
import { gridState } from '@/store/atoms/global';
import { ROOT_KEY } from '@/constants/general-settings';
import { IGrid } from '@/common/types';
import 'rc-tree/assets/index.css';

type ITreeItem = {
	key: string;
	title: string;
	children: ITreeItem[];
};
const STYLE = `
.rc-tree-child-tree {
  display: block;
}

.node-motion {
  transition: all .3s;
  overflow-y: hidden;
}
.rc-tree .rc-tree-treenode{
	display: flex;
}
`;

const motion = {
	motionName: 'node-motion',
	motionAppear: false,
	onAppearStart: () => ({ height: 0 }),
	onAppearActive: (node: HTMLElement) => ({ height: node.scrollHeight }),
	onLeaveStart: (node: HTMLElement) => ({ height: node.offsetHeight }),
	onLeaveActive: () => ({ height: 0 }),
};
export const GridTree: FC = memo(() => {
	const treeRef = useRef();
	const highlightedNode = useRecoilValue(selectHighlightedNodeState);
	const [grid] = useRecoilState(gridState);

	const generateTree = useMemo(() => {
		const acc = { key: ROOT_KEY, title: ROOT_KEY, children: [] };
		const findChildren = (children: string[], set: ITreeItem) => {
			for (const i of children) {
				set.children.push({
					title: i,
					key: i,
					children: [],
				});
				if (Object.hasOwn(grid[i] as IGrid, 'children')) {
					findChildren(
						(grid[i] as IGrid).children || [],
						set.children[set.children.length - 1]
					);
				}
			}
		};
		findChildren((grid[ROOT_KEY] as IGrid).children || [], acc);
		return [acc];
	}, [grid]);

	console.log(generateTree);

	useEffect(() => {
		setTimeout(() => {
			if (treeRef.current) {
				// (treeRef.current as any).scrollTo({ key: highlightedNode });
			}
		}, 100);
	}, [highlightedNode]);

	return (
		<Box>
			<style dangerouslySetInnerHTML={{ __html: STYLE }} />
			<Tree
				key={highlightedNode}
				ref={treeRef as any}
				// defaultExpandAll
				// defaultExpandedKeys={[]}
				motion={motion}
				height={200}
				itemHeight={24}
				treeData={generateTree}
			/>
		</Box>
	);
});
