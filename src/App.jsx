import "./styles/index.css";
import Canvas from "./components/canvas";
import TagText from "./components/Tag-Annot";
import TestImage from "./assets/testImage.png";
import TagAnnSRCTEXT from "./components/testAnnot";
import AnnoRedDot from "./extra";
import Sundry from "./extra/sundry";

function App() {
  return (
    <div className='App'>
      {/* <Canvas width={700} height={500} /> */}
      {/* <TagText /> */}
      {/* <AnnoRedDot imageSrc={TestImage} /> */}
      {/* <TagAnnSRCTEXT src={TestImage} text={"Hi Akash"} /> */}
      <Sundry imageSrc={TestImage} />
    </div>
  );
}

export default App;
