import "./App.css";
import VideoFrameSaver from "./VideoFrameSaver";
import ImageUpscaler from "./ImageUpscaler";

import { useState } from "react";

function App() {
  const [checked, setChecked] = useState(false);

  const styleLabel = checked ? { color: "#087ea4" } : { color: "#333333" };
  return (
    <div className="App">
      <div className="transfer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        ></input>
        <label style={styleLabel} className="title_trans">
          {checked ? "Image Upscaler" : "Video FrameSaver"}
        </label>
      </div>
      {checked ? (
        <section>
          <ImageUpscaler />
        </section>
      ) : (
        <section>
          <VideoFrameSaver />
        </section>
      )}
    </div>
  );
}

export default App;
