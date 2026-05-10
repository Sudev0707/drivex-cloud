// Dummy axios-style service layer (no real network calls).
// Mirrors what a real API client would look like.

interface DummyResponse<T> {
  data: T;
  status: number;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const api = {
  get: async <T,>(url: string, mock: T): Promise<DummyResponse<T>> => {
    await delay(300);
    return { data: mock, status: 200 };
  },
  post: async <T,>(url: string, body: unknown, mock: T): Promise<DummyResponse<T>> => {
    await delay(400);
    return { data: mock, status: 201 };
  },
  put: async <T,>(url: string, body: unknown, mock: T): Promise<DummyResponse<T>> => {
    await delay(400);
    return { data: mock, status: 200 };
  },
  delete: async (url: string): Promise<DummyResponse<{ ok: true }>> => {
    await delay(300);
    return { data: { ok: true }, status: 200 };
  },
};
