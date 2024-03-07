import { api } from "@/lib/api";

export const getAllUsers = async () => {
  const { data } = await api.get(`/users`);

  return data;
};
