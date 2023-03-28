import React from "react";

import "./styles/index.css";
import CropApp from "./components/cropApp.jsx";
import TagAnnotation from "./components/Tag-Annot/index.jsx";

function App() {

  return (
    <div className="App">
      {/*<CropApp/>*/}
      <TagAnnotation/>
    </div>
  );
}

export default App;
