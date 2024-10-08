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

export interface FileInputOptions {
  multiple?: boolean;
  accept?: string | string[];
  maxBytes?: number;
  maxFiles?: number;
  customValidator?: (file: File) => boolean | Promise<boolean>;
}

export interface FileWithMeta {
  origin: File;
  toUnit: TGetUnit;
}
