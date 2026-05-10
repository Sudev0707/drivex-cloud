export interface MockUser {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  plan: "Free" | "Pro" | "Business";
  storageLimitMb: number;
}

export const mockUsers: MockUser[] = [
  {
    id: "u-1",
    name: "Alex Morgan",
    email: "alex@drivex.app",
    password: "demo1234",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Alex%20Morgan&backgroundColor=3b82f6&textColor=ffffff",
    plan: "Pro",
    storageLimitMb: 15360,
  },
  {
    id: "u-2",
    name: "Jamie Lee",
    email: "jamie@drivex.app",
    password: "demo1234",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Jamie%20Lee&backgroundColor=10b981&textColor=ffffff",
    plan: "Free",
    storageLimitMb: 2048,
  },
];
