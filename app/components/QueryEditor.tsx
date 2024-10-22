"use client";

import { useSession } from "@/hooks/use-session";
import { ArrowRight } from "lucide-react";
import { KeyboardEvent, useState } from "react";

export const QueryEditor = () => {
  const { queryText, setQueryText, executeQuery, setIsDDLViewOpen, isDDLViewOpen } = useSession();

  const handleQueryChange = (e) => {
    setQueryText(e.target.value);
  };

  const handleExecute = () => {
    executeQuery();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleExecute();
    }
  };

  return (
    <div className="flex h-1/12 items-center justify-center">
      <div className="border-stone-500 rounded-lg border bg-stone-950 w-full h-full p-2">
        <textarea
          value={queryText}
          onChange={handleQueryChange}
          onKeyDown={handleKeyDown}
          className="w-full h-full bg-stone-950 text-white p-2 resize-none"
          placeholder="Write your query here..."
          style={{ resize: 'none' }}
        />
        {/* view ddl button */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button
          onClick={handleExecute}
          className="px-4 py-2 bg-stone-500 hover:stone-600 transition-all text-white rounded"
        >
          {/* run query (cmd + enter) */}
          Run [⌘ ↵]
          </button>
        </div>
      </div>
    </div>
  );
};
