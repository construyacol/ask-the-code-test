import React, { Fragment } from 'react'
import { ButtonForms } from '../buttons/buttons'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../../actions'
import CropperIMG from './Cropper/CropperIMG'
import './styles.css'
import getCroppedImg from './Cropper/do-img-crop'


class CropImg extends React.Component {

  state = {
    imageSrc: this.props.imageSrc || null,
    crop: { x: 0, y: 0 },
    zoom: 1,
    aspect: 4 / 3,
    croppedAreaPixels: null,
    imgRotation: 0,
    croppedImage: null
  }


  onCropChange = crop => {
    this.setState({ crop })
  }

  onCropComplete = (croppedAreaPixels, imgRotation) => {
    // console.log(croppedArea, croppedAreaPixels)
    this.setState({ croppedAreaPixels, imgRotation })
  }

  onZoomChange = zoom => {

    let current_zoom = this.state.zoom

    if (zoom > current_zoom && zoom <= 3) {
      current_zoom += 0.06
    } else {
      current_zoom = zoom
    }

    // if(zoom<current_zoom){
    //   current_zoom -= 0.06
    // }

    this.setState({ zoom: current_zoom })
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


  showCroppedImage = async (img, cropArea, rotation) => {
    await this.props.action.isAppLoading(true)
    const croppedImage = await getCroppedImg(this.state.imageSrc, this.state.croppedAreaPixels, this.state.imgRotation)
    // return console.log('showCroppedImage', croppedImage)
    if (!croppedImage) { return this.props.action.isAppLoading(false) }

    const {
      urlImg
    } = croppedImage

    await this.setState({ croppedImage: urlImg })
    this.props.subirImg(croppedImage)
    // await this.props.action.isAppLoading(false)
  }

  cancelCroppedImg = () => {
    this.setState({
      croppedImage: null
    })
    this.props.cancelarSubidaImg()
  }

  componentWillReceiveProps(props) {
    this.setState({
      imageSrc: props.imageSrc
    })
  }



  render() {
    // console.log('DESDE CROP IMG COMPONENT_______', this.state, this.props)
    return (
      <div className="App">
        {
          this.state.imageSrc &&

          <Fragment>
            {/* <Cropper
                minZoom={minZoom}
                image={this.state.imageSrc}
                crop={this.state.crop}
                zoom={this.state.zoom}
                aspect={this.state.aspect}
                onCropChange={this.onCropChange}
                onCropComplete={this.onCropComplete}
                onZoomChange={this.onZoomChange}
              /> */}
            <CropperIMG onCropComplete={this.onCropComplete} image={this.state.imageSrc} />
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



function mapDispatchToProps(dispatch) {
  return {
    action: bindActionCreators(actions, dispatch)
  }
}



export default connect(null, mapDispatchToProps)(CropImg)
