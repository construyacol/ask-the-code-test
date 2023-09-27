export const MAX_WIDTH_LAYOUT = '1380px';

export const size = {
  mobile: 768,
  tablet: 1024,
  desktop: 1300,
  large:1400
};

export const device = {
  mobile: `(max-width: ${size.mobile}px)`,
  tablet: `(min-width: ${size.mobile}px) and (max-width:${size.tablet}px)`,
  laptop: `(min-width: ${size.mobile}px) and (max-width:${size.desktop}px)`,
  desktop: `(min-width: ${size.desktop}px)`,
  large:`(min-width: ${size.large}px)`
};

export const viewportDefaultState = {
  viewportWidth: 0,
  isMobile: 0,
  isLaptop: 0,
  isDesktop: 0,
  isCustom: 0
}; 

export const OS = {
  ANDROID:"android",
  IOS:"ios",
  MAC_OS:"macOs",
  LINUX:"linux",
  WINDOWS:"windows",
}

// export type viewportDefaultState = typeof viewportDefaultState[keyof typeof viewportDefaultState];