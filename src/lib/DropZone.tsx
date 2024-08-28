import { cloneElement, DetailedReactHTMLElement } from "react";
import {
  convertFilesWithMeta,
  FileInputOptions,
  FileWithMeta,
  validateOptions,
} from "./util";

type Props = {
  children: DetailedReactHTMLElement<any, any>;
  onDrop: (files: FileWithMeta[]) => void;
  onError?: (error: Error) => void;
};

export default function DropZone({
  children,
  onDrop,
  onError,
  ...options
}: Props & FileInputOptions) {
  return cloneElement(children, {
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      try {
        validateOptions(files, options);
        onDrop(convertFilesWithMeta(files, options));
      } catch (e) {
        if (onError) {
          onError(e);
        }
      }
    },
  });
}
