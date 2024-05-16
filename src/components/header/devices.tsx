import { memo } from 'react';
import { Flex, Icon } from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import {
	SlScreenDesktop,
	SlScreenSmartphone,
	SlScreenTablet,
} from 'react-icons/sl';
import { deviceState } from '@/store/atoms/global';

export const Devices = memo(() => {
	const [device, setDeviceState] = useRecoilState(deviceState);

	return (
		<Flex gap={4} flex={1} justifyContent="center" alignItems="center">
			<Flex
				position="relative"
				_before={{
					display: device === 'mobile' ? 'block' : 'none',
					content: '""',
					position: 'absolute',
					w: 'full',
					h: '.1rem',
					bgColor: 'brand.500',
					bottom: '-.7rem',
				}}
			>
				<Icon
					cursor="pointer"
					as={SlScreenSmartphone}
					fontSize="4xl"
					onClick={() => setDeviceState('mobile')}
				/>
			</Flex>
			<Flex
				position="relative"
				_before={{
					display: device === 'tablet' ? 'block' : 'none',
					content: '""',
					position: 'absolute',
					w: 'full',
					h: '.1rem',
					bgColor: 'brand.500',
					bottom: '-.7rem',
				}}
			>
				<Icon
					cursor="pointer"
					as={SlScreenTablet}
					fontSize="4xl"
					onClick={() => setDeviceState('tablet')}
				/>
			</Flex>
			<Flex
				position="relative"
				_before={{
					display: device === 'desktop' ? 'block' : 'none',
					content: '""',
					position: 'absolute',
					w: 'full',
					h: '.1rem',
					bgColor: 'brand.500',
					bottom: '-.7rem',
				}}
			>
				<Icon
					cursor="pointer"
					as={SlScreenDesktop}
					fontSize="4xl"
					onClick={() => setDeviceState('desktop')}
				/>
			</Flex>
		</Flex>
	);
});
