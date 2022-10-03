import 'styled-components';

interface IPalette {
  current: 'dark' | 'ligth';
  main: string;
  contrastText: string;
}

interface ISpace {
  small: string;
  medium: string;
  big: string;
  huge: string;
}

declare module 'styled-components' {
  export interface DefaultTheme {
    palette: {
      [key:string]: string;
    };
    mode: IPalette;
  }
}

