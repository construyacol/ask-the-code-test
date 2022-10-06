import { useEffect } from 'react'
import styled from 'styled-components'
import { setMessageError } from '../../utils'

const InfoPanel = ({ title, stageData, state, dataForm:{ stages, handleError} }) => {

  useEffect(() => {
    if(document.body.clientWidth > 768){
      document.querySelector('#mainLayout')?.classList.add("infoPanel");
    }
  }, [])

  useEffect(()=>{
    if(handleError?.errors[stageData?.key]){
      setMessageError(`.label_text__${stageData.key}`, handleError.errors[stageData.key])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageData])

  return (
      <InfoPanelContainer id="infoPanel">
        <h3>{title || 'Título'}</h3>
        <ul>
          {
            Object.keys(state).map((key, id) => {
              if(key.includes('meta')){return null}
              return <li className={`${state[key] ? 'checked' : ''}`} key={id}>{stages[key].uiName}</li>
            })
          }
        </ul>
        {
          handleError.defaultErrorMessage &&
          <ErrorMessage>{handleError.defaultErrorMessage}</ErrorMessage>
        }
      </InfoPanelContainer>
  )
}

 
export default InfoPanel

const ErrorMessage = styled.p`
  font-size: 14px;
  color: gray;
  max-width: 250px;
`

const InfoPanelContainer = styled.section`
  display: grid;
  width: auto;
  min-width: 200px;
  padding: 50px;
  margin: 50px 0;
  height: calc(100% - 200px);
  border-right: 1px solid #bdbdbd;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;

  h3{
    color: green;
  }

  ul{
    padding-left: 20px;
    li{
      margin: 15px 0;
      color:red;
      padding-left: 5px;
      list-style-type: "☒";
      list-style-type: "-";
      &.checked{
        list-style-type: "✓";
        color: green;
      }
    }
  }

  @media (max-width: 768px) {
   display:none;
  }
`
