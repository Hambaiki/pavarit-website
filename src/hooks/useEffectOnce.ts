import { useEffect, useRef } from "react";

const useEffectOnce = (
  effect: React.EffectCallback,
  deps: React.DependencyList
) => {
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      effect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useEffectOnce;
