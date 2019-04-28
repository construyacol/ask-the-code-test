import React, { Fragment, Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import { readFile } from '../../../services'
import CropImg from '../../widgets/cropimg'
import { toast, cssTransition } from 'react-toastify';
import SimpleLoader from '../../widgets/loaders'
import imgTikcketDefault from '../../../assets/ticketdefault.png'
// import imgTikcketDefault from '../../../assets/ticketdefault2.png'
import imgTouch from '../../../assets/touch.png'

import './ticket.css'

class TicketPaymentProof extends Component  {

  droppedImage = () =>{
  }


  state = {
    imageSrc:null,
    fileloader:false,
    localImg:imgTikcketDefault
  }


  goFileLoader = async e =>{


    if (e.target.files && e.target.files.length > 0) {
      this.props.action.Loader(true)
      const imageDataUrl = await readFile(e.target.files[0])
      // console.log('goFileLoader', imageDataUrl)
      this.props.action.Loader(false)

      this.setState({
        imageSrc: imageDataUrl,
        fileloader: !this.state.fileloader
      })

    }

  }


updateLocalImg = (img) =>{
  // console.log('updateLocalImg', img)
  this.setState({
   localImg:img
  })

}




  subirImg = async(img) =>{

    const{
      urlImg,
      base64
    } = img

    const {
      ticket,
      user,
      deposit_list
    } = this.props

    const {
      id
    } = ticket

    this.props.action.Loader(true)
    let res = await this.props.action.confirm_deposit_order(ticket, base64);
    // let res = await this.props.action.confirm_deposit_order(ticket, '');
    if(!res){return false}
    // let list = await this.props.action.get_deposit_list(user)
    console.log('°°°||||||||   RES UPLOAD IMG:', res)
    const {
      data
    } = res
    this.props.update_ticket(data)

      this.props.action.Loader(false)

      this.setState({
        fileloader: !this.state.fileloader
      })

      // this.updateLocalImg(urlImg)
      this.props.action.confirm_sound()
    setTimeout(()=>{
      this.props.action.mensaje(`¡Orden Confirmada !`, 'success')
    }, 700)

    let search_by = {
      name:"unique_id",
      unique_id:data.unique_id
    }
    let replace_prop = {
      name:"state",
      state:"confirmed"
    }
    await this.props.action.edit_array_element(search_by, replace_prop, deposit_list)
    await this.props.action.update_activity_account(this.props.current_wallet.id, 'deposits')


  }


  cancelarSubidaImg = () =>{
    this.setState({fileloader: false})
  }

render(){

  const {
    ticket,
    loader
  } = this.props

  const {
    state,
    step,
    comment
  } = ticket

  const{
    fileloader,
    localImg
  } = this.state

  // console.log('TicketPaymentProof', ticket)

  return(
    <div className={`TicketPaymentProof ${step === 2 ? 'aparecer' : ''} `} style={{transform:fileloader ? 'translateY(-50%)' : 'translateY(0%)' }}>

        <div className="ctaPaymentProof fuente" >
          <input id="TFileUpload" type="file" onChange={this.goFileLoader} />



          <p className="titlePayment"><img src={imgTouch} alt="" width="70"/>Toca para subir tu comprobante de pago</p>

            <p className="msgPayment">Sube una fotografía del comprobante de pago, si hiciste una transferencia por App, sube una captura de pantalla del registro del deposito.</p>
          {localImg && <div><img src={localImg} alt="" width="200"/></div>}
        </div>

      <div className="droppedImgPaymentProof">
          {  loader &&  <div className="TloaderSec">
            <SimpleLoader
              label="Subiendo..."
            />
          </div> }
          <CropImg
            {...this.state}
            subirImg={this.subirImg}
            cancelarSubidaImg={this.cancelarSubidaImg}
          />
      </div>
    </div>
  )
}

}

function mapDispatchToProps(dispatch){
  return{
    action:bindActionCreators(actions, dispatch)
  }
}

function mapStateToProps(state, props){
  const { user, user_id, deposits } = state.model_data

  let deposit_list = user[user_id].deposits.map(deposit_id => {
    return deposits[deposit_id]
  })

  return{
    current_wallet:state.ui.current_section.params.current_wallet,
    loader:state.isLoading.loader,
    user:user[user_id],
    deposit_list:deposit_list
  }
}



export default connect(mapStateToProps, mapDispatchToProps) (TicketPaymentProof)
