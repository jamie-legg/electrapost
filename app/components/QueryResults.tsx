"use client";

import { useSession } from "@/hooks/use-session";
import { columnGenerator, DataTable } from "./DataTable";
import { format } from "sql-formatter";
import { DDLView } from "./DDLView";

export const QueryResults = () => {
  const { sessions, activeSessionId, isDDLViewOpen } = useSession();
  const { rows, columns } =
    sessions.find((session) => session.active)?.queryResults ||
    {};

  return (
    <div className="flex w-full h-full">
      {isDDLViewOpen ? (
        <DDLView />
      ) : (
        rows && columns ? (
          <DataTable data={rows} columns={columnGenerator(columns)} />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <p className="text-stone-400 mb-10">No results to display</p>
          </div>
        )
      )}
    </div>
  );
};
