import React, {Fragment} from 'react'
import { ButtonForms } from '../../../widgets/buttons/buttons'
import Marco from '../../../widgets/marco'

const KycDashBoard = props =>{

  const {
    step,
    newback,
    newfront,
    newselfie,
    front,
    back,
    selfie,
    stepChange,
    goFileLoader,
    prevState,
    animation,
    action
  } = props

  // console.log('DESDE KYC AVANCED LAYOUT DASH:::: ', props)

  return(
    <div className="KycDashBoard">
      <div className="imgDashContainer">

        <p className={`fuente ${step>3 ? 'tuVieja' : '' }`}>
          {
            step === 1 ? '1.Frente del documento' : step === 2 ? '2.Revés del documento' : step === 3 ? '3.Selfie con documento y texto' : '¡Lo hiciste muy Bien!'
          }
        </p>

        {
          step < 4 ?
          <Marco type="green">

          <div className={`imgDashContainerD ${animation ?  'imgDCAnim' : ''}`}>
              {/* <div className={`imgDashSon ${animation ? 'imgDAnimSon' : ''}`}>
                <img className="imgDashItem" src={require(`${front}`)} style={{ display: prevState == 1 ? 'initial': 'none'}} alt="" width="100%" />
                <img className="imgDashItem" src={require(`${back}`)} style={{ display: prevState == 2 ? 'initial': 'none'}} alt="" width="100%" />
                <img className="imgDashItem" src={require(`${selfie}`)} style={{ display: prevState == 3 ? 'initial': 'none'}} alt="" width="100%" />
              </div> */}

              <div className={`imgDashSon ${animation ? 'imgDAnimSon' : ''}`}>
                <img className="imgDashItem" src={require(`${front}`)} style={{ opacity: prevState === 1 ? '1': '0'}} alt="" width="100%" />
                <img className="imgDashItem" src={require(`${back}`)} style={{ opacity: prevState === 2 ? '1': '0'}} alt="" width="100%" />
                <img className="imgDashItem" src={require(`${selfie}`)} style={{ opacity: prevState === 3 ? '1': '0'}} alt="" width="100%" />
              </div>

          </div>

          </Marco>

          :

          <p className="fuente parrafeins" id="putita" >Ya tenemos tu información, nuestro sistema se encuentra verificando tus datos, te avisaremos vía email y SMS cuando finalice, muy pronto podrás operar en coinsenda. </p>
        }


        <div className="imgDashCarousel">

           <div className={`imgDashStep ${step === 1 ? 'active' : ''}`}  title="1">
             {
               front === newfront ?
               <img className="imgDashItem" src={require(`${newfront}`)} alt="" width="80"  title="1"/>
               :
               <Fragment>
                 <img className="imgDashItem" src={newfront} alt="" width="80"  title="1"/>
                 <i className="fas fa-check-circle"></i>
               </Fragment>
             }
           </div>

           <div className={`imgDashStep ${step === 2 ? 'active' : ''}`}  title="2">

             {
               back === newback ?
               <img className="imgDashItem" src={require(`${newback}`)} alt="" width="80" title="2"/>
               :
               <Fragment>
                 <i className="fas fa-check-circle"></i>
                 <img className="imgDashItem" src={newback} alt="" width="80" title="2"/>
               </Fragment>

             }
           </div>

           <div className={`imgDashStep ${step === 3 ? 'active' : ''}`}  title="3">
             {
               selfie === newselfie ?

               <img className="imgDashItem" src={require(`${newselfie}`)} alt="" width="80" title="3"/>
               :
               <Fragment>
                 <i className="fas fa-check-circle"></i>
                 <img className="imgDashItem" src={newselfie} alt="" width="80" title="3"/>
               </Fragment>
             }

           </div>
        </div>

          <div className="controlContainers">
            {

              step < 4 ?

            <div className="contButtonUpload">
              <input type="file" onChange={goFileLoader} />
              <ButtonForms
                active={true}
                type="primary"
                > Subir Foto</ButtonForms>
            </div>
            :
            <ButtonForms
              active={true}
              type="primary"
              siguiente={action.ToggleModal}
              > Finalizar</ButtonForms>

          }

          </div>




      </div>
    </div>
  )
}

export default KycDashBoard
