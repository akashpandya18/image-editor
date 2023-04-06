import "./styles/index.css";
import TestImage from "./assets/testImage.png";
import ImageAnnot from "./components/testAnnot";
import Canvas from "./components/canvas";

export default function App() {
  return (
    <div className='App'>
      {/* <Canvas height={400} width={600} /> */}
      {/* <AnnotationCanvas imageUrl={TestImage} annotations={data} /> */}
      <ImageAnnot imageSrc={TestImage} />
    </div>
  );
}
