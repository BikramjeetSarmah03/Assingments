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
import { ChevronLeftIcon, EyeIcon } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import { cn } from "@/lib/utils";
import { FileInput } from "@/components/ui/file-input";
import { Label } from "@/components/ui/label";

export default function Proposal() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const params = useParams();

  const [rejectedFields, setRejectedFields] = useState<string[]>([]);
  const [images, setImages] = useState({
    photo: "",
    addressProof: "",
    incomeProof: "",
  });

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
        bankBranch: resData.proposal.bankDetails.bankBranch || "",
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
      if (getProposal.data && getProposal.data.proposal.editEnable) {
        const res = await api.post(`/proposal/${params.id}`, {
          ...values,
          rejectedFields,
        });
        if (!res.data.success)
          throw new Error("Error while submitting proposal");
      } else {
        if (images.photo === "") return toast.error("Please select an photo");
        if (images.addressProof === "")
          return toast.error("Please select an address proof");
        if (images.incomeProof === "")
          return toast.error("Please select an income proof");

        const formData = new FormData();

        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("objective", values.objective);
        formData.append("duration", values.duration);
        formData.append("budget", values.budget);

        formData.append("state", values.state);
        formData.append("district", values.district);
        formData.append("pincode", values.pincode);
        formData.append("postOffice", values.postOffice);
        formData.append("policeStation", values.policeStation);
        formData.append("address", values.address);

        formData.append("bankName", values.bankName);
        formData.append("bankBranch", values.bankBranch);
        formData.append("ifsc", values.ifsc);
        formData.append("accountNumber", values.accountNumber);

        formData.append("incomeAmount", values.incomeAmount);
        formData.append("incomeSource", values.incomeSource);

        formData.append("ownerName", values.ownerName);
        formData.append("ownerNumber", values.ownerNumber);
        formData.append("ownerEmail", values.ownerEmail);
        formData.append("landLocation", values.landLocation);
        formData.append("landArea", values.landArea);
        formData.append("landType", values.landType);
        formData.append("usage", values.usage);
        formData.append("ownershipStatus", values.ownershipStatus);
        formData.append("landDescription", values.landDescription);

        formData.append("file", images.photo);
        formData.append("file", images.addressProof);
        formData.append("file", images.incomeProof);

        formData.append("remarks", values.remarks || "");

        const res = await api.post("/proposal", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (!res.data.success)
          throw new Error("Error while submitting proposal");
      }

      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      toast.success("Proposal Submitted Successfully");
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Error while submitting proposal");
      }
      console.log(error);
    }
  }

  const isHighlighted = (name: string) => {
    return rejectedFields.includes(name);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const allowedTypes = ["image/jpeg", "image/png"];
    const MAX_FILE_SIZE = 5120; // 5MB

    if (!event.target.files) return;
    const file = event.target.files[0];
    const name = event.target.name;

    if (!allowedTypes.includes(file.type)) {
      return toast.error("Only JPEF, PNG images are allowed");
    }

    const fileSizeKiloBytes = file.size / 1024;
    if (fileSizeKiloBytes > MAX_FILE_SIZE) {
      return toast.error("File size is greater then 5MB");
    }

    setImages({
      ...images,
      [name]: file,
    });
  };

  const editable = params.id
    ? getProposal.data && getProposal.data.proposal.editEnable
    : true;

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
              <div className="p-4 space-y-4 bg-white border">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={cn(
                          isHighlighted(field.name) &&
                            "bg-red-500 p-2 px-8 text-white font-bold"
                        )}>
                        Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Proposal Title"
                          readOnly={!editable}
                          {...field}
                        />
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
                          isHighlighted(field.name) &&
                            "bg-red-500 p-2 px-8 text-white font-bold"
                        )}>
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          onChange={field.onChange}
                          value={field.value}
                          placeholder="Please enter description"
                          readOnly={!editable}
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
                        <FormLabel
                          className={cn(
                            isHighlighted(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Objective
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Proposal Objective"
                            readOnly={!editable}
                            {...field}
                          />
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
                            isHighlighted(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Duration
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Please enter duration"
                            readOnly={!editable}
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
                        <FormLabel
                          className={cn(
                            isHighlighted(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Budget
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Please enter budget"
                            readOnly={!editable}
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
                            isHighlighted(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          State
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="state"
                            placeholder="Please enter state"
                            readOnly={!editable}
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
                        <FormLabel
                          className={cn(
                            isHighlighted(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          District
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="district"
                            placeholder="Please enter district"
                            readOnly={!editable}
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
                        <FormLabel
                          className={cn(
                            isHighlighted(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Pincode
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="pincode"
                            placeholder="Please enter pincode"
                            readOnly={!editable}
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
                        <FormLabel
                          className={cn(
                            isHighlighted(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Post Office
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="postOffice"
                            placeholder="Please enter post office"
                            readOnly={!editable}
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
                        <FormLabel
                          className={cn(
                            isHighlighted(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Police Station
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="policeStation"
                            placeholder="Please enter police station"
                            readOnly={!editable}
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
                      <FormLabel
                        className={cn(
                          isHighlighted(field.name) &&
                            "bg-red-500 p-2 px-8 text-white font-bold"
                        )}>
                        Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="address"
                          placeholder="Please enter address"
                          readOnly={!editable}
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
              <div className="p-4 space-y-4 bg-white border">
                <div className="flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel
                          className={cn(
                            isHighlighted(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Bank Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="bankName"
                            placeholder="Please enter Bank Name"
                            {...field}
                            readOnly={!editable}
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
                        <FormLabel
                          className={cn(
                            isHighlighted(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Bank Branch
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="bankBranch"
                            placeholder="Please enter Bank Branch"
                            {...field}
                            readOnly={!editable}
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
                        <FormLabel
                          className={cn(
                            isHighlighted(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Bank IFSC
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="ifsc"
                            placeholder="Please enter Bank IFSC"
                            {...field}
                            readOnly={!editable}
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
                        <FormLabel
                          className={cn(
                            isHighlighted(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Account Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="accountNumber"
                            placeholder="Please enter Account Number"
                            {...field}
                            readOnly={!editable}
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
              <div className="p-4 space-y-4 bg-white border">
                <div className="flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name="incomeAmount"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel
                          className={cn(
                            isHighlighted(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Income Amount
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="incomeAmount"
                            placeholder="Please enter Income Amount"
                            {...field}
                            readOnly={!editable}
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
                        <FormLabel
                          className={cn(
                            isHighlighted(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Income Source
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="incomeSource"
                            placeholder="Please enter Income Source"
                            {...field}
                            readOnly={!editable}
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
              <div className="p-4 space-y-4 bg-white border">
                <div className="flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name="ownerName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel
                          className={cn(
                            isHighlighted(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Owner Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="ownerName"
                            placeholder="Please enter owner name"
                            {...field}
                            readOnly={!editable}
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
                        <FormLabel
                          className={cn(
                            isHighlighted(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Owner Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="ownerNumber"
                            placeholder="Please enter Owner Number"
                            {...field}
                            readOnly={!editable}
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
                        <FormLabel
                          className={cn(
                            isHighlighted(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Owner Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="ownerEmail"
                            placeholder="Please enter Owner Email"
                            {...field}
                            readOnly={!editable}
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
                        <FormLabel
                          className={cn(
                            isHighlighted(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Land Location
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="landLocation"
                            placeholder="Please enter land location"
                            {...field}
                            readOnly={!editable}
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
                        <FormLabel
                          className={cn(
                            isHighlighted(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Land Area
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="landArea"
                            placeholder="Please enter Land Area"
                            {...field}
                            readOnly={!editable}
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
                        <FormLabel
                          className={cn(
                            isHighlighted(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Land Type
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={!editable}>
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
                        <FormLabel
                          className={cn(
                            isHighlighted(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Land Usage
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="usage"
                            placeholder="Please enter Land Usage"
                            {...field}
                            readOnly={!editable}
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
                        <FormLabel
                          className={cn(
                            isHighlighted(field.name) &&
                              "bg-red-500 p-2 px-8 text-white font-bold"
                          )}>
                          Land Ownership Status
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="ownershipStatus"
                            placeholder="Please enter Land Ownership Status"
                            {...field}
                            readOnly={!editable}
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
                      <FormLabel
                        className={cn(
                          isHighlighted(field.name) &&
                            "bg-red-500 p-2 px-8 text-white font-bold"
                        )}>
                        Land Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          id="landDescription"
                          placeholder="Please enter Land Description"
                          {...field}
                          readOnly={!editable}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div>
              <h1 className="font-serif text-xl">Documents</h1>
              <div className="p-4 space-y-4 bg-white border">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col w-full space-y-2">
                    <Label
                      id="photo"
                      className={cn(
                        isHighlighted("photo") &&
                          "bg-red-500 p-2 px-8 text-white font-bold"
                      )}>
                      Photo
                    </Label>
                    {editable && !params.id ? (
                      <FileInput
                        id="photo"
                        name="photo"
                        onChange={handleFileChange}
                      />
                    ) : (
                      <Link
                        to={
                          getProposal?.data?.proposal?.documents?.photo
                            ?.secure_url || "#"
                        }
                        target="_blank"
                        id="photo"
                        className={
                          "border flex items-center justify-center p-2 rounded-md hover:bg-gray-100 transition-all duration-300"
                        }>
                        <EyeIcon />
                      </Link>
                    )}
                  </div>
                  <div className="flex flex-col w-full space-y-2">
                    <Label
                      id="addressProof"
                      className={cn(
                        isHighlighted("addressProof") &&
                          "bg-red-500 p-2 px-8 text-white font-bold"
                      )}>
                      Address Proof
                    </Label>
                    {editable && !params.id ? (
                      <FileInput
                        id="addressProof"
                        name="addressProof"
                        onChange={handleFileChange}
                      />
                    ) : (
                      <Link
                        to={
                          getProposal?.data?.proposal?.documents?.addressProof
                            ?.secure_url || "#"
                        }
                        id="addressProof"
                        target="_blank"
                        className={
                          "border flex items-center justify-center p-2 rounded-md hover:bg-gray-100 transition-all duration-300"
                        }>
                        <EyeIcon />
                      </Link>
                    )}
                  </div>
                  <div className="flex flex-col w-full space-y-2">
                    <Label
                      id="incomeProof"
                      className={cn(
                        isHighlighted("incomeProof") &&
                          "bg-red-500 p-2 px-8 text-white font-bold"
                      )}>
                      Income Proof
                    </Label>
                    {editable && !params.id ? (
                      <FileInput
                        id="incomeProof"
                        name="incomeProof"
                        onChange={handleFileChange}
                      />
                    ) : (
                      <Link
                        to={
                          getProposal?.data?.proposal?.documents?.incomeProof
                            ?.secure_url || "#"
                        }
                        id="incomeProof"
                        target="_blank"
                        className={
                          "border flex items-center justify-center p-2 rounded-md hover:bg-gray-100 transition-all duration-300"
                        }>
                        <EyeIcon />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white">
              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Remarks</FormLabel>
                    <FormControl>
                      <Textarea
                        id="remarks"
                        placeholder="Please enter Remarks"
                        {...field}
                        readOnly={!editable}
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
              disabled={!form.formState.isDirty}>
              Submit Proposal
            </LoadingButton>
          </form>
        </Form>
      </section>
    </div>
  );
}
