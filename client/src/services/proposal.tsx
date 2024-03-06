import { api } from "@/lib/api";

export const getDashboardData = async () => {
  const { data } = await api.get("/user/dashboard");

  return data;
};

export const getSingleProposal = async (id: string) => {
  const { data } = await api.get(`/proposal/${id}`);

  return data;
};
