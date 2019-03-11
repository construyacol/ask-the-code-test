import React, { Fragment } from 'react'
import { Mail, Auth, Success, GooglePlay } from '../../widgets/icons'
import InputForm from '../../widgets/inputs'
import SimpleLoader from '../../widgets/loaders'
import { InputButton } from '../../widgets/buttons/buttons'


const LoginRegisterView = props => {

  const{
    section,
    passMsg,
    forgot,
    mail_status,
    pswrd,
    pswrd2,
    pswrd_status,
    pswrd2_status,
    loader,
    updateState,
    loginValidate,
    registerValidate,
    focusActionPass,
    unFocusActionPass,
    forgotPassword,
    AuthLogin,
    AuthSignin,
    createAccount,
    signIn,
    childrenAnim,
    actionSuccess,
    volver,
    socialAuth
  } = props

  return(
    <Fragment>



        <form className={`AuthSwitchComponent ${childrenAnim} ${section}`}>
          {
            actionSuccess ?
            <Fragment>

              <div className={`${actionSuccess ? 'actionSuccessIcon' : 'contIconRec'}`}>
                  <Success size={80} color="green"/>
              </div>

              <p className="fuente successText">¡Operación Exitosa!</p>

            </Fragment>
            :
            <Fragment>
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

                  <div className="AuthInput">
                    <div className="IconPrefix">
                      <Auth size={22} color={`${(section === 'login' && loginValidate) || (section === 'register' &&  registerValidate ) ?  'green' : (pswrd_status === 'bad') ? 'red' : '#50667a' }`}/>
                    </div>
                    <InputForm
                      type="text"
                      placeholder="Contraseña"
                      name="pass"
                      actualizarEstado={updateState}
                      active={(section === 'login' && loginValidate) || (section === 'register' &&  registerValidate ) ? true : false }
                      focusAction={focusActionPass}
                      unFocusAction={unFocusActionPass}
                      type="password"
                      state_item={pswrd_status}
                    />
                    <p className={`Authstatus ${forgot ? 'visibles' : 'inVisible'}`} onClick={forgot ? forgotPassword : null}>{passMsg}</p>
                  </div>

                  <div className="SocialAuth" style={{display:section === 'login' ? 'grid' : 'none'}}>
                    <p className="fuente" >Inicia con: </p> <div className="socialAuthButton" onClick={socialAuth}><GooglePlay size={25} color="white"/></div>
                  </div>

                    <div className="AuthInput" style={{display:section === 'register' ? 'grid' : 'none'}}>
                      <div className="IconPrefix">
                        <Auth size={22} color={`${registerValidate ? 'green' : (pswrd2_status === 'bad') ? 'red' : '#50667a' }`}/>
                      </div>
                      <InputForm
                        type="text"
                        placeholder="Repite la contraseña"
                        name="pass2"
                        actualizarEstado={updateState}
                        active={(section === 'register' &&  registerValidate ) && true}
                        focusAction={focusActionPass}
                        unFocusAction={unFocusActionPass}
                        type="password"
                        state_item={pswrd2_status}
                      />
                    </div>
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
            label={`${section === 'login' ? 'Ingresar' : actionSuccess ? 'Entendido' : 'Registrar'}`}
            type="primary"
            active={(section === 'login' && loginValidate) || (section === 'register' &&  registerValidate) ? true : false }
            action={actionSuccess ? volver  : section === 'login' ? AuthLogin : AuthSignin}
          />
        </span>

        {
          !actionSuccess &&
          <p className="TextNav">
            {section === 'login' ? '¿Aún no tienes cuenta?' : '¿Ya Tienes una cuenta?'} &nbsp;&nbsp;
            <b className="Navigation" onClick={loader ? null : section === 'login' ? createAccount : signIn}>
              {section === 'login' ? 'CREA UNA  CUENTA' : 'INICIA SESIÓN'}
            </b>
          </p>
        }


      </div>



    </Fragment>
  )


}

export default LoginRegisterView
