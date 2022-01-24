import React, { Component, Fragment } from "react";
import { ButtonForms } from "../buttons/buttons";
// import { connect } from 'react-redux'
// import { bindActionCreators } from 'redux'
// import actions from '../../../actions'
import IconSwitch from "../icons/iconSwitch";
import SimpleLoader from "../loaders"; 

class SubItemSC extends Component {
  // state = {
  //   label:this.props.subItem.label,
  //   name:this.props.subItem.name,
  //   description:this.props.subItem.description,
  //   cta_primary:this.props.subItem.cta_primary,
  //   cta_secondary:this.props.subItem.cta_secondary,
  //   verify:this.props.subItem.verify,
  //   tree:this.props.subItem.tree,
  //   available:this.props.subItem.available,
  //   treeButton:this.props.subItem.treeButton,
  //   classic_view:this.props.subItem.classic_view
  // }

  state = {
    ...this.props.subItem,
  };

  componentDidMount() {
    if(this?.props?.user?.levels?.personal === 'accepted'){
      console.log(document.querySelector('.kyc_basic .SCtitle')?.classList?.add('tittle__success'))
    }
    if(this?.props?.user?.levels?.identity === 'accepted'){
      console.log(document.querySelector('.kyc_advanced .SCtitle')?.classList?.add('tittle__success'))
    }
  }

  // componentWillReceiveProps(props){
  //   // console.log(props)
  // }

  actionHandle = () => {
    const { item_action, subItem } = this.props;
    // console.log('|||||| ------- actionHandle', subItem)

    item_action(subItem);
  };

