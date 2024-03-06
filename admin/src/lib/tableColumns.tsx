/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "./utils";

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
    cell: ({ getValue }) => {
      const val = getValue();

      return (
        <span
          className={cn(
            "font-semibold",
            val === "REJECTED" && "text-red-500",
            val === "APPROVED" && "text-green-600"
          )}>
          {val}
        </span>
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
];
