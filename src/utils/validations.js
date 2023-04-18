

export const emailValidation = (value) => {
   const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
   return pattern.test(value) ? 'success' : false
}