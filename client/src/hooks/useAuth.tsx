import { create } from "zustand";

enum ROLE {
  USER,
  ADMIN,
}

interface User {
  name: string;
  email: string;
  number: string;
  role: ROLE;
}

interface AuthState {
  isAuth: boolean;
  setIsAuth: (isAuth: boolean, user?: User | null) => void;
  user: User | null;
}

export const useAuth = create<AuthState>((set) => ({
  isAuth: false,
  setIsAuth: (isAuth = false, user = null) => set({ isAuth, user }),
  user: null,
}));
