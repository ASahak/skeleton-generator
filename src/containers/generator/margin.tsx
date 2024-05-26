import { ChangeEvent, useState, memo, useRef, useEffect } from 'react';
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
import { SetterOrUpdater, useRecoilState, useRecoilValue } from 'recoil';
import { useDebounce } from 'react-use';
import cloneDeep from 'clone-deep';
import {
	selectDeviceState,
	selectHighlightedNodeGridPropState,
	selectHighlightedNodeState,
} from '@/store/selectors/global';
import { gridState, skeletonsState } from '@/store/atoms/global';
import { GridKeyType, IGrid, ISkeleton, SkeletonKeyType } from '@/common/types';
import { useThemeColors } from '@/hooks';
import { MARGIN_SIDES } from '@/common/enums';
import { CONTAINER_INITIAL_VALUES } from '@/constants/general-settings';
import {
	convertInitialZeroToValueItSelf,
	convertToArray,
	isSkeletonHighlighted,
	overrideSides,
} from '@/utils/helpers';

const MARGIN_SIDES_LIST: { label: string; value: MARGIN_SIDES }[] = [
	{ label: 'Top', value: MARGIN_SIDES.TOP },
	{ label: 'Right', value: MARGIN_SIDES.RIGHT },
	{ label: 'Bottom', value: MARGIN_SIDES.BOTTOM },
	{ label: 'Left', value: MARGIN_SIDES.LEFT },
];
export const MarginComponent = memo(
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
		const value = useRecoilValue(selectHighlightedNodeGridPropState('margin'));
		const [localValue, setLocalValue] = useState(value);
		const [sideBySideChecked, setSideBySideChecked] = useState(
			() => convertToArray(value).length > 1
		);
		const highlightedNode = useRecoilValue(selectHighlightedNodeState);
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
			const _store = cloneDeep(store);
			const obj: Record<GridKeyType | SkeletonKeyType, any> = _store[
				highlightedNode
			] as Record<GridKeyType | SkeletonKeyType, any>;
			let ref;

			if (device !== 'desktop') {
				ref = obj.responsive[device!];
			} else {
				ref = obj;
			}

			if (e.target.checked) {
				ref.margin = `[${ref.margin},${ref.margin},${ref.margin},${ref.margin}]`;
			} else {
				ref.margin = CONTAINER_INITIAL_VALUES.margin;
			}
			setLocalValue(ref.margin);
			setStore(_store);
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
			const _store = cloneDeep(store);
			const obj: Record<GridKeyType | SkeletonKeyType, any> = _store[
				highlightedNode
			] as Record<GridKeyType | SkeletonKeyType, any>;
			let ref;

			if (device !== 'desktop') {
				ref = obj.responsive[device!];
			} else {
				ref = obj;
			}

			if (!targetValue) {
				if (marginSide.current) {
					const [top, right, bottom, left] = overrideSides(
						marginSide.current,
						localValue,
						CONTAINER_INITIAL_VALUES.margin
					);
					ref.margin = `[${top},${right},${bottom},${left}]`;
				} else {
					ref.margin = CONTAINER_INITIAL_VALUES.margin;
					setLocalValue(ref.margin);
				}
			} else {
				ref.margin = localValue;
			}
			setStore(_store);
		};

		const onBlur = () => {
			marginSide.current = null;
		};

		const onChange = (
			e: ChangeEvent<HTMLInputElement>,
			side?: MARGIN_SIDES
		) => {
			const newValue = convertInitialZeroToValueItSelf(e.target.value || '0');
			if (side) {
				marginSide.current = side;
				const [t, r, b, l] = overrideSides(side, localValue, newValue);
				setLocalValue(`[${t},${r},${b},${l}]`);
			} else {
				marginSide.current = null;
				setLocalValue(newValue);
			}
		};

		useEffect(() => {
			setLocalValue(value);
		}, [device]);

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
	}
);

export const Margin = () => {
	const highlightedNode = useRecoilValue(selectHighlightedNodeState);
	const [grid, setGridState] = useRecoilState(gridState);
	const [skeleton, setSkeletonState] = useRecoilState(skeletonsState);

	return (
		<MarginComponent
			store={isSkeletonHighlighted(highlightedNode) ? skeleton : grid}
			setStore={
				isSkeletonHighlighted(highlightedNode) ? setSkeletonState : setGridState
			}
		/>
	);
};
