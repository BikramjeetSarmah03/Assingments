/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { isAxiosError } from "axios";
import { ArrowUpDownIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { api } from "./api";
import LoadingButton from "@/components/ui/loading-button";

export const proposalTableColumns: ColumnDef<any, any>[] = [
  {
    header: "ID",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "objective",
    header: "Objective",
  },
  {
    accessorKey: "duration",
    header: "Duration",
  },
  {
    accessorKey: "budget",
    header: "Budget",
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Status
          <ArrowUpDownIcon className="w-4 h-4 ml-2" />
        </Button>
      );
    },
  },
  {
    accessorKey: "id",
    header: "View",
    cell: ({ getValue }) => {
      const navigate = useNavigate();

      const handleView = () => {
        const id = getValue();
        navigate(`/proposal/${id}`);
      };

      return (
        <Button
          className="bg-green-500 hover:bg-green-600"
          onClick={handleView}>
          View
        </Button>
      );
    },
  },
  {
    accessorKey: "editEnable",
    header: "Edit",
    cell: ({ getValue, row }) => {
      const val = getValue();
      const navigate = useNavigate();

      const handleEdit = () => {
        const id = row.original.id;
        navigate(`/proposal/${id}`);
      };

      return val ? (
        <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleEdit}>
          <PencilIcon />
        </Button>
      ) : (
        <span className="text-muted-foreground">Not Allowed</span>
      );
    },
  },
  {
    accessorKey: "deleteEnable",
    header: "Delete",
    cell: ({ getValue, row }) => {
      const val = getValue();
      const [loading, setLoading] = useState(false);
      const queryClient = useQueryClient();

      const handleDelete = async () => {
        try {
          setLoading(true);
          const res = await api.delete(`/proposal/${row.original.id}`);

          if (!res.data.success)
            throw new Error("Error while deleting proposal");

          queryClient.invalidateQueries({
            queryKey: ["proposals"],
          });
          toast.success("Proposal Deleted successfully");
        } catch (error) {
          if (isAxiosError(error)) {
            toast.error(error.response?.data.message);
          } else {
            toast.error("Error while deleting proposal");
          }
        } finally {
          setLoading(false);
        }
      };

      return val ? (
        <LoadingButton
          loading={loading}
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600">
          <TrashIcon />
        </LoadingButton>
      ) : (
        <span className="text-muted-foreground">Not Allowed</span>
      );
    },
  },
];
