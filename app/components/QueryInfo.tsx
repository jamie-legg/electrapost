import { useSession } from "@/hooks/use-session";
import { QueryHistory } from "./QueryHistory";

export const QueryInfo = () => {
  const { sessions, activeSessionId } = useSession();
  const activeSession = sessions.find(session => session.id === activeSessionId);
  const { info, history } = activeSession?.queryResults || { info: { duration: 0, rowCount: 0, complexity: 'N/A' }, history: [] };

  return (
    <div className="flex -mt-2 pt-1 h-8 z-30 w-full items-center justify-between bg-gradient-to-br from-stone-900 to-stone-800 px-4 text-sm text-white">
      <div className="flex space-x-4">
        <span>Time: {info.duration ?? 0}ms</span>
        <span>Rows: {info.rowCount ?? 0}</span>
        <span>Complexity: {info.complexity ?? 'N/A'}</span>
      </div>
      <div className="flex items-center space-x-2">
        <QueryHistory history={history} />
      </div>
    </div>
  );
};
