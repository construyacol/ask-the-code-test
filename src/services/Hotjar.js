const hotJar = async() => {
  if(process.env.NODE_ENV !== "production")return ;
  const lib = await import('react-hotjar')
  lib.default.hotjar.initialize(1688041, 6);
}

export default hotJar