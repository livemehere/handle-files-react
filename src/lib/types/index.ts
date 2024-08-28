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

export type FileInputOptions = {
  multiple?: boolean;
  accept?: string;
  maxBytes?: number;
  maxFiles?: number;
  customValidator?: (file: File) => boolean;
};

export interface FileWithMeta {
  origin: File;
  toUnit: TGetUnit;
}
