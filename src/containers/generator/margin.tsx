import { ChangeEvent, FC, useState, memo, useRef } from 'react';
import {
	Box,
	Checkbox,
	Flex,
	Heading,
	Input,
	InputGroup,
	InputLeftAddon,
	Tooltip,
} from '@chakra-ui/react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useDebounce } from 'react-use';
import {
	selectHighlightedNodeGridPropState,
	selectHighlightedNodeState,
} from '@/store/selectors/global';
import { gridState } from '@/store/atoms/global';
import { GridKeyType } from '@/common/types';
import { useThemeColors } from '@/hooks';
import { MARGIN_SIDES } from '@/common/enums';
import { CONTAINER_INITIAL_VALUES } from '@/constants/general-settings';
import { convertToArray, overrideSides } from '@/utils/helpers';

const MARGIN_SIDES_LIST: { label: string; value: MARGIN_SIDES }[] = [
	{ label: 'Top', value: MARGIN_SIDES.TOP },
	{ label: 'Right', value: MARGIN_SIDES.RIGHT },
	{ label: 'Bottom', value: MARGIN_SIDES.BOTTOM },
	{ label: 'Left', value: MARGIN_SIDES.LEFT },
];
export const Margin: FC = memo(() => {
	const [sideBySideChecked, setSideBySideChecked] = useState(false);
	const value = useRecoilValue(selectHighlightedNodeGridPropState('margin'));
	const [localValue, setLocalValue] = useState(value);
	const highlightedNode = useRecoilValue(selectHighlightedNodeState);
	const [grid, setGridState] = useRecoilState(gridState);
	const { gray100_dark400 } = useThemeColors();
	const marginSide = useRef<MARGIN_SIDES | null>(null);

	useDebounce(
		() => {
			finalChange(localValue);
		},
		300,
		[localValue]
	);

	const toggleVariant = (e: ChangeEvent<HTMLInputElement>) => {
		const _grid = structuredClone(grid);
		const obj: Record<GridKeyType, any> = _grid[highlightedNode] as Record<
			GridKeyType,
			any
		>;

		if (e.target.checked) {
			obj.margin = `[${obj.margin},${obj.margin},${obj.margin},${obj.margin}]`;
		} else {
			obj.margin = CONTAINER_INITIAL_VALUES.margin;
		}
		setLocalValue(obj.margin);
		setGridState(_grid);
		setSideBySideChecked(e.target.checked);
	};

	const getValueBySide = (side: MARGIN_SIDES) => {
		const [top, right, bottom, left] = convertToArray(localValue);
		switch (side) {
			case MARGIN_SIDES.TOP:
				return top;
			case MARGIN_SIDES.RIGHT:
				return right;
			case MARGIN_SIDES.BOTTOM:
				return bottom ?? top;
			case MARGIN_SIDES.LEFT:
				return left ?? right;
		}
	};

	const finalChange = (targetValue: string) => {
		const _grid = structuredClone(grid);
		const obj: Record<GridKeyType, any> = _grid[highlightedNode] as Record<
			GridKeyType,
			any
		>;
		if (!targetValue) {
			if (marginSide.current) {
				const [top, right, bottom, left] = overrideSides(
					marginSide.current,
					localValue,
					CONTAINER_INITIAL_VALUES.margin
				);
				obj.margin = `[${top},${right},${bottom},${left}]`;
			} else {
				obj.margin = CONTAINER_INITIAL_VALUES.margin;
				setLocalValue(obj.margin);
			}
		} else {
			obj.margin = localValue;
		}
		setGridState(_grid);
	};

	const onBlur = () => {
		marginSide.current = null;
	};

	const onChange = (e: ChangeEvent<HTMLInputElement>, side?: MARGIN_SIDES) => {
		const newValue = e.target.value;
		if (side) {
			marginSide.current = side;
			const [t, r, b, l] = overrideSides(side, localValue, newValue);
			setLocalValue(`[${t},${r},${b},${l}]`);
		} else {
			marginSide.current = null;
			setLocalValue(newValue);
		}
	};

	return (
		<Box p={4}>
			<Heading variant="medium-title" mb={4}>
				Margin (REM)
			</Heading>
			<InputGroup>
				<Tooltip
					motionProps={{ borderRadius: 4 } as any}
					hasArrow
					label="Margin side by side"
					placement="bottom"
					variant="base"
				>
					<InputLeftAddon h="3rem" borderColor={gray100_dark400}>
						<Checkbox
							size="md"
							isChecked={sideBySideChecked}
							onChange={toggleVariant}
						/>
					</InputLeftAddon>
				</Tooltip>
				{sideBySideChecked ? (
					<Flex>
						{MARGIN_SIDES_LIST.map((side) => (
							<Input
								key={side.value}
								variant="base"
								_focus={{
									boxShadow: '0px 0px 2px 1px transparent',
								}}
								marginInlineStart="-1px"
								placeholder={side.label}
								value={getValueBySide(side.value)}
								onChange={(e: ChangeEvent<HTMLInputElement>) =>
									onChange(e, side.value)
								}
								onBlur={onBlur}
								size="sm"
								{...(side.value === MARGIN_SIDES.LEFT
									? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }
									: { borderRadius: 0 })}
							/>
						))}
					</Flex>
				) : (
					<Input
						variant="base"
						value={localValue}
						onBlur={onBlur}
						onChange={onChange}
						size="sm"
						borderTopLeftRadius={0}
						borderBottomLeftRadius={0}
						type="number"
						max={Infinity}
						min={-Infinity}
					/>
				)}
			</InputGroup>
		</Box>
	);
});
