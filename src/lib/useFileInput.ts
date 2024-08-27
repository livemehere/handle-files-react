import { useEffect, useRef } from 'react';
import { convertFilesWithMeta, FileInputOptions, FileWithMeta, setUpOptions, validateOptions } from './util';

export default function useFileInput() {
  const ref = useRef<HTMLInputElement>();

  useEffect(() => {
    const inputEl = document.createElement('input');
    ref.current = inputEl;
  }, []);

  const open = (options?: FileInputOptions) => {
    const inputEl = ref.current;
    if (!inputEl) {
      throw new Error('input element is not created for useFileInput');
    }
    setUpOptions(inputEl, options);
    return new Promise<FileWithMeta[]>((resolve, reject) => {
      inputEl.onchange = (e) => {
        try {
          const files = (e.target as HTMLInputElement).files;
          validateOptions(files, options);
          resolve(convertFilesWithMeta(files, options));
        } catch (e) {
          reject(e);
        } finally {
          inputEl.onchange = null;
        }
      };
      inputEl.click();
    });
  };

  return { open };
}
