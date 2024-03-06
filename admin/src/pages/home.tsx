import FullScreenLoader from "@/components/layout/full-screen-loader";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import { useModal } from "@/hooks/useModal";
import { proposalTableColumns } from "@/lib/tableColumns";
import { getDashboardData } from "@/services/proposal";
import { useQuery } from "@tanstack/react-query";
import { PlusCircleIcon, ShieldAlertIcon } from "lucide-react";

export default function Home() {
  const { onOpen } = useModal();

  const { isLoading, error, data } = useQuery({
    queryKey: ["proposals"],
    queryFn: getDashboardData,
  });

  if (error)
    return (
      <div className="flex items-center justify-center h-full">
        <div className="p-4 px-8 text-xl border shadow ">
          <div className="flex items-center gap-4">
            <ShieldAlertIcon className="font-bold text-red-500" size={30} />
            <span>Something went wrong</span>
          </div>
          <p className="mt-4 text-base text-muted-foreground">
            {error?.message}
          </p>
        </div>
      </div>
    );

  return isLoading ? (
    <FullScreenLoader />
  ) : (
    <div className="h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
        <div className="p-4 m-4 space-y-2 text-white border shadow bg-gradient-to-br from-blue-800 to-blue-500">
          <h1 className="text-lg font-semibold">Total Users</h1>
          <p className="text-2xl font-black">{data.totalUsers || 0}</p>
        </div>
        <div className="p-4 m-4 space-y-2 text-white border shadow bg-gradient-to-bl from-orange-800 to-orange-500">
          <h1 className="text-lg font-semibold">Total Proposals</h1>
          <p className="text-2xl font-black">{data.totalProposals || 0}</p>
        </div>
        <div className="p-4 m-4 space-y-2 text-white border shadow bg-gradient-to-br from-yellow-600 to-yellow-500">
          <h1 className="text-lg font-semibold">Pending Proposals</h1>
          <p className="text-2xl font-black">
            {data.pendingProposals.length || 0}
          </p>
        </div>
        <div className="p-4 m-4 space-y-2 text-white border shadow bg-gradient-to-bl from-green-800 to-green-500">
          <h1 className="text-lg font-semibold">Approved Proposals</h1>
          <p className="text-2xl font-black">
            {data.approvedProposals.length || 0}
          </p>
        </div>
        <div className="p-4 m-4 space-y-2 text-white border shadow bg-gradient-to-br from-red-800 to-red-500">
          <h1 className="text-lg font-semibold">Rejected Proposals</h1>
          <p className="text-2xl font-black">
            {data.rejectedProposals.length || 0}
          </p>
        </div>
        <div className="p-4 m-4 space-y-2 text-white border shadow bg-gradient-to-br from-pink-800 to-pink-500">
          <h1 className="text-lg font-semibold">Meetings</h1>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-black">0</p>
            <Button
              onClick={() => onOpen("meeting")}
              variant={"outline"}
              className="gap-4 text-black">
              <PlusCircleIcon />
              <span className="hidden sm:block">Create Meeting</span>
            </Button>
          </div>
        </div>
      </div>

      <section className="mx-4 space-y-4">
        <div className="p-2 border">
          <h1 className="p-2 text-2xl text-white bg-gradient-to-r from-yellow-500 to-yellow-400">
            Pending Proposals
          </h1>
          <DataTable
            data={data.pendingProposals}
            columns={proposalTableColumns}
            columnsShow={false}
          />
        </div>

        <div className="p-2 border">
          <h1 className="p-2 text-2xl text-white bg-gradient-to-r from-red-800 to-red-500">
            Rejected Proposals
          </h1>
          <DataTable
            data={data.rejectedProposals}
            columns={proposalTableColumns}
            columnsShow={false}
          />
        </div>

        <div className="p-2 border">
          <h1 className="p-2 text-2xl text-white bg-gradient-to-r from-green-800 to-green-500">
            Approved Proposals
          </h1>
          <DataTable
            data={data.approvedProposals}
            columns={proposalTableColumns}
            columnsShow={false}
          />
        </div>
      </section>
    </div>
  );
}
