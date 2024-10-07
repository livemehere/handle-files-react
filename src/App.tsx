import { useState } from "react";
import { DropZone, FileWithMeta, getFileDuration } from "./lib";

function App() {
  const [files, setFiles] = useState<FileWithMeta[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>();

  return (
    <div>
      <DropZone
        onDrop={(files) => {
          setFiles(files);
        }}
        onError={(e) => {
          console.log(e);
          setErrorMsg(e.message);
        }}
        accept={["audio/mpeg"]}
        customValidator={async (file) => {
          const duration = await getFileDuration(file); // seconds
          if (duration > 2.5) {
            throw new Error(`Duration is too long ${duration}`);
          }
          return true;
        }}
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
          }}
        >
          DROP ZONE
          <ul>
            {files.map((file) => (
              <li key={file.origin.name}>
                {file.origin.name} ({file.toUnit("MB", 3)})
              </li>
            ))}
          </ul>
        </div>
      </DropZone>
      <div>{errorMsg}</div>
    </div>
  );
}

export default App;
