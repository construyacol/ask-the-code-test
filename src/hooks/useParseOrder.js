import { useState } from 'react'


export default function useParseOrder(_data, dataType) {

    const [data, setData] = useState([]);

    

    return { data }

}