const Image = ({ src, alt, width, height, className }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={width} height={height} className={className} />
  );
  
  export default Image;