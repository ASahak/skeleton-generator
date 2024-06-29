import { useEffect, useState } from 'react';
import { useLiveStates } from '@/hooks/useLiveStates';
import { cssToReactStyle, parseStyleObject } from '@/utils/helpers';

export const useConvertStringToStyleObject = (
	styleStr: string
): Record<string, any> => {
	const [convertedObject, setConvertedObject] = useState({});
	const liveState = useLiveStates({
		convertedObject,
	});

	useEffect(() => {
		try {
			const styles = parseStyleObject(styleStr);
			if (styles) {
				const converted = cssToReactStyle(styles);
				setConvertedObject(converted);
			}
		} catch {
			setConvertedObject(liveState.current.convertedObject);
		}
	}, [styleStr]);

	return convertedObject;
};
