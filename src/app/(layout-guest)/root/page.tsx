'use client';

import {
	Heading,
	Box,
	Text,
	ButtonGroup,
	Button,
	Flex,
	Icon,
} from '@chakra-ui/react';
import NavLink from 'next/link';
import { RiArrowRightLine, RiGithubFill, RiNpmjsFill } from 'react-icons/ri';
import RoutePaths from '@/constants/route-paths';
import { useThemeColors } from '@/hooks';

export default function View() {
	const { gray80_dark800, gray800_gray50, gray400_white } = useThemeColors();

	return (
		<Flex
			bgColor={gray80_dark800}
			flexDirection="column"
			justifyContent="center"
			minH="100vh"
		>
			<Box p={20} textAlign="center" mx="auto" w="full" maxW="100rem">
				<Heading color={gray800_gray50} fontSize="8xl" lineHeight="8rem">
					Create accessible and reusable Skeletons{' '}
					<Text as="span" color="brand.500">
						with speed
					</Text>
				</Heading>
				<Text fontSize="3xl" color={gray400_white} maxW="80%" mx="auto" mt={8}>
					Generate skeleton loading animations for your website to enhance user
					experience during page loading. Improve perceived performance and
					engage users with a visually appealing loading experience.
				</Text>
				<ButtonGroup mt={16} flexWrap="wrap" justifyContent="center" gap={4}>
					<NavLink href={RoutePaths.CREATE_NEW}>
						<Button variant="base" size="lg">
							Get Started <Icon fontSize="2rem" as={RiArrowRightLine} ml={2} />
						</Button>
					</NavLink>
					<Button
						variant="default"
						size="lg"
						bgColor="gray.100"
						color="gray.800"
					>
						<Icon as={RiGithubFill} mr={2} fontSize="2rem" /> GitHub
					</Button>
					<Button variant="default" size="lg" bgColor="red.600" color="white">
						<Icon as={RiNpmjsFill} mr={2} fontSize="2rem" /> npm
					</Button>
				</ButtonGroup>
			</Box>
		</Flex>
	);
}
