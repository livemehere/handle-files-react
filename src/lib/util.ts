export type FileInputOptions = {
  multiple?: boolean;
  accept?: string;
  limitBytes?: number;
};

export interface FileWithMeta {
  origin: File;
  toUnit: TGetUnit;
}
export const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] as const;
export type TUnit = (typeof units)[number];
export type TGetUnit = (unit: TUnit, fixed?: number) => string;

export function setUpOptions(inputEl: HTMLInputElement, options?: FileInputOptions) {
  inputEl.type = 'file';
  inputEl.accept = options?.accept || '*';
  inputEl.multiple = options?.multiple || false;
}

export function getUnitFunc(bytes: number): TGetUnit {
  return (unit: TUnit, fixed = 0): string => {
    let size = bytes;
    const index = units.indexOf(unit);
    for (let i = 0; i < index; i++) {
      size /= 1024;
    }
    return `${size.toFixed(fixed)}${unit}`;
  };
}

export function convertFilesWithMeta(files: FileList, options: FileInputOptions): FileWithMeta[] {
  const result: FileWithMeta[] = [];
  for (const file of files) {
    if (options?.limitBytes && file.size > options.limitBytes) {
      throw new Error(`File size(${file.size}) exceeds the limit: ${options.limitBytes}`);
    }
    result.push({ origin: file, toUnit: getUnitFunc(file.size) });
  }
  return result;
}

export function validateOptions(files: FileList, options: FileInputOptions): void {
  if (!options.multiple && files.length > 1) {
    throw new Error('Multiple files are not allowed');
  }

  if (options.accept && Array.from(files).some((file) => !verifyAccept(file.type, options.accept!))) {
    throw new Error(`File type is not allowed ${options.accept}`);
  }

  for (const file of files) {
    if (options?.limitBytes && file.size > options.limitBytes) {
      throw new Error(`File size(${file.size}) exceeds the limit: ${options.limitBytes}`);
    }
  }
}

export function verifyAccept(type: string, accept: string): boolean {
  const allowed = accept.split(',').map((x) => x.trim().replace(/\./g, ''));
  const format = type.split('/')[1];
  console.log(type);
  return allowed.includes(type) || allowed.includes(type.split('/')[0] + '/*') || allowed.includes(format);
}
