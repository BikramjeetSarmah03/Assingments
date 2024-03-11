import FullScreenLoader from "@/components/layout/full-screen-loader";
import DataTable from "@/components/ui/data-table";
import { proposalTableColumns } from "@/lib/tableColumns";
import { getDashboardData } from "@/services/proposal";
import { useQuery } from "@tanstack/react-query";
import { ShieldAlertIcon } from "lucide-react";

export default function Home() {
  const { isLoading, error, data } = useQuery({
    queryKey: ["dashboard"],
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
        <div className="p-4 m-4 space-y-2 text-white bg-orange-400 border shadow">
          <h1 className="text-lg font-semibold">Total Proposals</h1>
          <p className="text-2xl font-black">{data.totalProposals || 0}</p>
        </div>
        <div className="p-4 m-4 space-y-2 text-gray-900 bg-yellow-400 border shadow">
          <h1 className="text-lg font-semibold">Pending Proposals</h1>
          <p className="text-2xl font-black">{data.pendingProposals || 0}</p>
        </div>
        <div className="p-4 m-4 space-y-2 text-white bg-green-500 border shadow">
          <h1 className="text-lg font-semibold">Approved Proposals</h1>
          <p className="text-2xl font-black">{data.approvedProposals || 0}</p>
        </div>
        <div className="p-4 m-4 space-y-2 text-white bg-red-500 border shadow">
          <h1 className="text-lg font-semibold">Rejected Proposals</h1>
          <p className="text-2xl font-black">{data.rejectedProposals || 0}</p>
        </div>
        <div className="p-4 m-4 space-y-2 text-white bg-pink-500 border shadow">
          <h1 className="text-lg font-semibold">Meetings</h1>
          <p className="text-2xl font-black">{data.meetings?.length || 0}</p>
        </div>
      </div>

      <section className="mx-4 space-y-4">
        <div className="p-2 border">
          <h1 className="p-2 text-2xl text-white bg-gradient-to-r from-yellow-500 to-yellow-400">
            Proposals
          </h1>
          <DataTable
            data={data.proposals}
            columns={proposalTableColumns}
            columnsShow={false}
          />
        </div>
      </section>
    </div>
  );
}
