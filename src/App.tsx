import { useState } from "react";
import { convertToBytes, DropZone, FileWithMeta, useFileInput } from "./lib";

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
              maxBytes: convertToBytes(2.2, "MB"), // 10MB
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
        maxBytes={convertToBytes(10, "MB")}
        maxFiles={113}
        customValidator={(file) => {
          return file.name.includes("Blender");
        }}
      >
        <div
          ref={(el) => {
            console.log(el);
          }}
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
