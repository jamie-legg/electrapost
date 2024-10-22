// hooks/useSession.ts
import React, { useState, createContext, useContext, useEffect } from 'react';

// Define the shape of your session context
interface SessionContextProps {
  sessions: { id: number; name: string }[];
  activeSessionId: number;
  activeClientId: number | null;
  selectedTable: string | null;
  queryText: string;
  queryResults: {
    rows: any[],
    columns: string[]
  };
  tableDDL: string | null;
  isDDLViewOpen: boolean;
  createNewSession: () => void;
  changeClient: (clientId: number) => void;
  setActiveSessionId: (id: number) => void;
  setSelectedTable: (table: string) => void;
  setQueryText: (text: string) => void;
  executeQuery: () => void;
  setIsDDLViewOpen: (open: boolean) => void;
}

// Create the context
const SessionContext = createContext<SessionContextProps | null>(null);

// Create the provider component
export function SessionProvider({ children }) {
  const [sessions, setSessions] = useState([{ id: 1, name: 'Default Session' }]);
  const [activeSessionId, setActiveSessionId] = useState(1);
  const [activeClientId, setActiveClientId] = useState<number | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [queryText, setQueryText] = useState('');
  const [queryResults, setQueryResults] = useState<{rows: any[], columns: string[]}>({rows: [], columns: []});
  const [tableDDL, setTableDDL] = useState<string | null>(null);
  const [isDDLViewOpen, setIsDDLViewOpen] = useState(false);

  const createNewSession = () => {
    const newSession = {
      id: sessions.length + 1,
      name: `Session ${sessions.length + 1}`,
    };
    setSessions([...sessions, newSession]);
    setActiveSessionId(newSession.id);
    setSelectedTable(null);
    setQueryText('');
    setQueryResults({rows: [], columns: []});
  };

  useEffect(() => {
    // set the query text to select 1000 rows
    if (selectedTable) {
      const query = `SELECT * FROM ${selectedTable} LIMIT 1000`;
      setQueryText(query);
      executeQuery(query);
      getTableDDL();
    }
  }, [selectedTable]);

  const changeClient = (clientId: number) => {
    setActiveClientId(clientId);
    createNewSession();
  };

  const getTableDDL = async () => {
    if (!selectedTable) return;
    const ddl = await window.db.getTableDDL(activeClientId, selectedTable);
    setTableDDL(ddl);
  }

  const executeQuery = async (queryOverride?: string) => {
    console.log('executeQuery', queryText, activeClientId);
    if (!activeClientId) return;
    const {rows, columns} = await window.db.executeQuery(activeClientId, queryOverride || queryText);
    setQueryResults({rows, columns});
  };

  return (
    <SessionContext.Provider
      value={{
        sessions,
        activeSessionId,
        activeClientId,
        selectedTable,
        queryText,
        queryResults,
        createNewSession,
        changeClient,
        setActiveSessionId,
        setSelectedTable,
        setQueryText,
        executeQuery,
        tableDDL,
        isDDLViewOpen,
        setIsDDLViewOpen
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

// Create a custom hook to use the session context
export function useSession() {
  const context = useContext(SessionContext);
  if (context === null) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}