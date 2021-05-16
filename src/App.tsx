import React, { useState } from "react";
import CanvasController from "./components/CanvasController";
import ModalWindow from "./components/ModalWindow";

const App = () => {
  const [popup, setPopup] = useState<boolean>(false);

  return (
    <div className="App">
      <ModalWindow popup={popup} setPopup={setPopup} />
      <CanvasController setPopup={setPopup} />
    </div>
  );
};

export default App;
