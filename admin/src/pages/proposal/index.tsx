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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { proposalSchema } from "@/lib/form-schemas";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeftIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSingleProposal } from "@/services/proposal";
import FullScreenLoader from "@/components/layout/full-screen-loader";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { arraysAreEqual, cn } from "@/lib/utils";

export default function Proposal() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const params = useParams();

  const [status, setStatus] = useState("");
  const [rejectedFields, setRejectedFields] = useState<string[]>([]);

  const getProposal = useQuery({
    queryKey: ["getProposal"],
    queryFn: async () => {
      const resData = await getSingleProposal(params.id as string);

      form.reset({
        title: resData.proposal.title || "",
        description: resData.proposal.description || "",
        budget: resData.proposal.budget || "",
        duration: resData.proposal.duration || "",
        objective: resData.proposal.objective || "",
        state: resData.proposal.address.state || "",
        district: resData.proposal.address.district || "",
        pincode: resData.proposal.address.pincode || "",
        postOffice: resData.proposal.address.postOffice || "",
        policeStation: resData.proposal.address.policeStation || "",
        address: resData.proposal.address.address || "",
        bankName: resData.proposal.bankDetails.bankName || "",
        ifsc: resData.proposal.bankDetails.ifsc || "",
        accountNumber: resData.proposal.bankDetails.accountNumber || "",
        bankBranch: resData.proposal.bankDetails.branch || "",
        incomeSource: resData.proposal.incomeDetails.source || "",
        incomeAmount: resData.proposal.incomeDetails.amount || "",
        ownerName: resData.proposal.landDetails.ownerName || "",
        ownerNumber: resData.proposal.landDetails.ownerNumber || "",
        ownerEmail: resData.proposal.landDetails.ownerEmail || "",
        landLocation: resData.proposal.landDetails.location || "",
        landArea: resData.proposal.landDetails.area || "",
        landType: resData.proposal.landDetails.type || "",
        usage: resData.proposal.landDetails.usage || "",
        ownershipStatus: resData.proposal.landDetails.ownershipStatus || "",
        landDescription: resData.proposal.landDetails.description || "",
        remarks: resData.proposal.remarks || "",
      });
      setStatus(resData.proposal.status);
      setRejectedFields(resData.proposal.highlightedFields);

      return resData;
    },
    enabled: !!params.id,
  });

  getProposal.isLoading ? <FullScreenLoader /> : null;
  getProposal.error ? (
    <div className="flex items-center justify-center h-full">
      Error : {getProposal.error?.message}
    </div>
  ) : null;

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
      if (status === "REJECTED" && rejectedFields.length <= 0)
        return toast.error("Please select the fields which have issues");

      const res = await api.patch(`/proposal/${params.id}`, {
        status,
        rejectedFields,
        remarks: values.remarks,
      });

      if (!res.data.success) throw new Error("Error while updating status");

      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      toast.success("Proposal Status Updated Successfully");
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Error while updating status");
      }
    }
  }

  const handleChangeStatus = (status: string) => {
    setStatus(status);
    setRejectedFields([]);
  };

  const handleRejectedField = (name: string) => {
    if (status === "REJECTED") {
      if (rejectedFields.includes(name)) {
        setRejectedFields(
          rejectedFields.filter((fieldName) => fieldName !== name)
        );
      } else {
        setRejectedFields([...rejectedFields, name]);
      }
    }
  };

  const isChecked = (name: string) => {
    return rejectedFields.includes(name);
  };

  return (
    <div className="pb-10 bg-gray-100">
      <div className="sticky top-0 flex items-center justify-between px-10 py-4 bg-white border">
        <h1 className="mt-4 text-2xl font-bold ">Approve Proposal</h1>
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
              <div className="p-4 space-y-4 bg-white border">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={cn(
                          isChecked(field.name) &&
                            "bg-red-500 p-2 px-8 text-white font-bold"
                        )}>
                        Title
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <Input
                            placeholder="Proposal Title"
                            {...field}
                            readOnly
                          />
                          {status === "REJECTED" && (
                            <Checkbox
                              onCheckedChange={() =>
                                handleRejectedField(field.name)
                              }
                              checked={isChecked(field.name)}
                            />
                          )}
                        </div>
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
                      <FormLabel
                        className={cn(
                          isChecked(field.name) &&
                            "bg-red-500 p-2 px-8 text-white font-bold"
                        )}>
                        Description
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <Textarea
                            onChange={field.onChange}
                            value={field.value}
                            readOnly
                            placeholder="Please enter description"
                          />
                          {status === "REJECTED" && (
                            <Checkbox
                              onCheckedChange={() =>
                                handleRejectedField(field.name)
                              }
                              checked={isChecked(field.name)}
                            />
                          )}
                        </div>
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
                        <FormLabel
                          className={cn(
                            isChecked(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Objective
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            <Input
                              placeholder="Proposal Objective"
                              {...field}
                              readOnly
                            />
                            {status === "REJECTED" && (
                              <Checkbox
                                onCheckedChange={() =>
                                  handleRejectedField(field.name)
                                }
                                checked={isChecked(field.name)}
                              />
                            )}
                          </div>
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
                        <FormLabel
                          className={cn(
                            isChecked(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Duration
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            {" "}
                            <Input
                              placeholder="Please enter duration"
                              {...field}
                              readOnly
                            />
                            {status === "REJECTED" && (
                              <Checkbox
                                onCheckedChange={() =>
                                  handleRejectedField(field.name)
                                }
                                checked={isChecked(field.name)}
                              />
                            )}
                          </div>
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
                        <FormLabel
                          className={cn(
                            isChecked(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Budget
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            {" "}
                            <Input
                              placeholder="Please enter budget"
                              {...field}
                              readOnly
                            />
                            {status === "REJECTED" && (
                              <Checkbox
                                onCheckedChange={() =>
                                  handleRejectedField(field.name)
                                }
                                checked={isChecked(field.name)}
                              />
                            )}
                          </div>
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
              <div className="p-4 space-y-4 bg-white border">
                <div className="flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel
                          className={cn(
                            isChecked(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          State
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            <Input
                              id="state"
                              placeholder="Please enter state"
                              {...field}
                              readOnly
                            />
                            {status === "REJECTED" && (
                              <Checkbox
                                onCheckedChange={() =>
                                  handleRejectedField(field.name)
                                }
                                checked={isChecked(field.name)}
                              />
                            )}
                          </div>
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
                        <FormLabel
                          className={cn(
                            isChecked(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          District
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            <Input
                              id="district"
                              placeholder="Please enter district"
                              {...field}
                              readOnly
                            />
                            {status === "REJECTED" && (
                              <Checkbox
                                onCheckedChange={() =>
                                  handleRejectedField(field.name)
                                }
                                checked={isChecked(field.name)}
                              />
                            )}
                          </div>
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
                        <FormLabel
                          className={cn(
                            isChecked(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Pincode
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            {" "}
                            <Input
                              id="pincode"
                              placeholder="Please enter pincode"
                              {...field}
                              readOnly
                            />
                            {status === "REJECTED" && (
                              <Checkbox
                                onCheckedChange={() =>
                                  handleRejectedField(field.name)
                                }
                                checked={isChecked(field.name)}
                              />
                            )}
                          </div>
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
                        <FormLabel
                          className={cn(
                            isChecked(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Post Office
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            {" "}
                            <Input
                              id="postOffice"
                              placeholder="Please enter post office"
                              {...field}
                              readOnly
                            />
                            {status === "REJECTED" && (
                              <Checkbox
                                onCheckedChange={() =>
                                  handleRejectedField(field.name)
                                }
                                checked={isChecked(field.name)}
                              />
                            )}
                          </div>
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
                        <FormLabel
                          className={cn(
                            isChecked(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Police Station
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            {" "}
                            <Input
                              id="policeStation"
                              placeholder="Please enter police station"
                              {...field}
                              readOnly
                            />
                            {status === "REJECTED" && (
                              <Checkbox
                                onCheckedChange={() =>
                                  handleRejectedField(field.name)
                                }
                                checked={isChecked(field.name)}
                              />
                            )}
                          </div>
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
                      <FormLabel
                        className={cn(
                          isChecked(field.name) &&
                            "bg-red-500 p-2 px-8 text-white font-bold"
                        )}>
                        Address
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <Input
                            id="address"
                            placeholder="Please enter address"
                            {...field}
                          />
                          {status === "REJECTED" && (
                            <Checkbox
                              onCheckedChange={() =>
                                handleRejectedField(field.name)
                              }
                              checked={isChecked(field.name)}
                            />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div>
              <h1 className="font-serif text-xl">Bank Details</h1>
              <div className="p-4 space-y-4 bg-white border">
                <div className="flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel
                          className={cn(
                            isChecked(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Bank Name
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            {" "}
                            <Input
                              id="bankName"
                              placeholder="Please enter Bank Name"
                              {...field}
                              readOnly
                            />
                            {status === "REJECTED" && (
                              <Checkbox
                                onCheckedChange={() =>
                                  handleRejectedField(field.name)
                                }
                                checked={isChecked(field.name)}
                              />
                            )}
                          </div>
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
                        <FormLabel
                          className={cn(
                            isChecked(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Bank Branch
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            {" "}
                            <Input
                              id="bankBranch"
                              placeholder="Please enter Bank Branch"
                              {...field}
                              readOnly
                            />
                            {status === "REJECTED" && (
                              <Checkbox
                                onCheckedChange={() =>
                                  handleRejectedField(field.name)
                                }
                                checked={isChecked(field.name)}
                              />
                            )}
                          </div>
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
                        <FormLabel
                          className={cn(
                            isChecked(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Bank IFSC
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            {" "}
                            <Input
                              id="ifsc"
                              placeholder="Please enter Bank IFSC"
                              {...field}
                              readOnly
                            />
                            {status === "REJECTED" && (
                              <Checkbox
                                onCheckedChange={() =>
                                  handleRejectedField(field.name)
                                }
                                checked={isChecked(field.name)}
                              />
                            )}
                          </div>
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
                        <FormLabel
                          className={cn(
                            isChecked(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Account Number
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            {" "}
                            <Input
                              id="accountNumber"
                              placeholder="Please enter Account Number"
                              {...field}
                              readOnly
                            />
                            {status === "REJECTED" && (
                              <Checkbox
                                onCheckedChange={() =>
                                  handleRejectedField(field.name)
                                }
                                checked={isChecked(field.name)}
                              />
                            )}
                          </div>
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
              <div className="p-4 space-y-4 bg-white border">
                <div className="flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name="incomeAmount"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel
                          className={cn(
                            isChecked(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Income Amount
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            {" "}
                            <Input
                              id="incomeAmount"
                              placeholder="Please enter Income Amount"
                              {...field}
                              readOnly
                            />
                            {status === "REJECTED" && (
                              <Checkbox
                                onCheckedChange={() =>
                                  handleRejectedField(field.name)
                                }
                                checked={isChecked(field.name)}
                              />
                            )}
                          </div>
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
                        <FormLabel
                          className={cn(
                            isChecked(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Income Source
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            {" "}
                            <Input
                              id="incomeSource"
                              placeholder="Please enter Income Source"
                              {...field}
                              readOnly
                            />
                            {status === "REJECTED" && (
                              <Checkbox
                                onCheckedChange={() =>
                                  handleRejectedField(field.name)
                                }
                                checked={isChecked(field.name)}
                              />
                            )}
                          </div>
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
              <div className="p-4 space-y-4 bg-white border">
                <div className="flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name="ownerName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel
                          className={cn(
                            isChecked(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Owner Name
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            {" "}
                            <Input
                              id="ownerName"
                              placeholder="Please enter owner name"
                              {...field}
                              readOnly
                            />
                            {status === "REJECTED" && (
                              <Checkbox
                                onCheckedChange={() =>
                                  handleRejectedField(field.name)
                                }
                                checked={isChecked(field.name)}
                              />
                            )}
                          </div>
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
                        <FormLabel
                          className={cn(
                            isChecked(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Owner Number
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            <Input
                              id="ownerNumber"
                              placeholder="Please enter Owner Number"
                              {...field}
                              readOnly
                            />
                            {status === "REJECTED" && (
                              <Checkbox
                                onCheckedChange={() =>
                                  handleRejectedField(field.name)
                                }
                                checked={isChecked(field.name)}
                              />
                            )}
                          </div>
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
                        <FormLabel
                          className={cn(
                            isChecked(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Owner Email
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            <Input
                              id="ownerEmail"
                              placeholder="Please enter Owner Email"
                              {...field}
                              readOnly
                            />
                            {status === "REJECTED" && (
                              <Checkbox
                                onCheckedChange={() =>
                                  handleRejectedField(field.name)
                                }
                                checked={isChecked(field.name)}
                              />
                            )}
                          </div>
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
                        <FormLabel
                          className={cn(
                            isChecked(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Land Location
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            <Input
                              id="landLocation"
                              placeholder="Please enter land location"
                              {...field}
                              readOnly
                            />
                            {status === "REJECTED" && (
                              <Checkbox
                                onCheckedChange={() =>
                                  handleRejectedField(field.name)
                                }
                                checked={isChecked(field.name)}
                              />
                            )}
                          </div>
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
                        <FormLabel
                          className={cn(
                            isChecked(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Land Area
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            <Input
                              id="landArea"
                              placeholder="Please enter Land Area"
                              {...field}
                              readOnly
                            />
                            {status === "REJECTED" && (
                              <Checkbox
                                onCheckedChange={() =>
                                  handleRejectedField(field.name)
                                }
                                checked={isChecked(field.name)}
                              />
                            )}
                          </div>
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
                        <FormLabel
                          className={cn(
                            isChecked(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Land Type
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            {" "}
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
                            {status === "REJECTED" && (
                              <Checkbox
                                onCheckedChange={() =>
                                  handleRejectedField(field.name)
                                }
                                checked={isChecked(field.name)}
                              />
                            )}
                          </div>
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
                        <FormLabel
                          className={cn(
                            isChecked(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Land Usage
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            {" "}
                            <Input
                              id="usage"
                              placeholder="Please enter Land Usage"
                              {...field}
                              readOnly
                            />
                            {status === "REJECTED" && (
                              <Checkbox
                                onCheckedChange={() =>
                                  handleRejectedField(field.name)
                                }
                                checked={isChecked(field.name)}
                              />
                            )}
                          </div>
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
                        <FormLabel
                          className={cn(
                            isChecked(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Land Ownership Status
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            <Input
                              id="ownershipStatus"
                              placeholder="Please enter Land Ownership Status"
                              {...field}
                              readOnly
                            />
                            {status === "REJECTED" && (
                              <Checkbox
                                onCheckedChange={() =>
                                  handleRejectedField(field.name)
                                }
                                checked={isChecked(field.name)}
                              />
                            )}
                          </div>
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
                      <FormLabel
                        className={cn(
                          isChecked(field.name) &&
                            "bg-red-500 p-2 px-8 text-white font-bold"
                        )}>
                        Land Description
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <Textarea
                            id="landDescription"
                            placeholder="Please enter Land Description"
                            {...field}
                          />
                          {status === "REJECTED" && (
                            <Checkbox
                              onCheckedChange={() =>
                                handleRejectedField(field.name)
                              }
                              checked={isChecked(field.name)}
                            />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="p-4 space-y-4 bg-white ">
              <div className="mb-4">
                <FormLabel>Status</FormLabel>

                <RadioGroup
                  defaultValue="APPROVED"
                  className="flex gap-4 mt-2"
                  value={status}
                  onValueChange={handleChangeStatus}
                  disabled={!getProposal.data?.proposal?.editEnable}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="APPROVED" id="APPROVED" />
                    <Label>APPROVED</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="REJECTED" id="REJECTED" />
                    <Label>REJECTED</Label>
                  </div>
                </RadioGroup>

                {status === "REJECTED" && (
                  <h2 className="mt-2 text-muted-foreground">
                    Please select the fields which have mistakes
                  </h2>
                )}
              </div>

              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel
                      className={cn(
                        isChecked(field.name) &&
                          "bg-red-500 p-2 px-8 text-white font-bold"
                      )}>
                      Remarks
                    </FormLabel>
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
              className="w-full"
              disabled={
                !(
                  form.formState.isDirty ||
                  status !== getProposal?.data?.proposal?.status ||
                  !arraysAreEqual(
                    rejectedFields || [],
                    getProposal?.data?.proposal.highlightedFields || []
                  )
                )
              }>
              Update Proposal
            </LoadingButton>
          </form>
        </Form>
      </section>
    </div>
  );
}
