import { ChangeEvent, memo, useCallback, useMemo, useState } from 'react';
import cloneDeep from 'clone-deep';
import {
	Box,
	Button,
	Flex,
	Heading,
	Icon,
	Input,
	InputGroup,
	InputLeftAddon,
	InputRightAddon,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Portal,
	Text,
	Tooltip,
} from '@chakra-ui/react';
import { SetterOrUpdater, useRecoilState, useRecoilValue } from 'recoil';
import { RxHeight, RxWidth } from 'react-icons/rx';
import {
	selectGridState,
	selectHighlightedNodeGridPropState,
	selectHighlightedNodeState,
} from '@/store/selectors/global';
import { gridState, skeletonsState } from '@/store/atoms/global';
import { RiArrowDownSLine } from 'react-icons/ri';
import { useDebounce } from 'react-use';
import { GridKeyType, IGrid, ISkeleton, SkeletonKeyType } from '@/common/types';
import { useThemeColors } from '@/hooks';
import { DIRECTION, SIZE_UNITS } from '@/common/enums';
import {
	getParent,
	isSkeletonHighlighted,
	valueWithPrefix,
} from '@/utils/helpers';
import { MODALS_KEYS, useModal } from '@/providers/custom-modal';
import {
	ROOT_KEY,
	SIZE_UNITS_INITIAL_VALUES,
} from '@/constants/general-settings';

