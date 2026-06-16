import { apiClient } from "./apiClient";
import type { MockFolder } from "@/data/folders";

export const folderService = {
  list: async (): Promise<MockFolder[]> => {
    const { data } = await apiClient.get<MockFolder[]>("/folders");
    return data;
  },

  create: async (name: string): Promise<MockFolder> => {
    const { data } = await apiClient.post<MockFolder>("/folders", { name });
    return data;
  },

  rename: async (id: string, name: string): Promise<MockFolder> => {
    const { data } = await apiClient.put<MockFolder>(`/folders/${id}`, { name });
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/folders/${id}`);
  },
};
