import {
  FileInputOptions,
  FileWithMeta,
  TGetUnit,
  TUnit,
  units,
} from "./types";

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
    if (options?.maxBytes && file.size > options.maxBytes) {
      throw new Error(
        `File size(${file.size}) exceeds the limit: ${options.maxBytes}`,
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

  if (options.maxFiles && files.length > options.maxFiles) {
    throw new Error(
      `Number of files(${files.length}) exceeds the limit: ${options.maxFiles}`,
    );
  }

  for (const file of files) {
    if (options.customValidator && !options.customValidator(file)) {
      throw new Error(`Custom validation failed: ${file.name}`);
    }

    if (options.accept && !verifyAccept(file.type, options.accept)) {
      throw new Error(
        `File type(${file.type}) is not allowed: ${options.accept}`,
      );
    }

    if (options?.maxBytes && file.size > options.maxBytes) {
      throw new Error(
        `File size(${file.size}bytes) exceeds the limit: ${options.maxBytes}bytes`,
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
