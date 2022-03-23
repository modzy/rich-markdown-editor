import ResizeObserver from "resize-observer-polyfill";
import { useState, useEffect } from "react";

export default function useComponentSize(ref: any): {
  width: number;
  height: number;
} {
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach(({ target }) => {
        if (
          size.width !== target.clientWidth ||
          size.height !== target.clientHeight
        ) {
          setSize({ width: target.clientWidth, height: target.clientHeight });
        }
      });
    });
    resizeObserver.observe(ref.current);

    return () => resizeObserver.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  return size;
}
