import { useRef } from 'react';

export const useLiveStates = (value: any): Record<string, any> => {
	const state = useRef(null);
	state.current = value;

	return state;
};
