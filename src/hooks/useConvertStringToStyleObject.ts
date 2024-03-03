import { useEffect, useState } from 'react';
import { useLiveStates } from '@/hooks/useLiveStates';
import parse from 'style-to-object';

export const useConvertStringToStyleObject = (styleStr: string): Record<string, any> => {
  const [convertedObject, setConvertedObject] = useState({});
  const liveState = useLiveStates({
    convertedObject,
  });

  useEffect(() => {
    try {
      const converted = parse(styleStr.replace(/(^\{|\}$)/g, ''));
      if (converted) {
        setConvertedObject(converted);
      }
    } catch {
      setConvertedObject(liveState.current.convertedObject);
    }
  }, [styleStr]);


  return convertedObject;
};