import { FC, memo } from 'react';
import { Box, Button, Icon, Heading, Badge, Flex } from '@chakra-ui/react';
import { RiCloseFill } from 'react-icons/ri';
import { useRecoilState, useRecoilValue } from 'recoil';
import { AnimatePresence, motion } from 'framer-motion';
import { useThemeColors } from '@/hooks';
import { RootStyle } from '@/containers/generator/root-style';
import { GridGap } from '@/containers/generator/grid-gap';
import { Direction } from '@/containers/generator/direction';
import { ClassName } from '@/containers/generator/class-name';
import { Margin } from '@/containers/generator/margin';
import { Size } from '@/containers/generator/size';
import { Alignment } from '@/containers/generator/alignment';
import { WithOpacity } from '@/containers/generator/with-opacity';
import { RepeatCount } from '@/containers/generator/repeat-count';
import { Styles } from '@/containers/generator/styles';
import { optionsPanelIsOpenState } from '@/store/atoms/global';
import { selectHighlightedNodeState } from '@/store/selectors/global';

export const OptionsPanel: FC = memo(() => {
	const { white_dark700, gray100_dark400 } = useThemeColors();
	const [optionsPanelIsOpen, setOptionsPanelIsOpen] = useRecoilState(
		optionsPanelIsOpenState
	);
	const highlightedNode = useRecoilValue(selectHighlightedNodeState);

	const togglePanel = () => {
		setOptionsPanelIsOpen(!optionsPanelIsOpen);
	};

	return (
		<AnimatePresence mode="wait">
			{optionsPanelIsOpen ? (
				<motion.div
					key="options-panel"
					transition={{ duration: 0.3 }}
					initial={{ left: '100%', opacity: 0 }}
					animate={{ left: '0', opacity: 1 }}
					exit={{ left: '100%', opacity: 0 }}
					style={{ position: 'absolute', height: '100%', width: '100%' }}
				>
					<Flex
						flexDir="column"
						h="full"
						rounded="md"
						bgColor={white_dark700}
						boxShadow="md"
						whiteSpace="nowrap"
					>
						<Box p={4} borderBottom="1px solid" borderColor={gray100_dark400}>
							<Button
								variant="unstyled"
								alignItems="center"
								h="fit-content"
								display="flex"
								p={0}
								onClick={togglePanel}
							>
								<Icon as={RiCloseFill} fontSize="4xl" />
							</Button>
						</Box>
						<Box
							flex={1}
							minH={0}
							overflowX="hidden"
							className="custom-scrollbar-content"
							sx={{
								'&::-webkit-scrollbar-track': {
									backgroundColor: gray100_dark400,
								},
							}}
						>
							<Box borderBottomWidth={1} borderColor={gray100_dark400}>
								<RootStyle />
							</Box>
							<Heading fontSize="1.8rem" fontWeight={600} p={4}>
								Configs of -{' '}
								<Badge variant="pill-docs">{highlightedNode}</Badge>
							</Heading>
							<Box key={highlightedNode}>
								<Size />
								<Direction />
								<Alignment />
								<GridGap />
								<Margin />
								<ClassName />
								<RepeatCount />
								<WithOpacity />
								<Styles />
							</Box>
						</Box>
					</Flex>
				</motion.div>
			) : null}
		</AnimatePresence>
	);
});
