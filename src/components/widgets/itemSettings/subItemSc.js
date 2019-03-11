import React, { Component, Fragment } from 'react'
import { ButtonForms } from '../buttons/buttons'
// import { connect } from 'react-redux'
// import { bindActionCreators } from 'redux'
// import actions from '../../../actions'
import { Email } from '../icons'
import IconSwitch from '../icons/iconSwitch'



class SubItemSC extends Component {

  state = {
    label:this.props.subItem.label,
    name:this.props.subItem.name,
    description:this.props.subItem.description,
    cta_primary:this.props.subItem.cta_primary,
    cta_secondary:this.props.subItem.cta_secondary,
    verify:this.props.subItem.verify,
    tree:this.props.subItem.tree,
    available:this.props.subItem.available,
    treeButton:this.props.subItem.treeButton,
    classic_view:this.props.subItem.classic_view
  }

  componentDidMount(){
    // aqui leeremos exclusivamente un estado para kyc advance, y saber si se encuentra rechazado, pendiente o no verificado
  }

  // componentWillReceiveProps(props){
  //   // console.log(props)
  // }

  actionHandle = () =>{
    const {
      item_action,
      subItem
    } = this.props

    item_action(subItem)
  }



  render(){


    const{
      subItem,
      index,
      totalIndex,
      nextVerify,
      lastVerify
    } = this.props

    const{
      label,
      name,
      description,
      cta_primary,
      cta_secondary,
      verify,
      tree,
      available,
      treeButton,
      classic_view
    } = this.state

    let originIndex = index-1

    const atributos ={
      icon:name,
      size:40,
      color:`${classic_view ? '#989898'  : !verify ? '#989898'  : '#1babec'}`
    }

    // console.log('SUB_ITEM PROPS', this.props)

// HACEMOS CONEXIÓN A REDUX PARA COMPARAR Y VERIFICAR SI EFECTIVAMENTE ESTE ELEMENTO SE ENCUENTRA VALIDADO, EN FUNCIÓN A ELLO MOSTRAMOS EL cta primary o secondary

// SCconector // last - active
// SCimgItemCont // active - first
// contentSubItem // last

// tree // define si es la raiz de una matriz de opciones, es decir representa el titular de una fuente de datos, ej: verificación de identidad

    return(
      <div className="subItemSecurityCenter" style={{gridTemplateColumns:classic_view ? '1fr' : '12vw 1fr' }}>
      {/* <div className="subItemSecurityCenter" > */}



        <div className="SCimgItem" style={{display:classic_view ? 'none' : 'grid' }} >
          <div className={`SCimgItemCont ${verify ? 'active' : '' } ${index === 1 ? 'first' : '' }`}>
            <IconSwitch {...atributos}/>
          </div>
          <div className={`SCconector ${totalIndex === index ? 'last' : '' } ${(nextVerify || (lastVerify > originIndex)) ? 'active' : '' }`}></div>
        </div>

        <div className={`contentSubItem ${totalIndex === index ? 'last' : '' }`}>
          <div className="contentSubText fuente" style={{gridTemplateRows:tree ? '70px 1fr': '60px 20px 1fr'}, {opacity:verify && available ? '1': '0.5'}}>
          <div className="SCtitle" style={{color:classic_view ? 'gray' : (verify && tree) ? '#1fa4e9' :  'gray' }} >

            <div className={`ScimgClassicView ${classic_view ? 'classic_view' : '' }`} style={{display:classic_view ? 'flex' : 'none' }}>
              <IconSwitch {...atributos} />
            </div>

            {label}
          </div>

          <p className="SCverification" style={{color:verify ? '#59B200' : '#540000' , display:tree ? 'none' : 'visible' }}>
            {
              verify ?
              <Fragment>
                <i className="fas fa-check"></i>
                {`Verificado y/o Habilitado con exito` }
              </Fragment>
              :
              <Fragment>
                <i className="SCUnverify fas fa-times"></i>
                {`${label} sin ${cta_primary}`}
              </Fragment>
            }
          </p>

          <p className="fuente SCdesc" style={{alignSelf:tree ? 'flex-start' : 'center'}} >{description}</p>
        </div>


        <div className="SCcta" style={{display:(classic_view || tree && !treeButton) ? 'none' : 'grid' }}>
          <ButtonForms
            id="subItemSC"
            type={`${verify ? 'secundary' : 'primary' }`}
            active={available}
            siguiente={verify ? null : this.actionHandle}
          >
          {`${verify ?  cta_secondary : cta_primary }`}
          </ButtonForms>
        </div>


        <div className="SCcta" style={{display:(classic_view) ? 'grid' : 'none' }}>
          <ButtonForms
            id="ClassicView"
            type={`${verify ? 'secundary' : 'primary' }`}
            active={available}
            siguiente={this.actionHandle}
          >
            <div className="ClassicTextCont fuentePrin" style={{display:(available) ? 'grid' : 'none' }}>
              <p className="ClassicViewText" >{cta_primary}</p>
              <p className="ClassicViewText" >
                {cta_secondary}
              <i className="fas fa-angle-right"></i>
              </p>
            </div>

            {
              !available &&
              `${verify ?  cta_secondary : cta_primary }`
            }

          </ButtonForms>
        </div>

        </div>
      </div>
    )
  }
}



export default SubItemSC
