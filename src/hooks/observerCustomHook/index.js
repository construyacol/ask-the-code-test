import { useEffect, useRef, useState } from "react";

export const ObserverHook = () => {
  const element = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    import("intersection-observer").then(() => {
      const observer = new window.IntersectionObserver((entries) => {
        const { isIntersecting } = entries[0];
        if (isIntersecting) {
          setShow(true);
          observer.disconnect();
        }
      });
      if (observer && element && element.current) {
        // console.log('|||||||||||||| INTERSECTION OBSERVER ==> ', element)
        observer.observe(element.current);
      }
    });
  }, [element]);

  return [show, element];
};
