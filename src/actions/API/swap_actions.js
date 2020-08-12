import Environment from '../../environment'

import {
  ApiGetRequest,
} from './'

import {
  update_item_state
} from '../dataModelActions'

const { SwapApiUrl } = Environment

export const updateCurrentPair = (query, currentPair) => {

  return async(dispatch) => {

    // let proof = {
    //   buy_price: amount || '10000',
    //   sell_price: amount || '10000'
    // }

    const url_current_pair = `${SwapApiUrl}pairs?filter=${query}`
    // return console.log('||||||||||||||||||||||||||||||||||||||||||||||||||||||||||    url_current_pair ::', url_current_pair)
    let current_pair = await ApiGetRequest(url_current_pair)
    if(!current_pair || current_pair === 465){return}

    if(currentPair){
      await dispatch(update_item_state({currentPair:{...current_pair[0]}}, 'pairs'))
    }else{
      dispatch(update_item_state({[current_pair[0].id]:{...current_pair[0]}}, 'all_pairs'))
    }



    // console.log('=========================================================> currentPair id', current_pair[0].id)

    // await dispatch(update_item_state({currentPair:{...current_pair[0], ...proof}}, 'pairs'))
    // await dispatch(update_item_state({[current_pair[0].id]:{...current_pair[0], ...proof}}, 'all_pairs'))

  }

}




























//
