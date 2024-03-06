import DataTable from "@/components/ui/data-table";
import { proposalTableColumns } from "@/lib/tableColumns";
import { getProposals } from "@/services/proposal";
import { useQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";

export default function Home() {
  const { isPending, error, data } = useQuery({
    queryKey: ["proposals"],
    queryFn: getProposals,
  });

  return (
    <div className="h-full">
      {isPending ? (
        <div className="flex items-center justify-center h-full">
          <LoaderIcon className="animate-spin" />
        </div>
      ) : data.success ? (
        <div className="mx-4">
          <DataTable
            data={data.proposals}
            columns={proposalTableColumns}
            columnsShow={false}
            showAdd
          />
        </div>
      ) : (
        <p>Error While Rendering Proposals: {error?.message}</p>
      )}
    </div>
  );
}
