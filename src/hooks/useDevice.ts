import { useBreakpointValue } from '@chakra-ui/react';

export const useDevice = () => {
	const mobile = useBreakpointValue({ base: true, sm: false }, { ssr: false });
	const tablet = useBreakpointValue(
		{ base: false, sm: true, lg: false },
		{ ssr: false }
	);
	const desktop = useBreakpointValue(
		{ base: false, sm: false, lg: true },
		{ ssr: false }
	);

	return {
		mobile: !!mobile,
		tablet: !!tablet,
		desktop: !!desktop,
	};
};
