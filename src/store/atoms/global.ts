import { atom, RecoilState } from 'recoil';

export const gridState: RecoilState<Record<string, unknown>> = atom({
  key: 'grid',
  default: {},
});

export const rootStylesState: RecoilState<string> = atom({
  key: 'root-styles',
  default:
`{ 
  width: 100%;
  height: 100%;
}`,
});

export const optionsPanelIsOpenState: RecoilState<boolean> = atom({
  key: 'options-panel-is-open',
  default: false
});