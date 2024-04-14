import React, { ReactNode, useRef, useState, memo } from 'react';
import {
	Menu,
	MenuItem,
	MenuList,
	Button,
	Icon,
	useDisclosure,
	Portal,
} from '@chakra-ui/react';
import { RiDeleteBin6Line, RiFileCopyLine } from 'react-icons/ri';
import { MODALS_KEYS, useModal } from '@/providers/custom-modal';
import { useRecoilState } from 'recoil';
import { gridState, highlightedNodeState } from '@/store/atoms/global';
import { GridKeyType } from '@/common/types';
import { findAbsentIndex, getParent } from '@/utils/helpers';

type IProps = {
	isAble: boolean;
	children: ReactNode;
};
export const WithContextMenu = memo(({ isAble, children }: IProps) => {
	const { setModal, onClose: onModalClose } = useModal();
	const [highlightedNode, setHighlightedNode] =
		useRecoilState(highlightedNodeState);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [offset, setOffset] = useState([0, 0]);
	const [getGridState, setGridState] = useRecoilState(gridState);
	const menuList = useRef();

	const onDelete = () => {
		const _grid: Record<GridKeyType, any> = structuredClone(getGridState);
		const parentKey = getParent(highlightedNode);
		if (parentKey in _grid) {
			_grid[parentKey as GridKeyType].children.splice(
				_grid[parentKey as GridKeyType].children.indexOf(highlightedNode),
				1
			);
		}
		delete _grid[highlightedNode as GridKeyType];
		setHighlightedNode(parentKey);
		setGridState(_grid);
		onModalClose();
	};

	const onCopy = () => {
		const _grid: Record<GridKeyType, any> = structuredClone(getGridState);
		const parentKey = getParent(highlightedNode);
		if (parentKey in _grid) {
			const obj: Record<GridKeyType, any> = _grid[parentKey as GridKeyType];
			const newRoot = parentKey + '_';
			const newKey = newRoot + findAbsentIndex(newRoot, obj.children || []);
			_grid[newKey as GridKeyType] = {
				..._grid[highlightedNode as GridKeyType],
				children: [],
			};
			(_grid[highlightedNode as GridKeyType].children || []).forEach(
				(c: string) => {
					const newChild = c.replace(highlightedNode, newKey);
					_grid[newKey as GridKeyType].children.push(newChild);
					_grid[newChild as GridKeyType] = _grid[c as GridKeyType];
				}
			);
			obj.children = (obj.children || []).concat(newKey);

			setHighlightedNode(newKey);
			setGridState(_grid);
		}
	};

	const onAction = (actionType: 'delete' | 'copy') => {
		switch (actionType) {
			case 'delete':
				setModal({
					key: MODALS_KEYS.CONFIRM_DELETE,
					props: {
						title: `Are you sure to delete this item: ${highlightedNode}`,
						onCancel: onModalClose,
						onConfirm: onDelete,
					},
				});
				break;
			case 'copy':
				onCopy();
				break;
			default:
				break;
		}
	};

	return isAble ? (
		<>
			<Menu isOpen={isOpen} onClose={onClose} variant="base">
				{React.cloneElement(children as any, {
					onContextMenu: (e: any) => {
						let x = e.clientX;
						let y = e.clientY;
						e.preventDefault();
						onClose();
						setTimeout(() => {
							if (menuList.current) {
								const rectOfMenu: DOMRect = (
									menuList.current as HTMLElement
								).getBoundingClientRect();
								const h = (rectOfMenu.height * 100) / 80; // 80 comes from chakra-ui's scale(.8)
								const w = (rectOfMenu.width * 100) / 80; // 80 comes from chakra-ui's scale(.8)
								if (h + y > window.innerHeight) {
									y = window.innerHeight - (h + 10); // 10 is for just spacing gap
								}
								if (w + x > window.innerWidth) {
									x = window.innerWidth - (w + 10); // 10 is for just spacing gap
								}
								setOffset([x, y]);
							}
							onOpen();
						}, 200); // 200 is transition timer of menu component from chakra ui
					},
				})}
				<Portal>
					<MenuList
						ref={menuList as any}
						style={{ top: offset[1], left: offset[0] }}
						position="absolute"
					>
						<MenuItem
							minH="3rem"
							h="3rem"
							as={Button}
							gap={3}
							alignItems="center"
							variant="dropdown-item"
							onClick={() => onAction('delete')}
						>
							<Icon as={RiDeleteBin6Line} />
							Delete
						</MenuItem>
						<MenuItem
							minH="3rem"
							h="3rem"
							as={Button}
							gap={3}
							alignItems="center"
							variant="dropdown-item"
							onClick={() => onAction('copy')}
						>
							<Icon as={RiFileCopyLine} />
							Create a Copy
						</MenuItem>
					</MenuList>
				</Portal>
			</Menu>
		</>
	) : (
		<>{children}</>
	);
});
