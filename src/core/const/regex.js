

// export const IS_TEXT = /[a-zA-Z ]{3,40}/g;
export const ONLY_TEXT = /^[A-Za-z\s]{1,40}$/;
export const IS_NOT_TEXT = /[^A-Za-z\s]/; 
// export const ONLY_NUMBERS = (min = 1, max = 40) => new RegExp(`^[0-9]{${min},${max}}$`);
export const ONLY_NUMBERS = /^[0-9]/g
export const IS_NOT_NUMBER = /[^0-9]/g
export const NUMBERS_AND_TEXT = /^[a-zA-Z0-9]+$/