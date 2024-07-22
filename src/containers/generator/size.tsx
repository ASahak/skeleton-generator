import {
	ChangeEvent,
	memo,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
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
import type { GridKeyType, SkeletonKeyType } from 'react-skeleton-builder';
import { RiArrowDownSLine } from 'react-icons/ri';
import { useDebounce } from 'react-use';
import {
	DIRECTION,
	SIZE_UNITS,
	ROOT_KEY,
	SIZE_UNITS_INITIAL_VALUES,
} from 'react-skeleton-builder';
import {
	selectDeviceState,
	selectGridState,
	selectHighlightedNodeGridPropState,
	selectHighlightedNodeState,
} from '@/store/selectors/global';
import { gridState, skeletonsState } from '@/store/atoms/global';
import { IGrid, ISkeleton } from '@/common/types';
import { useThemeColors } from '@/hooks';
import {
	convertInitialZeroToValueItSelf,
	getAdaptiveData,
	getParent,
	isSkeletonHighlighted,
	valueWithPrefix,
} from '@/utils/helpers';
import { MODALS_KEYS, useModal } from '@/providers/custom-modal';

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
		const device = useRecoilValue(selectDeviceState);
		const gridState = useRecoilValue(selectGridState);
		const { setModal, onClose } = useModal();
		const w = useRecoilValue(selectHighlightedNodeGridPropState('w'));
		const h = useRecoilValue(selectHighlightedNodeGridPropState('h'));
		const [localValue, setLocalValue] = useState({ w, h });
		const highlightedNode = useRecoilValue(selectHighlightedNodeState);
		const { gray100_dark400 } = useThemeColors();
		const width = useMemo(() => valueWithPrefix(localValue.w), [localValue.w]);
		const height = useMemo(() => valueWithPrefix(localValue.h), [localValue.h]);

		useDebounce(
			() => {
				const _store = cloneDeep(store);
				const obj: Record<GridKeyType | SkeletonKeyType, any> = _store[
					highlightedNode
				] as Record<GridKeyType | SkeletonKeyType, any>;
				let ref = obj;

				if (device !== 'desktop') {
					ref = obj.responsive[device!];
				}

				// width
				if (width.unit === SIZE_UNITS.FN || width.unit === SIZE_UNITS.AUTO) {
					ref.w = localValue.w;
				} else {
					ref.w = `${width.value}${width.unit}`;
				}
				// height
				if (height.unit === SIZE_UNITS.FN || height.unit === SIZE_UNITS.AUTO) {
					ref.h = localValue.h;
				} else {
					ref.h = `${height.value}${height.unit}`;
				}
				setStore(_store);
			},
			300,
			[localValue.w, localValue.h]
		);

		const parent = useMemo(() => {
			return getAdaptiveData(
				gridState[getParent(highlightedNode)] as IGrid,
				device
			);
		}, [gridState, highlightedNode, device]);

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
			if (v === SIZE_UNITS.FN) {
				const { failed, functionExec } = await createOpener(size);
				if (failed) {
					return;
				}
				setLocalValue((prevState) => ({
					...prevState,
					[size]: eval(functionExec!),
				}));
			} else {
				setLocalValue((prevState) => ({
					...prevState,
					[size]:
						v === SIZE_UNITS.AUTO
							? SIZE_UNITS_INITIAL_VALUES[SIZE_UNITS.AUTO]
							: `${SIZE_UNITS_INITIAL_VALUES[v]}${v}`,
				}));
			}
		};

		const onChange = (e: ChangeEvent<HTMLInputElement>, size: 'h' | 'w') => {
			const newValue = convertInitialZeroToValueItSelf(e.target.value || '0');
			setLocalValue((prevState) => ({
				...prevState,
				[size]: `${newValue}${size === 'w' ? width.unit : height.unit}`,
			}));
		};

		const ableToDisable = (size: 'w' | 'h') => {
			if (size === 'w') {
				return (
					parent.direction === DIRECTION.COLUMN &&
					highlightedNode !== ROOT_KEY &&
					!isSkeletonHighlighted(highlightedNode)
				);
			}
			return (
				parent.direction === DIRECTION.ROW &&
				highlightedNode !== ROOT_KEY &&
				!isSkeletonHighlighted(highlightedNode)
			);
		};

		useEffect(() => {
			setLocalValue({ w, h });
		}, [device]);

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
								borderColor={!width.value ? 'red.400' : gray100_dark400}
								variant="base"
								value={width.value}
								onChange={(e: ChangeEvent<HTMLInputElement>) =>
									onChange(e, 'w')
								}
								size="sm"
								borderTopLeftRadius={0}
								borderBottomLeftRadius={0}
								readOnly={isReadOnly(width.unit) || ableToDisable('w')}
								type={isReadOnly(width.unit) ? 'text' : 'number'}
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
										{width.unit === SIZE_UNITS.AUTO ? '' : width.unit}
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
													{...((width.unit || width.value) === unit.value
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
						{!width.value ? (
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
								borderColor={!height.value ? 'red.400' : gray100_dark400}
								variant="base"
								value={height.value}
								onChange={(e: ChangeEvent<HTMLInputElement>) =>
									onChange(e, 'h')
								}
								size="sm"
								borderTopLeftRadius={0}
								borderBottomLeftRadius={0}
								readOnly={isReadOnly(height.unit) || ableToDisable('h')}
								type={isReadOnly(height.unit) ? 'text' : 'number'}
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
										{height.unit === SIZE_UNITS.AUTO ? '' : height.unit}
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
													{...((height.unit || height.value) === unit.value
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
						{!height.value ? (
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
