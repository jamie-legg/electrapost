'use client'

import { QueryEditor } from "./QueryEditor";
import { QueryInfo } from "./QueryInfo";
import { QueryResults } from "./QueryResults";

export const SessionContent = () => {
  return (
    <div className="bg-stone-900 w-full pr-1 flex flex-col relative">
      <QueryResults />
      <QueryInfo />
      <QueryEditor />
    </div>
  );
};
