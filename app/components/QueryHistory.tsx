'use client'

import { useState } from "react";
import { History, ChevronUp } from "lucide-react";
import { Button } from "./Button";

interface QueryHistoryProps {
  history: string[];
}

export const QueryHistory: React.FC<QueryHistoryProps> = ({ history }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="relative flex p-0.5">
      <Button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        <History size={14} className="mr-2" />
        Query History
        <ChevronUp size={14} className="ml-2" />
      </Button>
      {isDropdownOpen && (
        <div className="absolute bottom-full left-0 mb-1 w-64 bg-stone-800 shadow-lg rounded-md overflow-hidden z-50">
          {history.map((query, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-stone-900 cursor-pointer text-sm truncate"
              title={query}
            >
              {query}
            </div>
          ))}
          {history.length === 0 && (
            <div className="px-4 py-2 text-sm text-gray-500">
              No query history
            </div>
          )}
        </div>
      )}
    </div>
  );
};
