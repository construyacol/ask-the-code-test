export const show = async(targetEl, time = 1000) =>{
    return new Promise((resolve) => {
        document.querySelector(targetEl)?.classList.add('show_')
        setTimeout(() => {resolve(true)}, time);
    });
}

export const hide = async(targetEl, time = 1000) =>{
    return new Promise((resolve) => {
        document.querySelector(targetEl)?.classList.remove('show_')
        document.querySelector(targetEl)?.classList.add('hide_')
        setTimeout(() => {resolve(true)}, time);
    });
}