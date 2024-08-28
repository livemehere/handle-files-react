import { useState } from "react";
import { DropZone, FileWithMeta } from "./lib";

function App() {
  const [files, setFiles] = useState<FileWithMeta[]>([]);
  return (
    <div>
      <DropZone
        onDrop={(files) => {
          setFiles(files);
        }}
        onError={(e) => {
          console.log(e);
        }}
        accept={".ai"}
      >
        <div
          style={{
            width: 800,
            height: 500,
            backgroundColor: "#e2e8f033",
            border: "2px dashed #cbd5e1",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            fontWeight: "bold",
            fontSize: "2rem",
          }}
        >
          Handle Files React
          <ul>
            {files.map((file) => (
              <li key={file.origin.name}>
                {file.origin.name} ({file.toUnit("MB", 1)})
              </li>
            ))}
          </ul>
        </div>
      </DropZone>
    </div>
  );
}

export default App;
