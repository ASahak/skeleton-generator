import { useEffect, useState } from 'react';
import parse from 'style-to-object';
import { useLiveStates } from '@/hooks/useLiveStates';
import { STYLE_PARSING_REGEXP } from '@/constants/general-settings';

export const useConvertStringToStyleObject = (
	styleStr: string
): Record<string, any> => {
	const [convertedObject, setConvertedObject] = useState({});
	const liveState = useLiveStates({
		convertedObject,
	});

	useEffect(() => {
		try {
			const converted = parse(styleStr.replace(STYLE_PARSING_REGEXP, ''));
			if (converted) {
				setConvertedObject(converted);
			}
		} catch {
			setConvertedObject(liveState.current.convertedObject);
		}
	}, [styleStr]);

	return convertedObject;
};
