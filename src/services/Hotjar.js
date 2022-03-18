const hotJar = async() => {
  const lib = await import('react-hotjar')
  lib.default.hotjar.initialize(1688041, 6);
}

export default hotJar