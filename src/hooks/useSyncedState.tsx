import { useRef, useState } from "react";

export default function useSyncedState<T>(defaultValue: T) {
  const [state, setState] = useState<T>(defaultValue);
  const ref = useRef<T>(defaultValue);

  const updateValue = (value: T) => {
    ref.current = value;
    setState(value);
  }

  return [state, updateValue, ref] as const;
}