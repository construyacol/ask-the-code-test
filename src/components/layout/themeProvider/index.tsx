import { ThemeProvider } from 'styled-components';
import { defaultTheme } from 'styles/theme'; 
import { ChildrenReactNode } from 'interfaces/utils';

const AppThemeProvider = ({ children }:ChildrenReactNode )=> {
    return(
        <ThemeProvider theme={defaultTheme}>
           {children}
        </ThemeProvider>
    )
}

export default AppThemeProvider
