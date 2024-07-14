import { useEffect, useState } from 'react';
import { cssToReactStyle, parseStyleObject } from 'react-skeleton-builder';
import { useLiveStates } from '@/hooks/useLiveStates';

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
