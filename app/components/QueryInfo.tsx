import { useSession } from "@/hooks/use-session";
import { QueryHistory } from "./QueryHistory";

export const QueryInfo = () => {
  const { queryResults } = useSession();
  const { info } = queryResults;

  return (
    <div className="flex h-8 w-full items-center justify-between bg-stone-800 px-4 text-sm text-white">
      <div className="flex space-x-4">
        <span>Time: {queryResults.info.duration ?? 0}ms</span>
        <span>Rows: {queryResults.info.rowCount ?? 0}</span>
        <span>Complexity: {queryResults.info.complexity ?? 'N/A'}</span>
      </div>
      <div className="flex items-center space-x-2">
        <QueryHistory history={queryResults.history} />
      </div>
    </div>
  );
};
