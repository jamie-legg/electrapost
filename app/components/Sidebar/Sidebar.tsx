'use client' 
import { useState, useEffect, useMemo } from "react";
import { Database, Search } from "lucide-react";
import { useSession } from "@/hooks/use-session";
import useDebounce from "@/hooks/use-debounce";

export const Sidebar = ({ activeClientId }) => {
    const [tables, setTables] = useState([]);
    const { selectedTable, setSelectedTable } = useSession();
    const [hoveredTable, setHoveredTable] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    useEffect(() => {
      const fetchTables = async () => {
        const fetchedTables = await window.db.getTableNames(activeClientId).then(tables => tables.sort());
        console.log('fetchedTables', fetchedTables);
        
        setTables(fetchedTables);
      };
      fetchTables();
    }, [activeClientId]);

    const filteredTables = useMemo(() => {
      return tables
        .filter(table => table.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
        .sort((a, b) => {
          const aEndsWithTerm = a.toLowerCase().endsWith(debouncedSearchTerm.toLowerCase());
          const bEndsWithTerm = b.toLowerCase().endsWith(debouncedSearchTerm.toLowerCase());
          if (aEndsWithTerm && !bEndsWithTerm) return -1;
          if (!aEndsWithTerm && bEndsWithTerm) return 1;
          return 0;
        });
    }, [tables, debouncedSearchTerm]);

  return (
    <div className="flex-col bg-gradient-to-b from-black text-xs to-stone-900 text-stone-400 m-1 border border-stone-500 rounded-lg w-72 items-center justify-center overflow-y-auto pl-2 pr-8">
      <SearchTable searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {filteredTables.map((table) => (
        <div 
          key={table} 
          className={`flex w-56 items-center cursor-pointer hover:bg-stone-800 border-stone-300 p-2 rounded ${selectedTable === table ? 'font-bold border text-stone-300' : ''}`}
          onClick={() => setSelectedTable(table)}
          onMouseEnter={() => setHoveredTable(table)}
          onMouseLeave={() => setHoveredTable(null)}
        >
          {selectedTable === table && <Database size={16} />}
          <span 
            className={`ml-2 whitespace-nowrap ${(selectedTable === table || hoveredTable === table) ? 'overflow-x-scroll' : 'overflow-hidden text-ellipsis'}`}
          >
            {table}
          </span>
        </div>
      ))}
    </div>
  );
}

const SearchTable = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative w-56 mt-2.5 ml-0.5">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search tables..."
        className="w-full pl-8 pr-2 py-1 bg-stone-800 text-stone-300 rounded border border-stone-700 focus:outline-none focus:border-stone-500"
      />
      <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-stone-500" />
    </div>
  );
}
