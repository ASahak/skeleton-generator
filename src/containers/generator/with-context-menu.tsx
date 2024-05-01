import React, { ReactNode, useRef, useState, memo } from 'react';
import {
	Menu,
	MenuItem,
	MenuList,
	Icon,
	useDisclosure,
	Portal,
} from '@chakra-ui/react';
import cloneDeep from 'clone-deep';
import { RiDeleteBin6Line, RiFileCopyLine } from 'react-icons/ri';
import { MODALS_KEYS, useModal } from '@/providers/custom-modal';
import { useRecoilState } from 'recoil';
import {
	gridState,
	highlightedNodeState,
	skeletonsState,
} from '@/store/atoms/global';
import { GridKeyType, SkeletonKeyType } from '@/common/types';
import {
	findAbsentIndex,
	getParent,
	isSkeletonHighlighted,
} from '@/utils/helpers';
import { DEFAULT_REPEAT_COUNT, ROOT_KEY } from '@/constants/general-settings';

enum ACTIONS {
	COPY = 'copy',
	DELETE = 'delete',
}
type IProps = {
	isAble: boolean;
	children: ReactNode;
	disabledState?: Partial<Record<ACTIONS, boolean>> | undefined;
};
export const WithContextMenu = memo(
	({ isAble, children, disabledState }: IProps) => {
		const { setModal, onClose: onModalClose } = useModal();
		const [highlightedNode, setHighlightedNode] =
			useRecoilState(highlightedNodeState);
		const { isOpen, onOpen, onClose } = useDisclosure();
		const [offset, setOffset] = useState([0, 0]);
		const [grid, setGridState] = useRecoilState(gridState);
		const [skeletons, setSkeletonsState] = useRecoilState(skeletonsState);
		const menuList = useRef();

		const onDelete = () => {
			const _grid: Record<string, any> = cloneDeep(grid);
			const _skeletons: Record<string, any> = cloneDeep(skeletons);
			const parentKey = getParent(highlightedNode);

			if (isSkeletonHighlighted(highlightedNode)) {
				const _skeletons: Record<string, any> = cloneDeep(skeletons);
				_grid[parentKey].skeletons.splice(
					_grid[parentKey].skeletons.indexOf(highlightedNode),
					1
				);
				if (_grid[parentKey].skeletons.length === 0) {
					_grid[parentKey].repeatCount = DEFAULT_REPEAT_COUNT;
					delete _grid[parentKey].skeletons;
				}

				delete _skeletons[highlightedNode];
				setSkeletonsState(_skeletons);
			} else {
				if (parentKey in _grid) {
					_grid[parentKey].children.splice(
						_grid[parentKey].children.indexOf(highlightedNode),
						1
					);
					if (_grid[parentKey].children.length === 0) {
						_grid[parentKey].repeatCount = DEFAULT_REPEAT_COUNT;
						delete _grid[parentKey].children;
					}
				}

				if (_grid[highlightedNode].children?.length) {
					let shouldUpdateSkeletons = false;
					const removeChildren = (children: GridKeyType[]) => {
						children.forEach((e) => {
							if (_grid[e].children?.length) {
								removeChildren(_grid[e].children);
							} else if (_grid[e].skeletons?.length) {
								shouldUpdateSkeletons = true;
								_grid[e].skeletons.forEach((s: string) => {
									delete _skeletons[s];
								});
							}
							delete _grid[e];
						});
					};
					removeChildren(_grid[highlightedNode].children);

					if (shouldUpdateSkeletons) {
						setSkeletonsState(_skeletons);
					}
				} else if (_grid[highlightedNode].skeletons?.length) {
					const _skeletons: Record<string, any> = cloneDeep(skeletons);

					_grid[highlightedNode].skeletons.forEach((s: string) => {
						delete _skeletons[s];
					});
					setSkeletonsState(_skeletons);
				}
				delete _grid[highlightedNode];
			}
			setHighlightedNode(parentKey);
			setGridState(_grid);
			onModalClose();
		};

		const onCopy = () => {
			const _grid: Record<string, any> = cloneDeep(grid);
			const parentKey = getParent(highlightedNode);

			if (parentKey in _grid) {
				const obj: Record<string, any> = _grid[parentKey];
				if (isSkeletonHighlighted(highlightedNode)) {
					const newRoot = parentKey + '_skeleton_';
					const newKey =
						newRoot + findAbsentIndex(newRoot, obj.skeletons || []);
					const _skeletons: Record<string, any> = cloneDeep(skeletons);
					_grid[parentKey].skeletons.push(newKey);
					_skeletons[newKey] = cloneDeep(_skeletons[highlightedNode]);
					setSkeletonsState(_skeletons);
					setGridState(_grid);
					return;
				}

				const newRoot = parentKey + '_';
				const newKey = newRoot + findAbsentIndex(newRoot, obj.children || []);
				_grid[newKey] = cloneDeep(_grid[highlightedNode]);
				const _skeletons: Record<string, any> = cloneDeep(skeletons);

				const generateSkeletonsClone = (
					skeletons: SkeletonKeyType[],
					newKey: string
				) => {
					_grid[newKey].skeletons = [];
					skeletons.forEach((c: string) => {
						const newChild = newKey + c.substring(newKey.length, c.length);
						_grid[newKey].skeletons.push(newChild);
						_skeletons[newChild] = cloneDeep(_skeletons[c]);
					});
				};

				if (_grid[highlightedNode].children?.length) {
					let shouldUpdateSkeletons = false;
					const generateClone = (children: GridKeyType[], newKey: string) => {
						_grid[newKey].children = [];
						children.forEach((c: string) => {
							const newChild = newKey + c.substring(newKey.length, c.length);
							_grid[newKey].children.push(newChild);
							_grid[newChild] = cloneDeep(_grid[c]);
							if (_grid[c].children?.length) {
								generateClone(_grid[c].children, newChild);
							} else if (_grid[c].skeletons?.length) {
								shouldUpdateSkeletons = true;
								generateSkeletonsClone(_grid[c].skeletons, newChild);
							}
						});
					};

					generateClone(_grid[highlightedNode].children, newKey);
					if (shouldUpdateSkeletons) {
						setSkeletonsState(_skeletons);
					}
				} else if (_grid[highlightedNode].skeletons?.length) {
					generateSkeletonsClone(_grid[highlightedNode].skeletons, newKey);
					setSkeletonsState(_skeletons);
				}
				obj.children = (obj.children || []).concat(newKey);
				setGridState(_grid);
			}
		};

		const onAction = (actionType: ACTIONS) => {
			switch (actionType) {
				case ACTIONS.DELETE:
					setModal({
						key: MODALS_KEYS.CONFIRM_DELETE,
						props: {
							title: `Are you sure to delete this item: ${highlightedNode}`,
							onCancel: onModalClose,
							onConfirm: onDelete,
						},
					});
					break;
				case ACTIONS.COPY:
					onCopy();
					break;
				default:
					break;
			}
		};

		const onContextMenu = (e: any) => {
			if (highlightedNode === ROOT_KEY) {
				return;
			}

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
		};

		return isAble ? (
			<>
				<Menu isOpen={isOpen} onClose={onClose} variant="base">
					{React.cloneElement(children as any, {
						onContextMenu,
					})}
					<Portal>
						<MenuList
							ref={menuList as any}
							style={{ top: offset[1], left: offset[0] }}
							position="absolute"
						>
							<MenuItem
								isDisabled={disabledState?.[ACTIONS.DELETE]}
								minH="3rem"
								h="3rem"
								gap={3}
								alignItems="center"
								onClick={() => onAction(ACTIONS.DELETE)}
							>
								<Icon as={RiDeleteBin6Line} />
								Delete
							</MenuItem>
							<MenuItem
								isDisabled={disabledState?.[ACTIONS.COPY]}
								minH="3rem"
								h="3rem"
								gap={3}
								alignItems="center"
								onClick={() => onAction(ACTIONS.COPY)}
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
	}
);
