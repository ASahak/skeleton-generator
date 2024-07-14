import { ChangeEvent, useMemo, useState } from 'react';
import {
	Box,
	Button,
	Flex,
	Heading,
	NumberInput,
	NumberInputField,
	VStack,
	Text,
	Checkbox,
} from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import { filterFromPx } from 'react-skeleton-builder';
import type { Device } from 'react-skeleton-builder';
import { useThemeColors } from '@/hooks';
import {
	adaptiveDeviceEnabledState,
	autoDeviceCheckingIsActiveState,
	breakpointsState,
	deviceState,
} from '@/store/atoms/global';
import { breakpoints as breakpointsTheme } from '@/styles/theme';
import { useModal } from '@/providers/custom-modal';

export const Breakpoints = () => {
	const { onClose } = useModal();
	const { white_dark650 } = useThemeColors();
	const [breakpoints, setBreakpoints] = useRecoilState(breakpointsState);
	const [localValue, setLocalValue] = useState(breakpoints);
	const [adaptiveDeviceEnabled, setAdaptiveDeviceEnabled] = useRecoilState(
		adaptiveDeviceEnabledState
	);
	const [, setDeviceState] = useRecoilState(deviceState);
	const [, setIsAutoCheckingDevice] = useRecoilState(
		autoDeviceCheckingIsActiveState
	);

	const _mobile = useMemo(
		() => filterFromPx(localValue.mobile),
		[localValue.mobile]
	);

	const _tablet = useMemo(
		() => filterFromPx(localValue.tablet),
		[localValue.tablet]
	);

	const _desktop = useMemo(
		() => filterFromPx(localValue.desktop),
		[localValue.desktop]
	);

	const onApply = () => {
		setBreakpoints(localValue);
		onClose();
	};

	const renderErrorMessage = (device: Device, min: number) => {
		switch (device) {
			case 'mobile': {
				const hasOverlap = _mobile >= _tablet || _mobile >= _desktop;
				const reachedMin = _mobile < min;

				const msg =
					_mobile < 0
						? 'Negative value'
						: reachedMin
							? `Can't be less than min value: ${min}`
							: hasOverlap
								? 'Mobile has overlap'
								: null;

				return msg ? (
					<Text color="red.400" fontSize="1.2rem" mt={1}>
						{msg}
					</Text>
				) : null;
			}
			case 'tablet': {
				const hasOverlap = _tablet <= _mobile;
				const reachedMin = _tablet < min;

				const msg =
					_tablet < 0
						? 'Negative value'
						: reachedMin
							? `Can't be less than min value: ${min}`
							: hasOverlap
								? 'Tablet has overlap'
								: null;
				return msg ? (
					<Text color="red.400" fontSize="1.2rem" mt={1}>
						{msg}
					</Text>
				) : null;
			}
			default:
				return null;
		}
	};

	const toggleAdaptiveDevice = (e: ChangeEvent<HTMLInputElement>) => {
		setAdaptiveDeviceEnabled(e.target.checked);
		if (!e.target.checked) {
			setDeviceState('desktop');
		} else {
			setIsAutoCheckingDevice(true);
		}
	};

	const mobileError = renderErrorMessage(
		'mobile',
		filterFromPx(breakpointsTheme.xs)
	);
	const tabletError = renderErrorMessage('tablet', _mobile + 1);
	return (
		<VStack spacing={8}>
			<Box w="full">
				<Checkbox
					mb={8}
					size="lg"
					isChecked={adaptiveDeviceEnabled}
					onChange={toggleAdaptiveDevice}
				>
					<Text ml={2} fontSize="1.4rem">
						Enable Adaptive devices mode
					</Text>
				</Checkbox>
				<Heading variant="medium-title" mb={4}>
					Mobile (max-width)
				</Heading>
				<NumberInput
					min={filterFromPx(breakpointsTheme.xs)}
					max={_tablet - 1}
					clampValueOnBlur={false}
					value={_mobile}
					variant="base"
					isDisabled={!adaptiveDeviceEnabled}
				>
					<NumberInputField
						placeholder="Mobile max-width resolution"
						fontSize="1.4rem"
						bgColor={white_dark650}
						onChange={(e) =>
							setLocalValue({ ...localValue, mobile: `${e.target.value}px` })
						}
					/>
				</NumberInput>
				{mobileError}
			</Box>
			<Box w="full">
				<Heading variant="medium-title" mb={4}>
					Tablet (max-width)
				</Heading>
				<NumberInput
					isDisabled={!adaptiveDeviceEnabled}
					min={_mobile + 1}
					max={_desktop - 1}
					clampValueOnBlur={false}
					value={filterFromPx(localValue.tablet)}
					variant="base"
				>
					<NumberInputField
						placeholder="Mobile max-width resolution"
						fontSize="1.4rem"
						bgColor={white_dark650}
						onChange={(e) =>
							setLocalValue({
								...localValue,
								tablet: `${e.target.value}px`,
								desktop: `${Number(e.target.value) + 1}px`,
							})
						}
					/>
				</NumberInput>
				{tabletError}
			</Box>
			<Box w="full">
				<Heading variant="medium-title" mb={4}>
					Desktop (min-width)
				</Heading>
				<NumberInput
					isDisabled={!adaptiveDeviceEnabled}
					isReadOnly
					min={_tablet + 1}
					clampValueOnBlur={false}
					value={_desktop}
					variant="base"
				>
					<NumberInputField
						cursor="not-allowed !important"
						placeholder="Desktop min-width resolution"
						fontSize="1.4rem"
						bgColor={white_dark650}
						onChange={(e) =>
							setLocalValue({ ...localValue, desktop: `${e.target.value}px` })
						}
					/>
				</NumberInput>
			</Box>
			<Flex justifyContent="flex-end" w="full">
				<Button
					variant="base"
					size="sm"
					onClick={onApply}
					isDisabled={!!mobileError || !!tabletError || !adaptiveDeviceEnabled}
				>
					Apply changes
				</Button>
			</Flex>
		</VStack>
	);
};
