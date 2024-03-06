import { api } from "@/lib/api";

export const getProposals = async () => {
  const { data } = await api.get("/proposal");

  return data;
};

export const getSingleProposal = async (id: string) => {
  const { data } = await api.get(`/proposal/${id}`);

  return data;
};
