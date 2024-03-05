import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(6, { message: "Password shall be more then 6 characters" }),
});

export const signUpSchema = z
  .object({
    name: z.string().min(1, { message: "Please enter your name" }),
    email: z.string().email({ message: "Please enter a valid email" }),
    number: z
      .string()
      .min(10, { message: "Please enter a valid number" })
      .max(10, { message: "Please enter a valid number" }),
    password: z
      .string()
      .min(6, { message: "Password shall be more then 6 characters" }),
    confirmPassword: z.string({
      required_error: "Please confirm your password",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const proposalSchema = z.object({
  title: z.string().min(1, { message: "Please enter title" }),
  description: z
    .string()
    .min(1, { message: "Please enter project description" }),
  objective: z.string().min(1, { message: "Please enter objective" }),
  duration: z.string().min(1, { message: "Please enter duration" }),
  budget: z.string().min(1, { message: "Please enter budget" }),
  state: z.string().min(1, { message: "Please enter state" }),
  district: z.string().min(1, { message: "Please enter district" }),
  pincode: z.string().min(1, { message: "Please enter pincode" }),
  postOffice: z.string().min(1, { message: "Please enter post office" }),
  policeStation: z.string().min(1, { message: "Please enter police station" }),
  address: z.string().min(1, { message: "Please enter address" }),
  bankName: z.string().min(1, { message: "Please enter bank name" }),
  ifsc: z.string().min(1, { message: "Please enter IFSC Code" }),
  accountNumber: z.string().min(1, { message: "Please enter account number" }),
  bankBranch: z.string().min(1, { message: "Please enter bank branch" }),
  incomeSource: z.string().min(1, { message: "Please enter income source" }),
  incomeAmount: z.string().min(1, { message: "Please enter income amount" }),
  ownerName: z.string().min(1, { message: "Please enter owner name" }),
  ownerNumber: z.string().min(1, { message: "Please enter owner number" }),
  ownerEmail: z.string().min(1, { message: "Please enter owner email" }),
  landLocation: z.string().min(1, { message: "Please enter land location" }),
  landArea: z.string().min(1, { message: "Please enter land area" }),
  landType: z.string().min(1, { message: "Please select land type" }),
  usage: z.string().min(1, { message: "Please enter land usage" }),
  ownershipStatus: z
    .string()
    .min(1, { message: "Please enter ownership status" }),
  landDescription: z.string(),
  remarks: z.string().optional(),
});
