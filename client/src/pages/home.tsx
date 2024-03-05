import DataTable from "@/components/ui/data-table";
import { api } from "@/lib/api";
import { proposalTableColumns } from "@/lib/tableColumns";
import { LoaderIcon } from "lucide-react";
import { useMemo, useState } from "react";

export default function Home() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);

  useMemo(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await api.get("/proposal");

        if (!res.data.success) throw Error("Error while getting proposals");

        setProposals(res.data?.proposals);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="h-full">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <LoaderIcon className="animate-spin" />
        </div>
      ) : proposals.length ? (
        <div className="mx-4">
          <DataTable
            data={proposals}
            columns={proposalTableColumns}
            columnsShow={false}
            showAdd
          />
        </div>
      ) : (
        <p>Error While Rendering Proposals</p>
      )}
    </div>
  );
}