const UNITS_OPTIONS: {
	label: SIZE_UNITS;
	value: SIZE_UNITS;
}[] = Object.values(SIZE_UNITS).map((unit) => ({ label: unit, value: unit }));
const SizeComponent = memo(
	({
		store,
		setStore,
	}: {
		store: Record<string, IGrid> | Record<string, ISkeleton>;
		setStore:
			| SetterOrUpdater<Record<string, IGrid>>
			| SetterOrUpdater<Record<string, ISkeleton>>;
	}) => {
		const gridState = useRecoilValue(selectGridState);
		const { setModal, onClose } = useModal();
		const width = valueWithPrefix(
			useRecoilValue(selectHighlightedNodeGridPropState('w'))
		);
		const height = valueWithPrefix(
			useRecoilValue(selectHighlightedNodeGridPropState('h'))
		);
		const [localValue, setLocalValue] = useState({ width, height });
		const highlightedNode = useRecoilValue(selectHighlightedNodeState);
		const { gray100_dark400 } = useThemeColors();

		useDebounce(
			() => {
				const _store = cloneDeep(store);
				const obj: Record<GridKeyType | SkeletonKeyType, any> = _store[
					highlightedNode
				] as Record<GridKeyType | SkeletonKeyType, any>;
				obj.w = `${localValue.width.value}${localValue.width.unit}`;
				obj.h = `${localValue.height.value}${localValue.height.unit}`;
				setStore(_store);
			},
			300,
			[localValue]
		);

		const parent = useMemo(() => {
			return gridState[getParent(highlightedNode)] as IGrid;
		}, [gridState, highlightedNode]);

		const createOpener = useCallback(
			async (
				propKey: 'w' | 'h'
			): Promise<{
				ok?: boolean;
				failed?: boolean;
				msg?: string;
				functionExec?: string;
			}> =>
				await new Promise((resolve) => {
					const handleClose = () => {
						resolve({ failed: true, msg: 'Canceled by user!' });
					};

					const handleOK = (v: string) => {
						onClose();
						resolve({ ok: true, functionExec: v || 'auto' });
					};

					setModal({
						key: MODALS_KEYS.FUNCTION_UNIT_EDITOR,
						props: {
							propKey,
							title: `Your function here:`,
							onApply: handleOK,
							onClose: handleClose,
						},
					});
				}),
			[]
		);

		const isReadOnly = (unit: string) => {
			return unit === SIZE_UNITS.AUTO || unit === SIZE_UNITS.FN;
		};

		const onSelectUnit = async (v: SIZE_UNITS, size: 'w' | 'h') => {
			const _store = cloneDeep(store);
			const obj: Record<GridKeyType | SkeletonKeyType, any> = _store[
				highlightedNode
			] as Record<GridKeyType | SkeletonKeyType, any>;
			if (v === SIZE_UNITS.FN) {
				const { failed, functionExec } = await createOpener(size);
				if (failed) {
					return;
				}
				obj[size] = eval(functionExec!);
			} else {
				obj[size] = `${SIZE_UNITS_INITIAL_VALUES[v]}${v}`;
			}
			setStore(_store);
		};

		const onChange = (
			e: ChangeEvent<HTMLInputElement>,
			size: 'height' | 'width'
		) => {
			const newValue = e.target.value ?? '';
			setLocalValue((prevState) => ({
				...prevState,
				[size]: { value: newValue, unit: prevState[size].unit },
			}));
		};

		const ableToDisable = (size: 'w' | 'h') => {
			if (size === 'w') {
				return (
					parent.direction === DIRECTION.COLUMN && highlightedNode !== ROOT_KEY
				);
			}
			return parent.direction === DIRECTION.ROW && highlightedNode !== ROOT_KEY;
		};

		return (
			<Box p={4}>
				<Heading variant="medium-title" mb={4}>
					Size
				</Heading>
				<Flex gap={4}>
					<Box>
						<InputGroup>
							<Tooltip
								motionProps={{ borderRadius: 4 } as any}
								hasArrow
								label="Width"
								placement="top"
								variant="base"
							>
								<InputLeftAddon h="3rem" px={3} borderColor={gray100_dark400}>
									<Icon fontSize="2xl" as={RxWidth} />
								</InputLeftAddon>
							</Tooltip>
							<Input
								isTruncated
								borderColor={
									!localValue.width.value ? 'red.400' : gray100_dark400
								}
								variant="base"
								value={localValue.width.value}
								onChange={(e: ChangeEvent<HTMLInputElement>) =>
									onChange(e, 'width')
								}
								size="sm"
								borderTopLeftRadius={0}
								borderBottomLeftRadius={0}
								readOnly={
									isReadOnly(localValue.width.unit) || ableToDisable('w')
								}
								type={isReadOnly(localValue.width.unit) ? 'text' : 'number'}
							/>
							<InputRightAddon h="3rem" p={0} borderColor={gray100_dark400}>
								<Menu
									variant="base"
									placement="bottom-end"
									closeOnSelect={false}
								>
									<MenuButton
										isDisabled={ableToDisable('w')}
										as={Button}
										w="full"
										textAlign="left"
										bgColor="transparent"
										border="none"
										px={2}
										size="sm"
										rightIcon={<Icon fontSize="1.6rem" as={RiArrowDownSLine} />}
										variant="menu-outline"
										gap={0}
									>
										{localValue.width.unit === SIZE_UNITS.AUTO
											? ''
											: localValue.width.unit}
									</MenuButton>
									<Portal>
										<MenuList
											minW="xss"
											maxH="20rem"
											overflowX="hidden"
											className="custom-scrollbar-content"
											sx={{
												'&::-webkit-scrollbar-track': {
													backgroundColor: gray100_dark400,
												},
											}}
										>
											{UNITS_OPTIONS.map((unit) => (
												<MenuItem
													as={Button}
													size="sm"
													key={unit.value}
													onClick={() => onSelectUnit(unit.value, 'w')}
													gap={2}
													{...((localValue.width.unit ||
														localValue.width.value) === unit.value
														? {
																bgColor: 'brand.500 !important',
																color: 'white !important',
																_hover: {
																	bgColor: 'brand.500 !important',
																	color: 'white !important',
																},
															}
														: { bgColor: 'transparent' })}
												>
													{unit.label}
												</MenuItem>
											))}
										</MenuList>
									</Portal>
								</Menu>
							</InputRightAddon>
						</InputGroup>
						{!localValue.width.value ? (
							<Text color="red.400" mt={1}>
								Required*
							</Text>
						) : null}
					</Box>
					<Box>
						<InputGroup>
							<Tooltip
								motionProps={{ borderRadius: 4 } as any}
								hasArrow
								label="Height"
								placement="top"
								variant="base"
							>
								<InputLeftAddon h="3rem" px={3} borderColor={gray100_dark400}>
									<Icon fontSize="2xl" as={RxHeight} />
								</InputLeftAddon>
							</Tooltip>
							<Input
								isTruncated
								borderColor={
									!localValue.height.value ? 'red.400' : gray100_dark400
								}
								variant="base"
								value={localValue.height.value}
								onChange={(e: ChangeEvent<HTMLInputElement>) =>
									onChange(e, 'height')
								}
								size="sm"
								borderTopLeftRadius={0}
								borderBottomLeftRadius={0}
								readOnly={
									isReadOnly(localValue.height.unit) || ableToDisable('h')
								}
								type={isReadOnly(localValue.height.unit) ? 'text' : 'number'}
							/>
							<InputRightAddon h="3rem" p={0} borderColor={gray100_dark400}>
								<Menu
									variant="base"
									placement="bottom-end"
									closeOnSelect={false}
								>
									<MenuButton
										isDisabled={ableToDisable('h')}
										as={Button}
										w="full"
										textAlign="left"
										bgColor="transparent"
										border="none"
										px={2}
										size="sm"
										rightIcon={<Icon fontSize="1.6rem" as={RiArrowDownSLine} />}
										variant="menu-outline"
										gap={0}
									>
										{localValue.height.unit === SIZE_UNITS.AUTO
											? ''
											: localValue.height.unit}
									</MenuButton>
									<Portal>
										<MenuList
											minW="xss"
											maxH="20rem"
											overflowX="hidden"
											className="custom-scrollbar-content"
											sx={{
												'&::-webkit-scrollbar-track': {
													backgroundColor: gray100_dark400,
												},
											}}
										>
											{UNITS_OPTIONS.map((unit) => (
												<MenuItem
													as={Button}
													size="sm"
													key={unit.value}
													onClick={() => onSelectUnit(unit.value, 'h')}
													gap={2}
													{...((localValue.height.unit ||
														localValue.height.value) === unit.value
														? {
																bgColor: 'brand.500 !important',
																color: 'white !important',
																_hover: {
																	bgColor: 'brand.500 !important',
																	color: 'white !important',
																},
															}
														: { bgColor: 'transparent' })}
												>
													{unit.label}
												</MenuItem>
											))}
										</MenuList>
									</Portal>
								</Menu>
							</InputRightAddon>
						</InputGroup>
						{!localValue.height.value ? (
							<Text color="red.400" mt={1}>
								Required*
							</Text>
						) : null}
					</Box>
				</Flex>
			</Box>
		);
	}
);

export const Size = () => {
	const highlightedNode = useRecoilValue(selectHighlightedNodeState);
	const [grid, setGridState] = useRecoilState(gridState);
	const [skeleton, setSkeletonState] = useRecoilState(skeletonsState);

	return (
		<SizeComponent
			store={isSkeletonHighlighted(highlightedNode) ? skeleton : grid}
			setStore={
				isSkeletonHighlighted(highlightedNode) ? setSkeletonState : setGridState
			}
		/>
	);
};
