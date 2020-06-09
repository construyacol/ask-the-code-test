import { useEffect } from 'react'
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { useActions } from '../../hooks/useActions'


const UseTxState = () => {

    const actions = useActions()
    const state = useSelector(state => state)
    const params = useParams()
    const { primary_path, tx_path, account_id, path  } = params


    return {
        ...params,
        actions:{...actions}
      }
}

export default UseTxState
