
import { get } from 'lodash'

export const orderedList = (list, criterialList, orderByProp) => {
    if(!Array.isArray(list) || !criterialList || !orderByProp) return list;
    list.sort((a, b) => {
      const indiceA = criterialList.indexOf(get(a, orderByProp));
      const indiceB = criterialList.indexOf(get(b, orderByProp));
      if (indiceA === -1) return 1;
      if (indiceB === -1) return -1;
      return indiceA - indiceB;
    });
    return list
  } 