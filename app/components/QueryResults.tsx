'use client'

import { useSession } from "@/hooks/use-session";
import { columnGenerator, DataTable } from "./DataTable";
import {format} from 'sql-formatter';
import { DDLView } from "./DDLView";

export const QueryResults = () => {
  const { queryResults, isDDLViewOpen } = useSession();

  const { rows, columns } = queryResults;



  

  return (    
      <div className="flex items-center justify-center w-full h-[calc(100vh-13rem)]">
{isDDLViewOpen ? <DDLView /> : <DataTable data={rows} columns={columnGenerator(columns)} />}
    </div>
  );
};
