import { ChangeEvent, FC, memo, useEffect, useState } from 'react';
import {
	Box,
	Button,
	Heading,
	Icon,
	Input,
	InputGroup,
	InputRightAddon,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Portal,
	Text,
} from '@chakra-ui/react';
import { useDebounce } from 'react-use';
import { useRecoilState, useRecoilValue } from 'recoil';
import { RiArrowDownSLine } from 'react-icons/ri';
import cloneDeep from 'clone-deep';
import {
	selectDeviceState,
	selectHighlightedNodeGridPropState,
	selectHighlightedNodeState,
} from '@/store/selectors/global';
import { skeletonsState } from '@/store/atoms/global';
import { SkeletonKeyType } from '@/common/types';
import {
	convertInitialZeroToValueItSelf,
	valueWithPrefix,
} from '@/utils/helpers';
import { SIZE_UNITS } from '@/common/enums';
import { useThemeColors } from '@/hooks';

const UNITS_OPTIONS = [SIZE_UNITS.PX, SIZE_UNITS.REM, SIZE_UNITS.PERCENT].map(
	(unit) => ({ label: unit, value: unit })
);
export const Radius: FC = memo(() => {
	const device = useRecoilValue(selectDeviceState);
	const radius = useRecoilValue(selectHighlightedNodeGridPropState('r'));
	const highlightedNode = useRecoilValue(selectHighlightedNodeState);
	const [skeletons, setSkeletonsState] = useRecoilState(skeletonsState);
	const [localValue, setLocalValue] = useState(radius);
	const { gray100_dark400 } = useThemeColors();
	const { unit, value } = valueWithPrefix(localValue);

	useDebounce(
		() => {
			const _skeletons = cloneDeep(skeletons);
			const obj: Record<SkeletonKeyType, any> = _skeletons[
				highlightedNode
			] as Record<SkeletonKeyType, any>;
			let ref;

			if (device !== 'desktop') {
				ref = obj.responsive[device!];
			} else {
				ref = obj;
			}

			ref.r = `${value}${unit}`;
			setSkeletonsState(_skeletons);
		},
		300,
		[value, unit]
	);

	const onSelectUnit = async (v: SIZE_UNITS) => {
		setLocalValue(`${value}${v}`);
	};

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		const newValue = convertInitialZeroToValueItSelf(e.target.value || '0');
		setLocalValue(`${newValue}${unit}`);
	};

	useEffect(() => {
		setLocalValue(radius);
	}, [device]);

	return (
		<Box p={4}>
			<Heading variant="medium-title" mb={4}>
				Radius
			</Heading>
			<InputGroup>
				<Input
					borderColor={!value ? 'red.400' : gray100_dark400}
					variant="base"
					value={value}
					onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e)}
					size="sm"
					type="number"
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
							{unit}
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
								{UNITS_OPTIONS.map((u) => (
									<MenuItem
										as={Button}
										size="sm"
										key={u.value}
										onClick={() => onSelectUnit(u.value)}
										gap={2}
										{...(unit === u.value
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
										{u.label}
									</MenuItem>
								))}
							</MenuList>
						</Portal>
					</Menu>
				</InputRightAddon>
			</InputGroup>
			{!value ? (
				<Text color="red.400" mt={1}>
					Required*
				</Text>
			) : null}
		</Box>
	);
});
