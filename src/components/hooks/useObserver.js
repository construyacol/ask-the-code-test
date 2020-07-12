import { useEffect, useRef, useState } from 'react'

export const useObserver = () => {

  const [element, setElement] = useState(null);
  const [show, setShow] = useState(null);

  const observer = useRef(
    new IntersectionObserver(
      entries => {
        const first = entries[0];
        if (first.isIntersecting) {
          setShow(true)
        }else{
          setShow(false)
        }
      }
    )
  );

  useEffect(() => {
     const currentElement = element;
     const currentObserver = observer.current;

     if (currentElement) {
       currentObserver.observe(currentElement);
     }

     return () => {
       if (currentElement) {
         currentObserver.unobserve(currentElement);
       }
     };
   }, [element]);

   return [ show, setElement ]

}
