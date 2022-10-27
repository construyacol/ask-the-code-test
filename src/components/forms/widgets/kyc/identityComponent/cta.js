import { 
    Buttom,
  } from '../../../../widgets/shared-styles'
import { CAPACITOR_PLATFORM } from 'const/const'
import SimpleLoader, { LoaderContainer } from "../../../../widgets/loaders";
  

const CallToAction = props => {

    const INPUT_FILE_PROPS = {
      type:"file",
      accept:"image/png,image/jpeg",
      onChange:props?.goFileLoader
    }
  
    const INPUT_BUTTON_PROPS = {
      type:"button",
      onClick:props?.getCameraPhoto
    }
  
    const inputProps = CAPACITOR_PLATFORM !== 'web' ? INPUT_BUTTON_PROPS : INPUT_FILE_PROPS
  
    return(
        <Buttom className={`${props.loading ? 'loader' : ''}`}>
          {
            props.loading ?
            <LoaderContainer>
              <SimpleLoader loader={2} />
            </LoaderContainer>
            :
            <input
              {...inputProps}
            />
          }
          
          <p style={{ color: "white", margin:"0" }} className="fuente">
            Subir documento
          </p>
        </Buttom>
    )
  }

  export default CallToAction