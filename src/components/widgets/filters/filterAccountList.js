// import { useEffect } from 'react'
import { BsFillGridFill } from "react-icons/bs";
// import { FaList } from "react-icons/fa";
import styled from 'styled-components'
import { useActions } from '../../../hooks/useActions'
// import { MdViewList } from "react-icons/md";
import { TiThList } from "react-icons/ti";
// import { IoList } from "react-icons/io";



export default function FilterAccountList ({ currentFilterValue }) {

  const actions = useActions()
  // updateUiReducer
  const switchList = (accountListView) => {
    const key = "views"
    actions.updateUiReducer({ key, [key]:{ accountListView } })
  }

    return(
      <FilterAccount>
          <TiThList
          onClick={() => switchList("list")}
          className={`${["list"]?.includes(currentFilterValue) ? 'actived' : ''}`}
          size={20}
          color="gray"
          />

          <BsFillGridFill
          onClick={() => switchList("card")}
          className={`${["card"]?.includes(currentFilterValue) ? 'actived' : ''}`}
          size={18}
          color="gray"
          />
      </FilterAccount>
    )
}


export const FilterAccount = styled.div`

width:auto;
height:31px;
border:1px solid #DDDDDD;
border-radius:4px;
margin: 30px 0 22px;
display:grid;
grid-template-columns:repeat(2, 1fr);
place-content: center;
padding: 0 8px;
column-gap: 10px;
align-items: center;
justify-items:center;

svg{
  cursor:pointer;
  transition:.3s;
  opacity:0.2;
  &:hover{
    opacity:1;
  }
}

.actived{
    opacity:1;
}
`