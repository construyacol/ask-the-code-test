import { 
    UploadContainer,
    UploadText,
    UploadTextMiddle,
    UploadMiddle
} from '../../../../widgets/shared-styles'
import CallToAction from './cta'
import { AiOutlineUpload } from "react-icons/ai";
  


const UploadComponent = props => {
    return(
      <UploadContainer className={`${props.unButtom ? 'unButton' : ''}`}>
          <AiOutlineUpload size={45} color="var(--paragraph_color)" />
          <UploadText className="fuente">
              {props.title || "Arrastra el documento que quieres subir"}
          </UploadText>
          {
            !props.unButtom &&
            <>
              <UploadMiddle>
                  <UploadTextMiddle className="fuente" background={"#F9F9F9"}>
                    o selecciona un archivo
                  </UploadTextMiddle>
                  <hr />
              </UploadMiddle>
              
              <CallToAction
                {...props}
              />
            </>
          }
      </UploadContainer>
    )
  }

  export default UploadComponent