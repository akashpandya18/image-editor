import "./styles/index.css";
import TagText from "./components/Tag-Annot";
import TestImage from "./assets/testImage.png";
import AnnoRedDot from "./extra";
import ImageAnnot from "./components/testAnnot";
import AnnotationCanvas from "./components/Tag-Annot";
import Canvas from "./components/canvas";

function App() {
  // const data = [
  //   {
  //     fontSize: "24px",
  //     fontFamily: "",
  //     color: "white",
  //     text: "Hi Akash",
  //     x: 24,
  //     y: 50,
  //   },
  // ];
  return (
    <div className='App'>
      {/* <Canvas height={400} width={600} /> */}
      {/* <AnnotationCanvas imageUrl={TestImage} annotations={data} /> */}
      <ImageAnnot imageSrc={TestImage} />
    </div>
  );
}

export default App;
