import { PanelContainerComponent } from './styles'

export default function StatusPanelComponent ({ className = "", children }) {
    return(
      <PanelContainerComponent className={`${className}`}>
        {children}
      </PanelContainerComponent>
    )
}

