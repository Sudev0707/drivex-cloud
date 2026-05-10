export interface MockFolder {
  id: string;
  name: string;
  createdAt: string;
  color: string;
}

export const mockFolders: MockFolder[] = [
  { id: "f-1", name: "Documents", createdAt: "2025-04-12T09:00:00Z", color: "#3b82f6" },
  { id: "f-2", name: "Photos", createdAt: "2025-04-18T14:20:00Z", color: "#ec4899" },
  { id: "f-3", name: "Work Projects", createdAt: "2025-05-01T11:30:00Z", color: "#f59e0b" },
  { id: "f-4", name: "Invoices", createdAt: "2025-05-04T16:00:00Z", color: "#10b981" },
];
