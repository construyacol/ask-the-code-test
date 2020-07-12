import React, { useEffect, useState} from 'react'
import styled from 'styled-components'
import { useObserver } from '../../hooks/useObserver'
import { useCoinsendaServices } from '../../../services/useCoinsendaServices'
import { useParams } from "react-router-dom";
import { LoaderItem } from './order_item'

export default ({ loader, setLoader }) => {

  const [ show, setElement ] = useObserver()
  const [ coinsendaServices, { storage:{ activity_for_account } }] = useCoinsendaServices()
  const { tx_path, account_id } = useParams()
  const [ availableActivity, setAvailableActivity ] = useState(true)
  // const params = useParams()

  const getActivity = async() => {
    setLoader(true)
    const method = `get_${tx_path}`
    const skip = activity_for_account && activity_for_account[account_id] && activity_for_account[account_id][tx_path] && activity_for_account[account_id][tx_path].length
    let activity = []
    if(skip > 10){
      activity = await coinsendaServices[method](account_id, 15, skip)
    }
    setLoader(false)
    if(!activity.length){
      setAvailableActivity(false)
    }
  }


  useEffect(()=>{
    if(show && availableActivity){
      getActivity()
    }
  }, [show])


  return(

    <>
      {
        !loader ?
        <InfiniteScrollItem ref={setElement}/>
        :
        <Container>
          <LoaderItem/>
        </Container>
      }

    </>
  )

}

const Container = styled.div`
  width: 100%;
  margin-top: 20px;
  height: 80px;
  display: grid;
  align-items: center;
  justify-items:center;

`

const InfiniteScrollItem = styled.div`
  width: 100%;
  height: 35px;
`
