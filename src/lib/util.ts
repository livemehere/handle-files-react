export type FileInputOptions = {
  multiple?: boolean;
  accept?: string;
  limitBytes?: number;
};

export interface FileWithMeta {
  origin: File;
  toUnit: TGetUnit;
}
export const units = [
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
export type TUnit = (typeof units)[number];
export type TGetUnit = (unit: TUnit, fixed?: number) => string;

/**
 * Set up options for the input element
 */
export function setUpOptions(
  inputEl: HTMLInputElement,
  options?: FileInputOptions,
) {
  inputEl.type = "file";
  inputEl.accept = options?.accept || "*";
  inputEl.multiple = options?.multiple ?? true;
}

/**
 * Get a function that converts bytes to the specified unit
 */
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

/**
 * Convert FileList to FileWithMeta[]
 */
export function convertFilesWithMeta(
  files: FileList,
  options: FileInputOptions,
): FileWithMeta[] {
  const result: FileWithMeta[] = [];
  for (const file of files) {
    if (options?.limitBytes && file.size > options.limitBytes) {
      throw new Error(
        `File size(${file.size}) exceeds the limit: ${options.limitBytes}`,
      );
    }
    result.push({ origin: file, toUnit: getUnitFunc(file.size) });
  }
  return result;
}

/**
 * Validate options for each file
 */
export function validateOptions(
  files: FileList,
  options: FileInputOptions,
): void {
  if (options.multiple === false && files.length > 1) {
    throw new Error("Multiple files are not allowed");
  }

  for (const file of files) {
    if (options.accept && !verifyAccept(file.type, options.accept)) {
      throw new Error(
        `File type(${file.type}) is not allowed: ${options.accept}`,
      );
    }

    if (options?.limitBytes && file.size > options.limitBytes) {
      throw new Error(
        `File size(${file.size}bytes) exceeds the limit: ${options.limitBytes}bytes`,
      );
    }
  }
}

/**
 * Verify if the file type is allowed
 */
export function verifyAccept(type: string, accept: string): boolean {
  const allowed = accept.split(",").map((x) => x.trim().replace(/\./g, ""));
  const format = type.split("/")[1];
  return (
    allowed.includes(type) ||
    allowed.includes(type.split("/")[0] + "/*") ||
    allowed.includes(format)
  );
}

/**
 * Get byte size from value and unit
 */
export function convertToBytes(value: number, unit: TUnit): number {
  const index = units.indexOf(unit);
  let size = value;
  for (let i = 0; i < index; i++) {
    size *= 1024;
  }
  return size;
}
