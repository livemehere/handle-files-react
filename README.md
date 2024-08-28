# Handle Files React

**[npm](https://www.npmjs.com/package/handle-files-react)**

## Description

Easy and Quick way to handle files in React with `<Dropzone/>` and `useFileInput()` hook.

## Installation

```bash
npm install handle-files-react
yarn add handle-files-react
pnpm add handle-files-react
```

## Quick Start

### `useFileInput()`

```jsx
import { useFileInput, FileWithMeta, convertToBytes } from 'handle-files-react';

function App(){
    const { open } = useFileInput();
    const [files, setFiles] = useState<FileWithMeta[]>([]);
    
    return (
        <div>
            <button onClick={async ()=>{
                try {
                    const files = await open({
                        multiple: true,
                        maxBytes: convertToBytes(10, "MB"), // 10MB
                        accept: ".mp4, .png", // native input accept attribute
                        maxFiles:5,
                        customValidator: (file) => file.name.includes("Blender")
                    });
                    setFiles(files);
                } catch (e) {
                    console.error(e);
                }
            }}>Select</button>
            <ul>
                {files.map((file) => (
                    <li key={file.origin.name}>
                        {file.origin.name} ({file.toUnit("MB", 1)})
                    </li>
                ))}
            </ul>
        </div>
    )
}
```

### `<Dropzone/>`

```jsx
function App() {
    const [files, setFiles] = useState<FileWithMeta[]>([]);
    const [refEl, setRefEl] = useState<HTMLDivElement | null>(null);
    return (
        <div>
            <DropZone
                onDrop={(files) => {
                    setFiles(files);
                }}
                onError={(e) => {
                    console.error(e);
                }}
                multiple={true}
                maxBytes={convertToBytes(10, "MB")}
                accept={".mp4, .png"}
                maxFiles={5}
                customValidator={(file) => {
                    return file.name.includes("Blender");
                }}
            >
                <div
                    ref={(el) => {
                        if(!refEl) {
                            setRefEl(el); // use ref element with state
                        }
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
```

## API

### `common`

```ts
const units = [
    "B",
    "KB",
    "MB",
    "GB",
    "TB",
    "PB",
    "EB",
    "ZB",
    "YB",
] as const;

interface FileInputOptions {
  multiple?: boolean;
  accept?: string;
  maxBytes?: number;
  maxFiles?: number;
  customValidator?: (file: File) => boolean;
};

interface FileWithMeta {
    origin: File;
    toUnit: TGetUnit;
}
```

### `useFileInput()`

```ts
function useFileInput(){
    const open = (options?: FileInputOptions) => {
        // ...
    }
    return { open };
}
```

### `<Dropzone/>`

```ts
interface Props {
    children: React.ReactElement;
    onDrop: (files: FileWithMeta[]) => void;
    onError?: (error: Error) => void;
}

function DropZone(props:Props & FileInputOptions){
    // return clone children
}
```

## Utils

### `convertToBytes(value: number, unit: TUnit): number`

value * 1024^index (index is the index of the unit in the `units` array)

```ts
convertToBytes(10, "MB"); // 10485760
convertToBytes(10, "GB"); // 10737418240
convertToBytes(10, "TB"); // 10995116277760
```

### `FileWithMeta.toUnit(unit: TUnit, fixed?: number): string`

```ts
fileWithMeta.toUnit("MB", 1); // 10.0MB
fileWithMeta.toUnit("GB", 2); // 10.00GB
fileWithMeta.toUnit("TB", 3); // 10.000TB
```
