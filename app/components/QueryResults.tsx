'use client'

import { useSession } from "@/hooks/use-session";
import { columnGenerator, DataTable } from "./DataTable";

export const QueryResults = () => {
  const { queryResults } = useSession();

  const { rows, columns } = queryResults;



  

  return (    
      <div className="flex items-center justify-center w-full h-[calc(100vh-0rem)]">
            <DataTable data={rows} columns={columnGenerator(columns)} />
    </div>
  );
};
