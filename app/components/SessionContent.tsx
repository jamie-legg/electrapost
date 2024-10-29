'use client'

import { QueryEditor } from "./QueryEditor";
import { QueryInfo } from "./QueryInfo";
import { QueryResults } from "./QueryResults";

export const SessionContent = () => {
  return (
    <div className="bg-stone-900 flex flex-col relative h-full">
    <div className="h-full overflow-y-auto">
      <QueryResults />
      <div className="absolute bottom-0 w-full">
      <QueryInfo />
      <QueryEditor />
      </div>
    </div>
    </div>
  );
};
