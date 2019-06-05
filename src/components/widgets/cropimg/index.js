import React, {Fragment} from 'react'
import getCroppedImg from './cropImage'
import { ButtonForms } from '../buttons/buttons'


import Cropper from 'react-easy-crop'
import './styles.css'

class CropImg extends React.Component {
  state = {
    imageSrc: null,
    crop: { x: 0, y: 0 },
    zoom: 1,
    aspect: 4 / 3,
    croppedAreaPixels: null,
    croppedImage: null,
  }






  onCropChange = crop => {
    this.setState({ crop })
  }

  onCropComplete = (croppedArea, croppedAreaPixels) => {
    // console.log(croppedArea, croppedAreaPixels)
    this.setState({ croppedAreaPixels})
  }

  onZoomChange = zoom => {
    this.setState({ zoom })
  }

  // onFileChange = async e => {
  //   if (e.target.files && e.target.files.length > 0) {
  //     const imageDataUrl = await readFile(e.target.files[0])
  //
  //     this.setState({
  //       imageSrc: imageDataUrl,
  //       crop: { x: 0, y: 0 },
  //       zoom: 1,
  //     })
  //   }
  // }


  showCroppedImage = async () => {
    const croppedImage = await getCroppedImg(this.state.imageSrc, this.state.croppedAreaPixels)

    // return console.log('showCroppedImage', croppedImage)

    if(!croppedImage){return false}

    const {
      urlImg
    } = croppedImage

    await this.setState({croppedImage: urlImg})

    this.props.subirImg(croppedImage)
  }

  cancelCroppedImg = () =>{
    this.setState({
      croppedImage:null
    })
    this.props.cancelarSubidaImg()
  }

  componentWillReceiveProps(props){
    this.setState({
      imageSrc: props.imageSrc
    })
  }

  render() {

    // console.log('DESDE CROP IMG COMPONENT_______', this.props.action.Loader)

    return (
      <div className="App">
        {
          this.state.imageSrc &&

          <Fragment>
            <div className="crop-container">
              <Cropper
                image={this.state.imageSrc}
                crop={this.state.crop}
                zoom={this.state.zoom}
                aspect={this.state.aspect}
                onCropChange={this.onCropChange}
                onCropComplete={this.onCropComplete}
                onZoomChange={this.onZoomChange}
              />
            </div>
            <div className="ImgCropcontrols">

                    <ButtonForms
                      active={true}
                      type="secundary"
                      siguiente={this.cancelCroppedImg}

                      >Cancelar</ButtonForms>
                    {/* <img src={this.state.croppedImage} alt="" width="40"/> */}

                    <ButtonForms
                      active={true}
                      type="primary"
                      siguiente={this.showCroppedImage}
                      >Guardar</ButtonForms>
            </div>
          </Fragment>
        }
      </div>
    )
  }
}



export default CropImg
