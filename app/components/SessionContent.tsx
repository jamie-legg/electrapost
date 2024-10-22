'use client'

import { QueryEditor } from "./QueryEditor";
import { QueryResults } from "./QueryResults";

export const SessionContent = () => {
  return (
    <div className="bg-stone-900 w-full py-1 pr-1 flex flex-col relative">
      <QueryResults />
      <QueryEditor />
    </div>
  );
};
