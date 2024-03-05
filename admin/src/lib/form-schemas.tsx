import { z } from "zod";

export const signInSchema = z.object({
  username: z.string().min(1, { message: "Please enter username" }),
  password: z
    .string()
    .min(6, { message: "Password shall be more then 6 characters" }),
});

export const proposalSchema = z.object({
  title: z.string().min(1, { message: "Please enter title" }),
  description: z
    .string()
    .min(1, { message: "Please enter project description" }),
  objective: z.string().min(1, { message: "Please enter objective" }),
  duartion: z.string().min(1, { message: "Please enter duration" }),
  budget: z.string().min(1, { message: "Please enter budget" }),
});
