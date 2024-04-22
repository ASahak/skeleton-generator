import { ChangeEvent, FC, memo, useCallback } from 'react';
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
import { useRecoilState, useRecoilValue } from 'recoil';
import { RxHeight, RxWidth } from 'react-icons/rx';
import {
	selectHighlightedNodeGridPropState,
	selectHighlightedNodeState,
} from '@/store/selectors/global';
import { gridState } from '@/store/atoms/global';
import { RiArrowDownSLine } from 'react-icons/ri';
import { GridKeyType } from '@/common/types';
import { useThemeColors } from '@/hooks';
import { SIZE_UNITS } from '@/common/enums';
import { valueWithPrefix } from '@/utils/helpers';
import { MODALS_KEYS, useModal } from '@/providers/custom-modal';

const UNITS_OPTIONS: {
	label: SIZE_UNITS;
	value: SIZE_UNITS;
}[] = Object.values(SIZE_UNITS).map((unit) => ({ label: unit, value: unit }));
export const Size: FC = memo(() => {
	const { setModal, onClose } = useModal();
	const width = valueWithPrefix(
		useRecoilValue(selectHighlightedNodeGridPropState('w'))
	);
	const height = valueWithPrefix(
		useRecoilValue(selectHighlightedNodeGridPropState('h'))
	);
	const highlightedNode = useRecoilValue(selectHighlightedNodeState);
	const [grid, setGridState] = useRecoilState(gridState);
	const { gray100_dark400 } = useThemeColors();

	const createOpener = useCallback(
		async (): Promise<{
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
					resolve({ ok: true, functionExec: v });
				};

				setModal({
					key: MODALS_KEYS.FUNCTION_UNIT_EDITOR,
					props: {
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
		const _grid = cloneDeep(grid);
		const obj: Record<GridKeyType, any> = _grid[highlightedNode] as Record<
			GridKeyType,
			any
		>;
		if (v === SIZE_UNITS.FN) {
			const { failed, functionExec } = await createOpener();
			if (failed) {
				return;
			}
			obj[size] = eval(functionExec!);
		} else if (v === SIZE_UNITS.AUTO) {
			obj[size] = SIZE_UNITS.AUTO;
		} else {
			if (size === 'w') {
				const value =
					v === SIZE_UNITS.FR
						? 1
						: width.value === SIZE_UNITS.AUTO
							? 100
							: width.value;
				obj[size] = `${value}${v}`;
			} else {
				const value =
					v === SIZE_UNITS.FR
						? 1
						: height.value === SIZE_UNITS.AUTO
							? 100
							: height.value;
				obj[size] = `${value}${v}`;
			}
		}
		setGridState(_grid);
	};

	const onChange = (e: ChangeEvent<HTMLInputElement>, size: 'w' | 'h') => {
		const _grid = cloneDeep(grid);
		const obj: Record<GridKeyType, any> = _grid[highlightedNode] as Record<
			GridKeyType,
			any
		>;
		const newValue = e.target.value ?? '';

		if (size === 'w') {
			obj.w = `${newValue}${width.unit}`;
		} else {
			obj.h = `${newValue}${height.unit}`;
		}
		setGridState(_grid);
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
							borderColor={!width.value ? 'red.400' : gray100_dark400}
							variant="base"
							value={width.value}
							onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e, 'w')}
							size="sm"
							borderTopLeftRadius={0}
							borderBottomLeftRadius={0}
							readOnly={isReadOnly(width.unit)}
							type={isReadOnly(width.unit) ? 'text' : 'number'}
						/>
						<InputRightAddon h="3rem" p={0} borderColor={gray100_dark400}>
							<Menu variant="base" placement="bottom-end" closeOnSelect={false}>
								<MenuButton
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
												variant="dropdown-item"
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
							onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e, 'h')}
							size="sm"
							borderTopLeftRadius={0}
							borderBottomLeftRadius={0}
							readOnly={isReadOnly(height.unit)}
							type={isReadOnly(height.unit) ? 'text' : 'number'}
						/>
						<InputRightAddon h="3rem" p={0} borderColor={gray100_dark400}>
							<Menu variant="base" placement="bottom-end" closeOnSelect={false}>
								<MenuButton
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
												variant="dropdown-item"
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
});
