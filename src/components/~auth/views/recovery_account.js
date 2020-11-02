import React, { Fragment } from 'react'
import { Mail, Auth, SendMail, Success, Password } from '../../widgets/icons'
import InputForm from '../../widgets/inputs'
import SimpleLoader from '../../widgets/loaders'
import { InputButton } from '../../widgets/buttons/buttons'


const RecoveryAccount = props => {

  const{
    unFocusActionPass,
    resetPassValidate,
    pswrd_status,
    pswrd2_status,
    section,
    loader,
    updateState,
    mail_status,
    SendEmailRecovery,
    actionSuccess,
    childrenAnim,
    volver,
    resetPassword
  } = props


  console.log('||||||actionSuccess ', actionSuccess)

  return(
    <Fragment>

      <form className={`formRecoveryAccount AuthSwitchComponent ${childrenAnim} ${section}`}>

        {
          section === 'recovery_account' ?
          <Fragment>
            <div className={`${actionSuccess ? 'actionSuccessIcon' : 'contIconRec'}`}>
              {
                actionSuccess?
                <Success size={80} color="green"/>
                :
                <SendMail size={140} color="#016ab1"/>
              }
            </div>

            {
              actionSuccess ?
              <p className="fuente successText">¡Operación Exitosa!</p>
              :
              <div className="AuthInput">
                <div className="IconPrefix">
                  <Mail size={22} color={`${mail_status === 'bad' ? 'red' :
                                            mail_status === 'good' ? 'green' :
                                            mail_status === 'normal' && '#50667a'}`}/>
                </div>
                <InputForm
                  type="text"
                  placeholder="Correo electrónico"
                  name="mail"
                  actualizarEstado={updateState}
                  state_item={mail_status}
                />
              </div>
            }
          </Fragment>




          : section === 'reset_pass' &&




          <Fragment>

            <div className={`${actionSuccess ? 'actionSuccessIcon' : 'contIconRec'} ${section}`}>
              {
                actionSuccess?
                <Success size={80} color="green"/>
                :
                <Password size={80} color="#016cb4"/>
              }
            </div>

            {
              actionSuccess ?
              <p className="fuente successText">¡Operación Exitosa!</p>
              :
              <Fragment>
                <div className="AuthInput">
                  <div className="IconPrefix">
                    <Auth size={22} color={`${resetPassValidate  ?  'green' : (pswrd_status === 'bad') ? 'red' : '#50667a' }`}/>
                  </div>
                  <InputForm
                    type="text"
                    placeholder="Contraseña"
                    name="pass"
                    actualizarEstado={updateState}
                    active={resetPassValidate ? true : false }
                    unFocusAction={unFocusActionPass}
                    type="password"
                    state_item={pswrd_status}
                  />
                </div>

                  <div className="AuthInput">
                    <div className="IconPrefix">
                      <Auth size={22} color={`${resetPassValidate ? 'green' : (pswrd2_status === 'bad') ? 'red' : '#50667a' }`}/>
                    </div>
                    <InputForm
                      type="text"
                      placeholder="Repite la contraseña"
                      name="pass2"
                      actualizarEstado={updateState}
                      active={resetPassValidate && true}
                      unFocusAction={unFocusActionPass}
                      type="password"
                      state_item={pswrd2_status}
                    />
                  </div>
              </Fragment>
            }
            </Fragment>
        }

      </form>


      <div className="AuthControls fuente">
        <span className={`InputButtonCont ${loader ? 'loader' : '' }`}>
          {
            loader &&
            <div className="loadingAuth">
              <SimpleLoader />
            </div>
          }
          <InputButton
            label={`${section === 'recovery_account' && !actionSuccess ? 'Enviar' : actionSuccess ? 'Entendido' : 'Cambiar contraseña'}`}
            type="primary"
            active={(section === 'recovery_account' && mail_status === 'good') || resetPassValidate ? true : false }
            action={section === 'recovery_account' && !actionSuccess ? SendEmailRecovery : actionSuccess ? volver : resetPassword}
          />
        </span>

      </div>


    </Fragment>
  )


}

export default RecoveryAccount
