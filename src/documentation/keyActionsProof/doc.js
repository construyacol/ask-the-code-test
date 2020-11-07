import React from 'react'
import styled from "styled-components";
import { InputKeyActionHandler } from '../../components/widgets/accountList/styles';
import ModalLayout from '../../components/widgets/modal/modallayout';
import { device } from '../../const/const';
import { useActions } from '../../hooks/useActions';
import useNavigationKeyActions, { useItemsInteractions } from '../../hooks/useNavigationKeyActions';

/**
* @param items los items a representar como objetos navegables
*/
const items = [
    { name: 'Test1' },
    { name: 'Test7' },
    { name: 'Test3' },
    { name: 'Test6' },
    { name: 'Test4' },
    { name: 'Test11' }
]
export default function TestingComponent() {
    const [setCurrentSelection] = useNavigationKeyActions({
        items,
        loader: false, // si queremos que los items se sincronicen con el loader del app, pasamos el loader como parametro
        uniqueIdForElement: 'test-item-', // el uniqueIdForElement tiene que ser unico para ca instancia de useNavigationKeyActions
        modalRestriction: false, // como usaremos useNavigationKeyActions en un modal no es necesario restringir
        default: 0, // seleccionado como default 
        next: 40, //arrows right and left, si no funcion entonces verificar que no este en uso el keyEvent
        prev: 38
    })
    const actions = useActions()
    const closeModal = (e) => {
        if (!e || (e.target.dataset && e.target.dataset.close_modal)) {
            actions.renderModal(null)
        }
    }

    return (
        <ModalLayout>
            <MainContainer>
                <CloseButton onClick={() => closeModal()}><i className="far fa-times-circle"></i></CloseButton>
                <ol>
                    {
                        /**
                         * el index es importante en esta parte, para comunicar los hooks
                         * notese que el focusedId es la clase con el index de subfijo
                         * a seguir en componente que usamos como item
                         */
                        items.map((item, index) => (
                            <TestItem
                                key={index}
                                setCurrentSelection={setCurrentSelection}
                                focusedId={`test-item-${index}`}
                                number={index}
                                {...item}
                            />
                        ))
                    }
                </ol>
            </MainContainer>
        </ModalLayout>
    )
}

const TestItem = (props) => {
    /**
     * usamos las props como primer argumento ya que comtiene lo que enviamos previamente desde el componente contenedor
     * seguido de las acciones que representaran las teclas enter y sup cuando el item este focus o seleccionado
     * de tercer argumente le decimos que habilite la funcionalidad en modales, solo si estamons queriendo esto en un modal,
     * de lo contrario no enviar nada como argumento
     *
     * esto nos devuelve
     * @param {Boolean} isSelected que nos dice cuando el elemento esta seleccionado como puntero
     * @param {Function} setFocus para seleccionar como puntero de forma forzada o con un estado externo al hook,
     * o con alguna logica interna del componente item
     * por ahora setFocus no es necesaria
     */
    const [isSelected, setFocus] = useItemsInteractions(
        props,
        { suprKeyAction: () => false, enterKeyAction: () => false },
        false)

    // si esta seleccionado el elemento aplicamos estilos o otra condicion
    return (
        <li style={isSelected ? { color: 'red', fontSize: 14 } : {}}>
            <InputKeyActionHandler name="itemFromList" autoComplete="off" id={props.focusedId} />
            {props.name}
        </li>
    )
}

const CloseButton = styled.div`
  cursor: pointer;
  border-radius: 50%;
  position: absolute;
  right: 1em;
  top: 1em;
  font-size: 2em;
  transition: all 500ms ease;
  color: #4a4a4a;
`

const MainContainer = styled.div`
  width: 90%;
  height: 90%;
  background: white;
  position: relative;
  border-radius: 6px;
  @media ${device.tabletL} {
    width: 100%;
    height: 100%;
    position: absolute;
  }
`
