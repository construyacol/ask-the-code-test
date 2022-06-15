import styled from 'styled-components'


export default function StatusPanelComponent ({ children }) {
    return(
      <PanelContainerComponent>
        {children}
      </PanelContainerComponent>
    )
}

  
  const PanelContainerComponent = styled.div`
    width:auto;
    max-width:calc(350px - 20px);
    background:#ededed;
    display:grid;
    grid-template-rows:1fr auto;
    padding:20px;
    row-gap:20px;
    position: sticky;
    top: 195px;
    ${'' /* max-height: 580px; */}
  `