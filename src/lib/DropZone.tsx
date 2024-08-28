import { cloneElement } from "react";
import { convertFilesWithMeta, validateOptions } from "./util";
import { FileInputOptions, FileWithMeta } from "./types";

interface Props {
  children: React.ReactElement;
  onDrop: (files: FileWithMeta[]) => void;
  onError?: (error: Error) => void;
}

export default function DropZone({
  children,
  onDrop,
  onError,
  ...options
}: Props & FileInputOptions) {
  return cloneElement(children as React.DetailedReactHTMLElement<any, any>, {
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      try {
        validateOptions(files, options);
        onDrop(convertFilesWithMeta(files));
      } catch (e) {
        if (onError) {
          onError(e as Error);
        }
      }
    },
  });
}
