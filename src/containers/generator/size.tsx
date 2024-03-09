import { ChangeEvent, FC } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Tooltip,
  Text
} from '@chakra-ui/react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { RxHeight, RxWidth } from 'react-icons/rx';
import { selectHighlightedNodeGridPropState, selectHighlightedNodeState } from '@/store/selectors/global';
import { gridState } from '@/store/atoms/global';
import { RiArrowDownSLine } from 'react-icons/ri';
import { GridKeyType } from '@/common/types';
import { useThemeColors } from '@/hooks';
import { SIZE_UNITS } from '@/common/enums';
import { valueWithPrefix } from '@/utils/helpers';

const UNITS_OPTIONS: Array<{
  label: SIZE_UNITS,
  value: SIZE_UNITS
}> = Object.values(SIZE_UNITS).map(unit => ({ label: unit, value: unit }));
export const Size: FC = () => {
  const width = valueWithPrefix(useRecoilValue(selectHighlightedNodeGridPropState('w')));
  const height = valueWithPrefix(useRecoilValue(selectHighlightedNodeGridPropState('h')));
  const highlightedNode = useRecoilValue(selectHighlightedNodeState);
  const [grid, setGridState] = useRecoilState(gridState);
  const { gray100_dark400 } = useThemeColors();

  const onSelectUnit = (v: SIZE_UNITS, size: 'w' | 'h') => {
    const _grid = structuredClone(grid);
    const obj: Record<GridKeyType, any> = _grid[highlightedNode] as Record<GridKeyType, any>;

    if (v === SIZE_UNITS.AUTO) {
      obj[size] = SIZE_UNITS.AUTO;
    } else {
      if (size === 'w') {
        obj[size] = `${width.value === SIZE_UNITS.AUTO ? 100 : width.value}${v}`;
      } else {
        obj[size] = `${height.value === SIZE_UNITS.AUTO ? 100 : height.value}${v}`;
      }
    }
    setGridState(_grid);
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>, size: 'w' | 'h') => {
    const _grid = structuredClone(grid);
    const obj: Record<GridKeyType, any> = _grid[highlightedNode] as Record<GridKeyType, any>;
    const newValue = e.target.value ?? '';

    if (size === 'w') {
      obj.w = `${newValue}${width.unit}`;
    } else {
      obj.h = `${newValue}${height.unit}`;
    }
    setGridState(_grid);
  }

  return (
    <Box p={4}>
      <Heading variant="medium-title" mb={4}>Size</Heading>
      <Flex gap={4}>
        <Box>

          <InputGroup>
            <Tooltip
              motionProps={{ borderRadius: 4 } as any}
              hasArrow
              label="Width"
              placement="top"
              variant="base"
            >
              <InputLeftAddon
                h="3rem"
                px={3}
                borderColor={gray100_dark400}
              >
                <Icon fontSize="2xl" as={RxWidth}/>
              </InputLeftAddon>
            </Tooltip>
            <Input
              borderColor={!width.value ? 'red.400' : gray100_dark400}
              variant="base"
              value={width.value}
              onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e, 'w')}
              size="sm"
              borderTopLeftRadius={0}
              borderBottomLeftRadius={0}
              readOnly={width.value === SIZE_UNITS.AUTO}
              type={width.value === SIZE_UNITS.AUTO ? 'text' : 'number'}
            />
            <InputRightAddon
              h="3rem"
              p={0}
              borderColor={gray100_dark400}
            >
              <Menu variant="base" placement="bottom-end">
                <MenuButton
                  as={Button}
                  w="full"
                  textAlign="left"
                  bgColor="transparent"
                  border="none"
                  px={2}
                  size="sm"
                  rightIcon={<Icon fontSize="1.6rem" as={RiArrowDownSLine}/>}
                  variant="menu-outline"
                  gap={0}
                >
                  {width.unit}
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
                    {UNITS_OPTIONS.map(unit => (
                      <MenuItem
                        as={Button}
                        size="sm"
                        variant="dropdown-item"
                        key={unit.value}
                        onClick={() => onSelectUnit(unit.value, 'w')}
                        bgColor="transparent"
                        gap={2}
                        {...width.unit === unit.value && {
                          bgColor: 'brand.500 !important',
                          color: 'white !important'
                        }}
                      >
                        {unit.label}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Portal>
              </Menu>
            </InputRightAddon>
          </InputGroup>
          {!width.value
            ? <Text color="red.400" mt={1}>Required*</Text>
            : null
          }
        </Box>
        <Box>
          <InputGroup>
            <Tooltip
              motionProps={{ borderRadius: 4 } as any}
              hasArrow
              label="Height"
              placement="top"
              variant="base"
            >
              <InputLeftAddon
                h="3rem"
                px={3}
                borderColor={gray100_dark400}
              >
                <Icon fontSize="2xl" as={RxHeight}/>
              </InputLeftAddon>
            </Tooltip>
            <Input
              borderColor={!height.value ? 'red.400' : gray100_dark400}
              variant="base"
              value={height.value}
              onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e, 'h')}
              size="sm"
              borderTopLeftRadius={0}
              borderBottomLeftRadius={0}
              readOnly={height.value === SIZE_UNITS.AUTO}
              type={height.value === SIZE_UNITS.AUTO ? 'text' : 'number'}
            />
            <InputRightAddon
              h="3rem"
              p={0}
              borderColor={gray100_dark400}
            >
              <Menu variant="base" placement="bottom-end">
                <MenuButton
                  as={Button}
                  w="full"
                  textAlign="left"
                  bgColor="transparent"
                  border="none"
                  px={2}
                  size="sm"
                  rightIcon={<Icon fontSize="1.6rem" as={RiArrowDownSLine}/>}
                  variant="menu-outline"
                  gap={0}
                >
                  {height.unit}
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
                    {UNITS_OPTIONS.map(unit => (
                      <MenuItem
                        as={Button}
                        size="sm"
                        variant="dropdown-item"
                        key={unit.value}
                        onClick={() => onSelectUnit(unit.value, 'h')}
                        bgColor="transparent"
                        gap={2}
                        {...height.unit === unit.value && {
                          bgColor: 'brand.500 !important',
                          color: 'white !important'
                        }}
                      >
                        {unit.label}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Portal>
              </Menu>
            </InputRightAddon>
          </InputGroup>
          {!height.value
            ? <Text color="red.400" mt={1}>Required*</Text>
            : null
          }
        </Box>
      </Flex>
    </Box>
  )
}