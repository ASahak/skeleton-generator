import { useColorModeValue } from '@chakra-ui/react';

export const useThemeColors = () => {
	const white_dark700 = useColorModeValue('white', 'darcula.700');
	const gray100_dark400 = useColorModeValue('gray.100', 'darcula.400');
	const gray100_dark600 = useColorModeValue('gray.100', 'darcula.600');
	const gray100_dark500 = useColorModeValue('gray.100', 'darcula.500');
	const gray300_white = useColorModeValue('gray.300', 'white');
	const gray300_gray200 = useColorModeValue('gray.300', 'gray.200');
	const brand500_dark700 = useColorModeValue('brand.500', 'darcula.700');
	const brand500_white = useColorModeValue('brand.500', 'white');
	const gray50_dark400 = useColorModeValue('gray.50', 'darcula.400');
	const gray50_dark500 = useColorModeValue('gray.50', 'darcula.500');
	const gray400_white = useColorModeValue('gray.400', 'white');
	const gray200_white = useColorModeValue('gray.200', 'white');
	const gray250_white = useColorModeValue('gray.250', 'white');
	const gray800_white = useColorModeValue('gray.800', 'white');
	const gray800_gray100 = useColorModeValue('gray.800', 'gray.100');
	const gray800_gray50 = useColorModeValue('gray.800', 'gray.50');
	const white_dark300 = useColorModeValue('white', 'darcula.300');
	const black_white = useColorModeValue('black', 'white');
	const white_dark400 = useColorModeValue('white', 'darcula.400');
	const white_dark550 = useColorModeValue('white', 'darcula.550');
	const gray350_gray50 = useColorModeValue('gray.350', 'gray.50');
	const gray50_dark300 = useColorModeValue('gray.50', 'darcula.300');
	const gray300_dark100 = useColorModeValue('gray.300', 'darcula.100');
	const white_dark500 = useColorModeValue('white', 'darcula.500');
	const brand500_dark400 = useColorModeValue('brand.500', 'darcula.400');
	const gray80_dark800 = useColorModeValue('gray.80', 'darcula.800');
	const gray100_dark300 = useColorModeValue('gray.100', 'darcula.300');
	const gray600_gray100 = useColorModeValue('gray.600', 'gray.100');
	const dark300_gray100 = useColorModeValue('darcula.300', 'gray.100');
	const white_dark650 = useColorModeValue('white', 'darcula.650');
	const blackAlpha50_dark300 = useColorModeValue(
		'blackAlpha.50',
		'darcula.300'
	);

	return {
		white_dark700,
		gray100_dark400,
		gray50_dark400,
		gray400_white,
		gray200_white,
		gray800_white,
		gray100_dark500,
		white_dark300,
		black_white,
		gray300_white,
		gray800_gray100,
		gray800_gray50,
		brand500_dark700,
		brand500_dark400,
		gray250_white,
		brand500_white,
		gray300_gray200,
		gray100_dark600,
		gray50_dark500,
		white_dark400,
		gray350_gray50,
		gray50_dark300,
		gray300_dark100,
		white_dark500,
		gray80_dark800,
		gray100_dark300,
		gray600_gray100,
		dark300_gray100,
		blackAlpha50_dark300,
		white_dark550,
		white_dark650,
	};
};
