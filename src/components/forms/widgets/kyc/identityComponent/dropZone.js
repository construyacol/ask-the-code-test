import { 
    DropZoneContainer
} from '../../../../widgets/shared-styles'
import UploadComponent from './uploadComponent'
  

const DropZoneComponent = ({ dragLeave, goFileLoader }) => {
    return (
      <DropZoneContainer className="dottedBorder">
        <input
          id="TFileUpload" 
          type="file"
          // accept="image/png,image/jpeg"
          onChange={goFileLoader}
          onDragLeave={dragLeave}
          capture="user" 
          accept="image/*"
        />
        <UploadComponent
          unButtom
          title="Suelta aquí el archivo que quieres subir..."
        />
      </DropZoneContainer>
    );
  };

  export default DropZoneComponent