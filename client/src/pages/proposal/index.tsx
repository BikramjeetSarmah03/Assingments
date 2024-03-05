import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { proposalSchema } from "@/lib/form-schemas";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoadingButton from "@/components/ui/loading-button";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { api } from "@/lib/api";

export default function Proposal() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof proposalSchema>>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      title: "",
      description: "",
      budget: "",
      duration: "",
      objective: "",
      state: "",
      district: "",
      pincode: "",
      postOffice: "",
      policeStation: "",
      address: "",
      bankName: "",
      ifsc: "",
      accountNumber: "",
      bankBranch: "",
      incomeSource: "",
      incomeAmount: "",
      ownerName: "",
      ownerNumber: "",
      ownerEmail: "",
      landLocation: "",
      landArea: "",
      landType: "",
      usage: "",
      ownershipStatus: "",
      landDescription: "",
      remarks: "",
    },
  });

  async function onSubmit(values: z.infer<typeof proposalSchema>) {
    try {
      const res = await api.post("/proposal", { ...values });

      if (!res.data.success) throw new Error("Error while submitting proposal");

      toast.success("Proposal Submitted Successfully");
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Error while submitting proposal");
      }
    }
  }

  return (
    <div className="pb-10 bg-gray-100">
      <div className="sticky top-0 flex items-center justify-between px-10 py-4 bg-white border">
        <h1 className="mt-4 text-2xl font-bold ">Add Proposal</h1>
        <Button
          variant={"outline"}
          className="gap-2"
          onClick={() => navigate("/")}>
          <ChevronLeftIcon />
          <span>Back</span>
        </Button>
      </div>

      <section className="px-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4">
            <div>
              <h1 className="font-serif text-xl">Proposal Details</h1>
              <div className="p-4 bg-white border">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Proposal Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          onChange={field.onChange}
                          value={field.value}
                          placeholder="Please enter description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name="objective"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Objective</FormLabel>
                        <FormControl>
                          <Input placeholder="Proposal Objective" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Please enter duration"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Budget</FormLabel>
                        <FormControl>
                          <Input placeholder="Please enter budget" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div>
              <h1 className="font-serif text-xl">Address Details</h1>
              <div className="p-4 bg-white border">
                <div className="flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel htmlFor="state">State</FormLabel>
                        <FormControl>
                          <Input
                            id="state"
                            placeholder="Please enter state"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel htmlFor="district">District</FormLabel>
                        <FormControl>
                          <Input
                            id="district"
                            placeholder="Please enter district"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pincode"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel htmlFor="pincode">Pincode</FormLabel>
                        <FormControl>
                          <Input
                            id="pincode"
                            placeholder="Please enter pincode"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name="postOffice"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel htmlFor="postOffice">Post Office</FormLabel>
                        <FormControl>
                          <Input
                            id="postOffice"
                            placeholder="Please enter post office"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="policeStation"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel htmlFor="policeStation">
                          Police Station
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="policeStation"
                            placeholder="Please enter police station"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel htmlFor="address">Address</FormLabel>
                      <FormControl>
                        <Input
                          id="address"
                          placeholder="Please enter address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div>
              <h1 className="font-serif text-xl">Bank Details</h1>
              <div className="p-4 bg-white border">
                <div className="flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel htmlFor="bankName">Bank Name</FormLabel>
                        <FormControl>
                          <Input
                            id="bankName"
                            placeholder="Please enter Bank Name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bankBranch"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel htmlFor="bankBranch">Bank Branch</FormLabel>
                        <FormControl>
                          <Input
                            id="bankBranch"
                            placeholder="Please enter Bank Branch"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name="ifsc"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel htmlFor="ifsc">Bank IFSC</FormLabel>
                        <FormControl>
                          <Input
                            id="ifsc"
                            placeholder="Please enter Bank IFSC"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel htmlFor="accountNumber">
                          Account Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="accountNumber"
                            placeholder="Please enter Account Number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div>
              <h1 className="font-serif text-xl">Income Details</h1>
              <div className="p-4 bg-white border">
                <div className="flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name="incomeAmount"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel htmlFor="incomeAmount">
                          Income Amount
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="incomeAmount"
                            placeholder="Please enter Income Amount"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="incomeSource"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel htmlFor="incomeSource">
                          Income Source
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="incomeSource"
                            placeholder="Please enter Income Source"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div>
              <h1 className="font-serif text-xl">Land Details</h1>
              <div className="p-4 bg-white border">
                <div className="flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name="ownerName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel htmlFor="ownerName">Owner Name</FormLabel>
                        <FormControl>
                          <Input
                            id="ownerName"
                            placeholder="Please enter owner name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ownerNumber"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel htmlFor="ownerNumber">
                          Owner Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="ownerNumber"
                            placeholder="Please enter Owner Number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ownerEmail"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel htmlFor="ownerEmail">Owner Email</FormLabel>
                        <FormControl>
                          <Input
                            id="ownerEmail"
                            placeholder="Please enter Owner Email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name="landLocation"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel htmlFor="landLocation">
                          Land Location
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="landLocation"
                            placeholder="Please enter land location"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="landArea"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel htmlFor="landArea">Land Area</FormLabel>
                        <FormControl>
                          <Input
                            id="landArea"
                            placeholder="Please enter Land Area"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name="landType"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel htmlFor="landType">Land Type</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select land type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="AGRICULTURAL">
                                  Agricultural
                                </SelectItem>
                                <SelectItem value="RESENDITIAL">
                                  Resenditial
                                </SelectItem>
                                <SelectItem value="COMMERCIAL">
                                  Commercial
                                </SelectItem>
                                <SelectItem value="OTHER">Other</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="usage"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel htmlFor="usage">Land Usage</FormLabel>
                        <FormControl>
                          <Input
                            id="usage"
                            placeholder="Please enter Land Usage"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ownershipStatus"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel htmlFor="ownershipStatus">
                          Land Ownership Status
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="ownershipStatus"
                            placeholder="Please enter Land Ownership Status"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="landDescription"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel htmlFor="landDescription">
                        Land Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          id="landDescription"
                          placeholder="Please enter Land Description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="p-4 bg-white">
              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel htmlFor="remarks">Remarks</FormLabel>
                    <FormControl>
                      <Textarea
                        id="remarks"
                        placeholder="Please enter Remarks"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <LoadingButton
              loading={form.formState.isSubmitting}
              type="submit"
              className="w-full">
              Submit Proposal
            </LoadingButton>
          </form>
        </Form>
      </section>
    </div>
  );
}
