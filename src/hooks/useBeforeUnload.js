import { useEffect } from 'react'
import { useHistory } from "react-router-dom";

var ctrlKeyDown = false

const useBeforeUnload = () => {
    const history = useHistory()
    useEffect(()=>{
        window.addEventListener("keydown", async(e) => {
            if(document.activeElement.localName === 'input') return;
            if (e.keyCode === 116 || (e.keyCode === 82 && ctrlKeyDown)) {
                // Pressing F5 or Ctrl+R
                if(window.location.pathname.split("/").length>2){
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