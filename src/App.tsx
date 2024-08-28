import { DropZone, useFileInput } from "./lib";
import { convertToBytes, FileWithMeta } from "./lib/util";
import { useState } from "react";

function App() {
  const { open } = useFileInput();
  const [files, setFiles] = useState<FileWithMeta[]>([]);
  return (
    <div>
      <button
        onClick={async () => {
          try {
            const files = await open({
              multiple: true,
              limitBytes: convertToBytes(2.2, "MB"), // 10MB
              accept: ".mp4",
            });
            files.forEach((file) => {
              console.log(file);
              console.log(file.toUnit("MB", 2));
            });
          } catch (e) {
            console.log(e);
          }
        }}
      >
        SELECT
      </button>
      <DropZone
        onDrop={(files) => {
          setFiles(files);
        }}
        onError={(e) => {
          console.log(e);
        }}
        multiple={true}
        limitBytes={convertToBytes(10, "MB")}
        accept={".mp4, .ai, application/postscript"}
      >
        <div
          style={{
            width: 500,
            height: 500,
            backgroundColor: "gray",
          }}
        >
          DROP ZONE
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
