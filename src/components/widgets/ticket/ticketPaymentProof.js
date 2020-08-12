import React, { Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import { readFile, img_compressor } from '../../../utils'
import CropImg from '../../widgets/cropimg'
import SimpleLoader from '../../widgets/loaders'
import imgTikcketDefault from '../../../assets/ticketdefault.png'
// import imgTikcketDefault from '../../../assets/ticketdefault2.png'
import imgTouch from '../../../assets/touch.png'

import './ticket.css'
import withCoinsendaServices from '../../withCoinsendaServices'

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
      this.props.action.isAppLoading(true)

      const file = await img_compressor(e.target.files[0], 0.5)
      const imageDataUrl = await readFile(file)
      console.log('goFileLoader', imageDataUrl)
      this.props.action.isAppLoading(false)

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
      base64
    } = img

    const {
      ticket
    } = this.props
    this.props.action.isAppLoading(true)

    let res = await this.props.coinsendaServices.confirmDepositOrder(ticket, base64);
    // console.log('Confirm deposit order', res)
    if(!res || res === 465){return false}
    const {
      data
    } = res

    this.props.update_ticket(data)

      this.props.action.isAppLoading(false)

      this.setState({
        fileloader: !this.state.fileloader
      })

      // this.updateLocalImg(urlImg)
      this.props.action.confirm_sound()
    setTimeout(()=>{
      this.props.toastMessage(`¡Orden Confirmada !`, 'success')
    }, 700)
  }


  cancelarSubidaImg = () =>{
    this.setState({fileloader: false})
  }

render(){

  const {
    // ticket,
    loader,
    clases
  } = this.props

  const{
    fileloader,
    localImg
  } = this.state

  // console.log('TicketPaymentProof', ticket)

  return(
    <div className={`TicketPaymentProof ${clases} `} style={{transform:fileloader ? 'translateY(-50%)' : 'translateY(0%)' }}>

        <div className="ctaPaymentProof fuente" >
          <input id="TFileUpload" type="file" accept="image/png,image/jpeg" onChange={this.goFileLoader} />

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
  const { user } = state.modelData


  return{
    loader:state.isLoading.loader,
    user:user
  }
}



export default connect(mapStateToProps, mapDispatchToProps) (withCoinsendaServices(TicketPaymentProof))
