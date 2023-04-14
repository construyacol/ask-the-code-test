type resultParams = {
  [key: string]: any;
}

export const getAllUrlParams = (url = window.location.search):resultParams => {
  const queryString = url.split('?')[1];
  const params = new URLSearchParams(queryString);
  const result:resultParams = {};
  for (const [key, value] of params.entries()) {
    result[key] = typeof JSON.parse(value) === 'object' ? JSON.parse(value) : value;
  }
  return result;
}
