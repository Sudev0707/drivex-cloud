import type { MockFile } from "./files";

export interface SharedFile extends MockFile {
  sharedBy: string;
  sharedAt: string;
}

export const mockSharedFiles: SharedFile[] = [];
