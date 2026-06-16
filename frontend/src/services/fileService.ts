import { apiClient } from "./apiClient";
import type { MockFile } from "@/data/files";

type FileListParams = {
  trashed?: boolean;
  shared?: boolean;
};

export const fileService = {
  list: async (params: FileListParams = {}): Promise<MockFile[]> => {
    const { data } = await apiClient.get<MockFile[]>("/files", { params });
    return data;
  },

  upload: async (
    file: File,
    folderId?: string | null,
    onProgress?: (percent: number) => void,
  ): Promise<MockFile> => {
    const form = new FormData();
    form.append("file", file);
    if (folderId) form.append("folderId", folderId);

    const { data } = await apiClient.post<MockFile>("/files/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event) => {
        if (!onProgress || !event.total) return;
        onProgress(Math.round((event.loaded * 100) / event.total));
      },
    });
    return data;
  },

  rename: async (id: string, fileName: string): Promise<MockFile> => {
    const { data } = await apiClient.put<MockFile>(`/files/${id}`, { fileName });
    return data;
  },

  trash: async (id: string): Promise<MockFile> => {
    const { data } = await apiClient.patch<MockFile>(`/files/${id}/trash`);
    return data;
  },

  restore: async (id: string): Promise<MockFile> => {
    const { data } = await apiClient.patch<MockFile>(`/files/${id}/restore`);
    return data;
  },

  toggleShare: async (id: string): Promise<MockFile> => {
    const { data } = await apiClient.patch<MockFile>(`/files/${id}/share`);
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/files/${id}`);
  },
};
