import { api } from "@/lib/api";

export const getProposals = async () => {
  const { data } = await api.get("/proposal/all");

  return data;
};

export const getSingleProposal = async (id: string) => {
  const { data } = await api.get(`/proposal/${id}`);

  return data;
};
