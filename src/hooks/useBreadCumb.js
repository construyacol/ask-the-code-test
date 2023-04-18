import { useEffect, useRef, useState } from "react";
import { history } from 'const/const'
import useViewport from 'hooks/useViewport'


// parentLabel = 'Main Title',
// childLabel = "Child Title",
// titleSelector = ".accountDetailTitle h1>span",
// ctaBackSelector = "#withdraw-menu-button",
// callback = () => null

const useBreadCumb = ({
    parentLabel = 'Main Title',
    childLabel,
    titleSelector,
    ctaBackSelector,
    unMountCondition,
    callback = () => null
  }) => {
  
    const { isMobile } = useViewport();
    const titleSectionEl = useRef(document.querySelector(titleSelector))
    const ctaBackToMain = useRef(document.querySelector(ctaBackSelector))
    const [ isActiveBreadCumb, setIsActiveBreadCumb ] = useState(false)
  
    const insertBreadCumb = () => {
      if(isMobile)return;
      setIsActiveBreadCumb(true)
      titleSectionEl.current.classList.add("_breadCrumbParent");   
      titleSectionEl.current.innerHTML = `${parentLabel}   >      `;
      titleSectionEl.current.onclick = unMountAction
      const newSpan = document.createElement("span");
      newSpan.classList.add("_breadCrumbChild");   
      const newContent = document.createTextNode(childLabel);
      newSpan.appendChild(newContent);
      let targetEl = ".accountDetailTitle h1"
      document.querySelector(targetEl).append(newSpan)
    }
  
    const unMountAction = () => {
      callback && callback()
      if(!titleSectionEl.current)return;
      setIsActiveBreadCumb(false)
      titleSectionEl.current.innerHTML = parentLabel;
      titleSectionEl.current.classList?.remove("_breadCrumbParent");   
      document.querySelector("._breadCrumbChild")?.remove()
      titleSectionEl.current.onclick = () => null;
      ctaBackToMain?.current?.removeEventListener("click", unMountAction);
      history.push(`${history.location.pathname}`)
    } 

    useEffect(() => {
        unMountCondition && unMountAction()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [unMountCondition])
  
    useEffect(() => {
      ctaBackToMain?.current?.addEventListener("click", unMountAction);
      return () => unMountAction()
    // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [])  
    
    return { insertBreadCumb, isActiveBreadCumb }
  }

  export default useBreadCumb