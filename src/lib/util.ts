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
  inputEl.accept = options?.accept
    ? Array.isArray(options.accept)
      ? options?.accept.join(",")
      : options.accept
    : "";
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
export function convertFilesWithMeta(files: FileList): FileWithMeta[] {
  const result: FileWithMeta[] = [];
  for (const file of files) {
    result.push({ origin: file, toUnit: getUnitFunc(file.size) });
  }
  return result;
}

/**
 * Validate options for each file
 */
export async function validateOptions(
  files: FileList,
  options?: FileInputOptions,
): Promise<void> {
  if (options?.multiple === false && files.length > 1) {
    throw new Error("Multiple files are not allowed");
  }

  if (options?.maxFiles && files.length > options?.maxFiles) {
    throw new Error(
      `Number of files(${files.length}) exceeds the limit: ${options?.maxFiles}`,
    );
  }

  for (const file of files) {
    if (options?.accept && !verifyAccept(file.type, options.accept)) {
      throw new Error(
        `File type(${file.type}) is not allowed: ${options.accept}`,
      );
    }

    if (options?.maxBytes && file.size > options.maxBytes) {
      throw new Error(
        `File size(${file.size}bytes) exceeds the limit: ${options.maxBytes}bytes`,
      );
    }

    if (options?.customValidator) {
      const isValid = options.customValidator(file);
      if (isValid instanceof Promise) {
        if (!(await isValid)) {
          throw new Error(`Custom validation failed: ${file.name}`);
        }
      } else if (!isValid) {
        throw new Error(`Custom validation failed: ${file.name}`);
      }
    }
  }
}

/**
 * Verify if the file type is allowed
 */
export function verifyAccept(type: string, accept: string | string[]): boolean {
  const allowed = (typeof accept === "string" ? accept.split(",") : accept).map(
    (x) => x.trim().replace(/\./g, ""),
  );
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

/**
 * return video, audio file's duration with seconds
 */
export async function getFileDuration(file: File) {
  const audio = new Audio();
  const objectUrl = URL.createObjectURL(file);
  audio.src = objectUrl;
  return new Promise<number>((resolve, reject) => {
    audio.onloadedmetadata = () => {
      resolve(audio.duration);
      URL.revokeObjectURL(objectUrl);
      audio.remove();
    };
    audio.onerror = (e) => {
      reject(e);
      URL.revokeObjectURL(objectUrl);
      audio.remove();
    };
  });
}
