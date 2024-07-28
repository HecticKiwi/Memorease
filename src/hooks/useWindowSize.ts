import { useState, useLayoutEffect } from "react";

type WindowSize = {
  width: number | null;
  clientWidth: number | null;
  height: number | null;
};

function useWindowSize() {
  const [size, setSize] = useState<WindowSize>({
    width: null,
    clientWidth: null,
    height: null,
  });

  useLayoutEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        clientWidth: document.body.clientWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return size;
}

export default useWindowSize;
