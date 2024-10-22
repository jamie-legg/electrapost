'use client' 
import { useState, useEffect } from "react";
import { Database } from "lucide-react";
import { useSession } from "@/hooks/use-session";

export const Sidebar = ({ activeClientId }) => {
    const [tables, setTables] = useState([]);
    const { selectedTable, setSelectedTable } = useSession();
    const [hoveredTable, setHoveredTable] = useState(null);

    useEffect(() => {
      const fetchTables = async () => {
        const fetchedTables = await window.db.getTableNames(activeClientId).then(tables => tables.sort());
        console.log('fetchedTables', fetchedTables);
        
        setTables(fetchedTables);
      };
      fetchTables();
    }, [activeClientId]);

  return (
    <div className="flex-col bg-gradient-to-b from-black text-xs to-stone-900 text-stone-400 m-1 border border-stone-500 rounded-lg w-72 items-center justify-center overflow-y-auto pl-2 pr-8">
      {tables.map((table) => (
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