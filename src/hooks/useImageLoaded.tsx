import FileUtils from '@/utils/FileUtils';
import { useEffect, useRef, useState } from 'react';

export const useImageLoaded = () => {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef();

  const setLoad = (_load = true) => {
    if (ref.current && FileUtils.isMediaFileURL(ref.current.src)) {
      setLoaded(_load);
    }
  };

  useEffect(() => {
    if (ref.current && ref.current.complete) {
      setLoad();
    }
  });

  return [ref, loaded, setLoad];
};
