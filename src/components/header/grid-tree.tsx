import { FC, useMemo, useRef, memo, useEffect, useState } from 'react';
import { Box, Icon } from '@chakra-ui/react';
import Tree from 'rc-tree';
import { Key, TreeNodeProps } from 'rc-tree/es/interface';
import { RiArrowDownSLine, RiArrowRightSLine } from 'react-icons/ri';
import { ROOT_KEY } from 'react-skeleton-builder';
import { useRecoilState } from 'recoil';
import type { IGrid } from '@/common/types';
import { gridState, highlightedNodeState } from '@/store/atoms/global';
import 'rc-tree/assets/index.css';

const ITEM_HEIGHT = 26;
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
.rc-tree-switcher:not(.rc-tree-switcher-noop) {
	background-image: none !important;
} 
.rc-tree-switcher { 
	height: ${ITEM_HEIGHT}px !important;
	display: flex !important;
	align-items: center !important; 
}
.rc-tree-title { 
	font-size: 1.4rem !important;
	padding-left: .2rem;
}
.rc-tree.rc-tree-show-line .rc-tree-list-holder-inner > .rc-tree-treenode:last-child > .rc-tree-switcher-noop,
.rc-tree.rc-tree-show-line .rc-tree-list-holder-inner .rc-tree-treenode-motion:last-child > .rc-tree-treenode:last-child > .rc-tree-switcher-noop
{
	background-position: -58px -32px !important;
} 
.rc-tree.rc-tree-show-line .rc-tree-treenode > .rc-tree-switcher-noop {
	background-position: -58px -14px !important;
}
.rc-tree-list-holder-inner {
	width: fit-content;
	position: initial !important;
}
.rc-tree-node-selected {
	background-color: var(--chakra-colors-brand-500) !important;
	box-shadow: none !important;
	opacity: 1 !important;
	color: #fff;
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
const generateDefaultExpandedKeys = (highlightedNode: string) => {
	const result = [];
	const items = highlightedNode.split('_');
	let current = items[0];
	for (let i = 1; i < items.length - 1; i++) {
		current += `_${items[i]}`;
		result.push(current);
	}

	return result;
};
export const GridTree: FC = memo(() => {
	const treeRef = useRef();
	const [highlightedNode, setHighlightedNode] =
		useRecoilState(highlightedNodeState);
	const [grid] = useRecoilState(gridState);
	const [expandedKeys, setExpandedKeys] = useState(() =>
		generateDefaultExpandedKeys(highlightedNode)
	);

	const generateTree = useMemo(() => {
		const acc = { key: ROOT_KEY, title: ROOT_KEY, children: [] };
		const findChildren = (children: string[], set: ITreeItem) => {
			for (const i of children) {
				set.children.push({
					title: i,
					key: i,
					children: [],
				});
				if (Object.hasOwn((grid[i] || {}) as IGrid, 'children')) {
					findChildren(
						(grid[i] as IGrid).children || [],
						set.children[set.children.length - 1]
					);
				} else if (Object.hasOwn((grid[i] || {}) as IGrid, 'skeletons')) {
					findChildren(
						(grid[i] as IGrid).skeletons || [],
						set.children[set.children.length - 1]
					);
				}
			}
		};
		findChildren(
			(grid[ROOT_KEY] as IGrid).children ||
				(grid[ROOT_KEY] as IGrid).skeletons ||
				[],
			acc
		);
		return [acc];
	}, [grid]);

	const onExpand = (expandedKeys: string[]) => {
		setExpandedKeys(expandedKeys);
	};

	const onSelectNode = (node: Key[]) => {
		setHighlightedNode((node[0] || ROOT_KEY) as string);
	};

	const renderSwitcherIcon = (obj: TreeNodeProps) => {
		if (!obj.isLeaf) {
			return obj.expanded ? (
				<Icon as={RiArrowDownSLine} fontSize="1.6rem" />
			) : (
				<Icon as={RiArrowRightSLine} fontSize="1.6rem" />
			);
		}

		return null;
	};

	useEffect(() => {
		setTimeout(() => {
			if (treeRef.current) {
				(treeRef.current as any).scrollTo({ key: highlightedNode });
			}
		}, 100);
	}, []);

	return (
		<Box>
			<style dangerouslySetInnerHTML={{ __html: STYLE }} />
			<Tree
				showLine
				switcherIcon={renderSwitcherIcon}
				selectedKeys={[highlightedNode]}
				onSelect={onSelectNode}
				showIcon={false}
				onExpand={onExpand as any}
				ref={treeRef as any}
				expandedKeys={expandedKeys}
				motion={motion}
				height={200}
				itemHeight={ITEM_HEIGHT}
				treeData={generateTree}
			/>
		</Box>
	);
});
