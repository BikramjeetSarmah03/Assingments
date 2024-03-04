import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { isAxiosError } from "axios";
import LoadingButton from "@/components/ui/loading-button";

const signUpSchema = z
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

export default function SignUp() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      number: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    try {
      const res = await api.post("/auth/sign-up", { ...values });

      if (res.data.success) {
        toast.success("Signed Up Successfully");
        navigate("/");
      } else {
        throw Error("Error While Signing Up");
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else {
        toast.error("Error while signing up");
      }
    }
  }

  return (
    <main className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <Link
          to="/"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          Proposal
        </Link>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create and account
            </h1>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 md:space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Your Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="name"
                          placeholder="Please enter your name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Your Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Please enter your email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="number"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Your Contact Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="number"
                          type="number"
                          placeholder="Please enter your contact number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Please enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="cfpassword"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="cfpassword"
                          type="password"
                          placeholder="Please confirm your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <LoadingButton
                  loading={form.formState.isSubmitting}
                  className="w-full">
                  Create an account
                </LoadingButton>

                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    to="/auth/sign-in"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                    Login here
                  </Link>
                </p>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </main>
  );
}
