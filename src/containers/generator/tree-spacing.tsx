import { ChangeEvent, FC } from 'react';
import { Box, Heading, Input } from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import { treeElementsSpacingState } from '@/store/atoms/global';
import { TREE_ELEMENTS_SPACING } from '@/constants/general-settings';

export const TreeSpacing: FC = () => {
  const [treeSpacing, setTreeSpacing] = useRecoilState(treeElementsSpacingState);

  const onBlur = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      setTreeSpacing(TREE_ELEMENTS_SPACING.DEFAULT.toString());
    }
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      setTreeSpacing('');
      return;
    }

    const v = Number(e.target.value);
    if(v > TREE_ELEMENTS_SPACING.MAX || v < TREE_ELEMENTS_SPACING.MIN) {
      setTreeSpacing(treeSpacing);
      return;
    }

    setTreeSpacing(v.toString());
  }

  return (
    <Box p={4}>
      <Heading variant="medium-title" mb={4}>Tree element&apos;s spacing (PX)</Heading>
      <Input
        variant="base"
        value={treeSpacing}
        onChange={onChange}
        onBlur={onBlur}
        type="number"
        max={TREE_ELEMENTS_SPACING.MAX}
        min={TREE_ELEMENTS_SPACING.MIN}
      />
    </Box>
  )
}