const mergeRefs = <T>(...refs: (React.Ref<T> | undefined | null)[]): React.Ref<T> => {
  return (instance: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(instance);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = instance;
      }
    });
  };
};

export function useMergeRefs<T>(...refs: (React.Ref<T> | undefined | null)[]) {
  return mergeRefs(...refs);
}
