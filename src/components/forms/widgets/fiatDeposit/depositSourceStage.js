import { useEffect } from 'react'
// import { useSelector } from "react-redux";
// import { createSelector } from "reselect";
import { SelectListContainer, ItemListComponent } from '../selectListComponent'
import { StageContainer, OptionInputContainer } from '../sharedStyles'
import useViewport from '../../../../hooks/useWindowSize'
import { AiFillBank } from "react-icons/ai";
import { BsCash } from "react-icons/bs";
import styled from 'styled-components'

export default function DepositSourceComponent({ 
    stageManager:{ 
      stageData,
      setStageStatus
    },
    handleState:{ state, setState },
    handleDataForm:{ dataForm },
    children,
    ...props
  }){  

    const { isMovilViewport } = useViewport();
    // const [ withdrawAccounts ] = useSelector((state) => selectWithdrawAccounts(state));
    // const actions = useActions()

    const selectWithdrawAccount = (withdrawAccount) => {
      setState(prevState => {
        return { ...prevState, [stageData?.key]: withdrawAccount }
      })
      setStageStatus('success')
    }

    useEffect(() => {
      if(state[stageData?.key]){
        selectWithdrawAccount(state[stageData?.key])
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const depositSource = {
      otros_medios:{
        value:"otros_medios",
        Icon:AiFillBank,
        uiName:"Transferencia bancaria",
        metaData:[
          "Sucursal Virtual O APP",
          "Cajero Automático",
          "Sucursal Física"
        ]
      },
      en_efectivo:{
        value:"en_efectivo",
        Icon:BsCash,
        uiName:"En efectivo",
        metaData:[
          "Corresponsal Bancario",
          "Cajero Multifuncional",
          "Sucursal Física (Solo Efectivo)"
        ]
      } 
    }

    // console.log('WITHDRAW ACCOUNT => ', depositSource[state[stageData?.key]?.value])
    const currentMetadata = depositSource[state[stageData?.key]?.value]?.metaData
    console.log('WITHDRAW ACCOUNT => ', currentMetadata)

    return(
      <StageContainer className="_identityComponent">
        {children} 
        <OptionInputContainer>
          <p className="fuente _pLabel _inputLabelP">{stageData?.uiName}</p>
          <SelectListContainer>
            {
              depositSource && Object.keys(depositSource).map((key, index) => {

                const isSelected = [depositSource[key]?.value].includes(state[stageData?.key]?.value)
                return <ItemListComponent 
                  key={index} 
                  // className={`auxNumber`}
                  itemList={depositSource[key]}
                  // auxUiName={isSelected && withdrawAccount?.account_number?.value}
                  firstIndex={index === 0}
                  lastIndex={(Object.keys(depositSource)?.length - 1) === index}
                  isSelectedItem={isSelected}
                  isMovilViewport={isMovilViewport}
                  handleAction={selectWithdrawAccount}
                />
              })
            }
          </SelectListContainer>
        </OptionInputContainer>
        {
          currentMetadata &&
          <MetaDataContainer>
            <ul>
            {
              currentMetadata?.map((depositItem, key) => {
                return <li className="fuente" key={key}>{depositItem}</li>
              })
            }
            </ul>
          </MetaDataContainer>
        }

      </StageContainer>
    )
  }

const MetaDataContainer = styled.div`
  min-height:100px;
  background:#f0f0f0;
  display:grid;
  align-self: end;
  padding:15px 20px;
  width:calc(100% - 40px);
  max-width:calc(700px - 40px);
  ul{
    display: grid;
    align-items: center;
    row-gap: 10px;
    li{
      color:var(--paragraph_color);
      font-size:15px;
    }
  }
`

  // auxUiName

// const IdNumberPanel = ({ item }) => {
//     return( 
//       <PanelContainer>
//         <HR/>
//         <p className="fuente2">{item?.document_info?.id_number}</p>
//         <p className="fuente2">{item?.enabled ? 'Número' : 'Verificando...'}</p>
//       </PanelContainer>
//     )
// }




// const PanelContainer = styled.div`
//   width:auto;
//   display: grid;
//   align-items: center;
//   grid-template-columns: auto 1fr;
//   column-gap: 15px;
//   grid-template-rows: auto auto;
//   align-self: center;
//   row-gap: 3px;

//   ${HR}{
//     grid-column-start: 1;
//     grid-row-start: 1;
//     grid-row-end: 3;
//   }

//   p{
//     margin:0;
//     color:var(--paragraph_color);
//     font-size:18px;
//   }

//   p:nth-child(3) {
//     font-size:13px;
//     font-family: "Raleway",sans-serif;
//     color: var(--placeholder);
//   }
// `

