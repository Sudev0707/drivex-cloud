import { api } from "./api";
import type { MockFile } from "@/data/files";

export const fileService = {
  list: (files: MockFile[]) => api.get("/files", files),
  upload: (file: MockFile) => api.post("/files", file, file),
  rename: (id: string, name: string) => api.put(`/files/${id}`, { name }, { id, name }),
  remove: (id: string) => api.delete(`/files/${id}`),
};
