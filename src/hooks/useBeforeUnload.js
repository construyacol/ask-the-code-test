import { useEffect } from 'react'
import { useHistory } from "react-router-dom";

var ctrlKeyDown = false

const useBeforeUnload = () => {
    const history = useHistory()
    useEffect(()=>{
        window.addEventListener("keydown", async(e) => {
            // console.log('||||||||||||||  useBeforeUnload ==>', e.keyCode === 116)
            if (e.keyCode === 116 || (e.keyCode === 82 && ctrlKeyDown)) {
                // Pressing F5 or Ctrl+R
                if(window.location.pathname.split("/").length>2){
                    if((e.keyCode === 82)  && document.activeElement.localName === 'input') return;
                    e.preventDefault();
                    const targetPath = window.location.pathname.split("/")[1] || "/wallets"
                    history.push(`/${targetPath}`)
                    ctrlKeyDown = false;
                }

            } else if ((e.which || e.keyCode) === 17) {
                // Pressing  only Ctrl
                ctrlKeyDown = true;
            }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
}

export default useBeforeUnload