  render() {
    const { index, totalIndex, nextVerify, lastVerify } = this.props;

    const {
      label,
      name,
      color,
      icon,
      description,
      cta_primary,
      cta_secondary,
      verify,
      tree,
      available,
      treeButton,
      classic_view,
      other_state,
    } = this.state;

    let originIndex = index - 1;
    let movil_viewport = window.innerWidth < 768;

    const atributos = {
      icon: icon ? icon : name,
      size: 40,
      color: `${color ? color : !verify ? "#989898" : "#1babec"}`,
    };

    // if(this.state.type==='identity'){console.log(type, name, this.state)}
    // if(this.state.type==='identity'){console.log(type, name, this.state)}

    // console.log('SUB_ITEM PROPS', atributos, other_state)

    // HACEMOS CONEXIÓN A REDUX PARA COMPARAR Y VERIFICAR SI EFECTIVAMENTE ESTE ELEMENTO SE ENCUENTRA VALIDADO, EN FUNCIÓN A ELLO MOSTRAMOS EL cta primary o secondary

    // SCconector // last - active
    // SCimgItemCont // active - first
    // contentSubItem // last

    // tree // define si es la raiz de una matriz de opciones, es decir representa el titular de una fuente de datos, ej: verificación de identidad
    console.log('||||||||||||||||||||||||||||||||||   SubItemSC', this.props.subItem.name, this.props)

    return (
      <div
        className="subItemSecurityCenter"
        style={{ gridTemplateColumns: classic_view ? "1fr" : "12vw 1fr" }}
        onClick={
          !available || !movil_viewport
            ? null
            : other_state === "to_disable"
            ? this.actionHandle
            : verify || other_state === "confirmed" || other_state === "send"
            ? null
            : this.actionHandle
        }
      >
        {movil_viewport && !tree && (
          <div className="contCtaMovilSec">
            {other_state === "send" ? (
              <i
                className="enviarNero fas fa-angle-double-down"
                style={{ color: "gray" }}
              ></i>
            ) : other_state === "confirmed" ? (
              <i
                className="fas fa-spinner rotateGono"
                style={{ color: "#bbbbbb" }}
              ></i>
            ) : verify ? (
              <i className="fas fa-check" style={{ color: "#59B200" }}></i>
            ) : (
              available && (
                <i
                  className="fas fa-chevron-right anim-flow"
                  style={{ color: "gray", fontSize: "20px" }}
                ></i>
              )
            )}
          </div>
        )}

        <div
          className="SCimgItem"
          style={{ display: classic_view ? "none" : "grid" }}
        >
          <div
            className={`SCimgItemCont ${verify ? "active" : ""} ${
              index === 1 ? "first" : ""
            }`}
          >
            <IconSwitch {...atributos} />
          </div>
          <div
            className={`SCconector ${totalIndex === index ? "last" : ""} ${
              nextVerify || lastVerify > originIndex ? "active" : ""
            }`}
          ></div>
        </div>

        <div
          className={`contentSubItem  ${this.props.subItem.name} ${totalIndex === index ? "last" : ""}  ${
            other_state === "confirmed" ? "confir" : ""
          }`}
        >
          <div
            className={`contentSubText ${available ? "available" : ""} fuente`}
            style={{
              gridTemplateRows: tree ? "70px 1fr" : "60px 40px 1fr",
              opacity:
                (verify && available) ||
                other_state === "confirmed" ||
                other_state === "send"
                  ? "1"
                  : other_state === "rejected"
                  ? "0.8"
                  : "0.35",
            }}
          >
            <div
              className="SCtitle"
              style={{
                color:
                  classic_view && verify
                    ? "#0198ff"
                    : classic_view
                    ? "gray"
                    : verify && tree
                    ? "#0198ff"
                    : other_state === "send"
                    ? "red"
                    : "gray",
              }}
            >
              <div className={`ScimgClassicView ${classic_view ? "classic_view" : ""}`} style={{ display: classic_view ? "flex" : "none" }}>
                <IconSwitch {...atributos} />
              </div>
              {label}
            </div>

            {
              description &&
              <p
                className="fuente SCdesc"
                style={{
                  alignSelf: tree ? "flex-start" : "center",
                  color:
                    other_state === "send"
                      ? "#545454"
                      : other_state === "rejected"
                      ? "#a90000"
                      : "gray",
                }}
              >
                {other_state === "send" && (<i className="enviarNero fas fa-angle-double-down"></i>)}
                {description}
              </p>
            }


            <div
              className="SCverification"
              style={{
                color: verify
                  ? "#59B200"
                  : other_state === "confirmed"
                  ? "gray"
                  : other_state === "send"
                  ? "#59B200"
                  : "#540000",
                display: tree ? "none" : "visible",
              }}
            >
              {verify ? (
                <Fragment>
                  <i className="fas fa-check"></i>
                  {`Completado con éxito`}
                </Fragment>
              ) : other_state === "confirmed" ? (
                <div className="confirmedIndentSc">
                  <div className="loaderScontainer">
                    <SimpleLoader loader={2} />
                  </div>
                  {`verificando...`}
                </div>
              ) : other_state === "send" ? (
                <Fragment>
                  <i className="SCUnverify fas fa-share"></i>
                  {`Información enviada`}
                </Fragment>
              ) : (
                <Fragment>
                  <i className="SCUnverify fas fa-times"></i>
                  {`${label} sin ${cta_primary}`}
                </Fragment>
              )}
            </div>

            
          </div>

          {/* Call to action de security_center *************************************************************************************************************************************** */}
          <div
            className={`SCcta ${other_state}`}
            style={{
              display: (classic_view || (tree && !treeButton)) || this.props.subItem.name === 'withdraw'  ? "none" : "grid",
            }}
          >
            <ButtonForms
              id="subItemSC"
              type={`${verify ? "secundary" : "primary"}`}
              active={available}
              siguiente={
                other_state === "to_disable"
                  ? this.actionHandle
                  : verify ||
                    other_state === "confirmed" ||
                    other_state === "send"
                  ? null
                  : this.actionHandle
              }
              // siguiente={(verify)? null : this.actionHandle}
            >
              {`${
                other_state === "confirmed"
                  ? "Verificando"
                  : other_state === "send"
                  ? "Enviado"
                  : verify
                  ? cta_secondary
                  : cta_primary
              }`}
            </ButtonForms>
          </div>

          {/* Call to action de settings *************************************************************************************************************************************** */}
          <div
            className="SCcta"
            style={{ display: classic_view ? "grid" : "none" }}
          >
            <ButtonForms
              id="ClassicView"
              type={`${verify ? "secundary" : "primary"}`}
              active={available}
              siguiente={this.actionHandle}
            >
              <div
                className="ClassicTextCont fuentePrin"
                style={{ display: available ? "grid" : "none" }}
              >
                <p className="ClassicViewText">{cta_primary}</p>
                <p className="ClassicViewText">
                  {cta_secondary}
                  <i className="fas fa-angle-right"></i>
                </p>
              </div>

              {!available && `${verify ? cta_secondary : cta_primary}`}
            </ButtonForms>
          </div>
        </div>
      </div>
    );
  }
}

export default SubItemSC;
