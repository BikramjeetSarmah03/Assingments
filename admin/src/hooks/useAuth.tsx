import { create } from "zustand";

interface User {
  name: string;
  email: string;
  number: string;
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
