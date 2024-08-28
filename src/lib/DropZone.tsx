import { cloneElement } from "react";
import { convertFilesWithMeta, validateOptions } from "./util";
import { FileInputOptions, FileWithMeta } from "./types";

interface Props {
  children: React.ReactElement;
  onDrop: (files: FileWithMeta[]) => void;
  onError?: (error: Error) => void;
  onDragEnter?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
}

export default function DropZone({
  children,
  onDrop,
  onError,
  onDragEnter,
  onDragLeave,
  ...options
}: Props & FileInputOptions) {
  return cloneElement(children as React.DetailedReactHTMLElement<any, any>, {
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
    },
    onDragEnter: (e: React.DragEvent) => {
      e.preventDefault();
      onDragEnter?.(e);
    },
    onDragLeave: (e: React.DragEvent) => {
      e.preventDefault();
      onDragLeave?.(e);
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
