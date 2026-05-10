import { mockFiles, type MockFile } from "./files";

export interface SharedFile extends MockFile {
  sharedBy: string;
  sharedAt: string;
}

export const mockSharedFiles: SharedFile[] = [
  {
    ...mockFiles[1],
    sharedBy: "Priya Patel",
    sharedAt: "2025-05-07T09:00:00Z",
  },
  {
    ...mockFiles[3],
    sharedBy: "Diego Ramos",
    sharedAt: "2025-05-04T14:00:00Z",
  },
  {
    ...mockFiles[4],
    sharedBy: "Mei Tanaka",
    sharedAt: "2025-05-03T20:00:00Z",
  },
];
