# Handle Files React

![logo.png](docs%2Fimg%2Flogo.png)

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
                        accept: ["image/*", "video/mp4"], // native input accept attribute
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
                accept={["image/*"]}
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

## `customValidator`

> return `boolean` or `Promise<boolean>` or throw `Error`

If you want to get message `onError` callback, you can throw `Error`. Returning `boolean` or `Promise<boolean>` will get default message.

### 1. Throw Error 

```tsx
<DropZone
    onError={(e) => {
        setErrorMsg(e.message); // e.message is ".wav extension is not allowed"
    }}
    accept={["audio/mpeg"]}
    customValidator={(file) => {
        if (file.name.includes("wav")) {
            throw new Error(".wav extension is not allowed");
        }
        return true;
    }}
/>
```

### 2. Return boolean

```tsx
<DropZone
    onError={(e) => {
        setErrorMsg(e.message); // `Custom validation failed: ${file.name}`
    }}
    maxBytes={convertToBytes(10, "MB")}
    customValidator={(file) => {
        if (file.size > convertToBytes(10, "MB")) {
            return false;
        }
        return true;
    }}
/>
```

### 3. Return Promise

```tsx
<DropZone
    onError={(e) => {
      setErrorMsg(e.message); // `timeout error`
    }}
    accept={["audio/mpeg"]}
    customValidator={async (file) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      throw new Error("timeout error");
        return true;
    }}
>
````

## `accept` options

`accept` option is used to filter the file type and use the `File.type` property. (not the file extension)   
It works like the native input accept attribute. so, it supports `string` or `string[]`.

```ts
// 1. string[]  
const files = await open({
accept: ["image/*", "video/mp4"], // same with <input accept="image/*, video/mp4">
});

// 2. string
const files2 = await open({
    accept: "image/*, video/mp4", // same with <input accept="image/*, video/mp4">
});
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
  accept?: string | string[]; // MIME type
  maxBytes?: number;
  maxFiles?: number;
  customValidator?: (file: File) => boolean | Promise<boolean>;
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
    onDragEnter?: (e: React.DragEvent) => void;
    onDragLeave?: (e: React.DragEvent) => void;
}

function DropZone(props:Props & FileInputOptions){
    // return clone children
}
```

## Util funcitons

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

### `getUnitFunc(bytes: number): TGetUnit`

```ts
const toUnit = getUnitFunc(10485760);
toUnit("MB", 1); // 10.0MB
```

### `getFileDuration(file: File):Promise<number>`

Get the duration of the video, audio file.

```ts
const duration = await getFileDuration(file); // seconds
console.log(duration); // 10.0
```

## Tips

### Infer the type of the file

`accept` option is used to filter the file type and use the `File.type` property.   
Here, is the situation where `image.ai` is not an type of `.ai` but `application/postscript`.   
But you can get actual file type by error.

![type-help.png](docs%2Fimg%2Ftype-help.png)
