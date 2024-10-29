// hooks/useSession.ts
import { QueryInfo, Session } from 'global';
import React, { useState, createContext, useContext, useEffect } from 'react';

// Define the shape of your session context
interface SessionContextProps {
  sessions: Session[];
  activeSessionId: number;
  activeClientId: number | null;
  selectedTable: string | null;
  tableDDL: string | null;
  isDDLViewOpen: boolean;
  isMapViewOpen: boolean;
  setSessions: (sessions: Session[]) => void;
  createNewSession: () => void;
  changeClient: (clientId: number) => void;
  setActiveSessionId: (id: number) => void;
  setSelectedTable: (table: string) => void;
  setQueryText: (text: string) => void;
  executeQuery: () => void;
  setIsDDLViewOpen: (open: boolean) => void;
  setIsMapViewOpen: (open: boolean) => void;
}

const defaultSession: Session = {
  id: 1,
  name: 'Disconnected',
  clientId: null,
  active: false,
  query: '',
  tableDDL: null,
  isDDLViewOpen: false,
  queryResults: {rows: [], columns: [], info: {duration: 0, rowCount: 0, status: '', complexity: 0}, history: []}
};

// Create the context
const SessionContext = createContext<SessionContextProps | null>(null);

// Create the provider component
export function SessionProvider({ children }) {
  const [sessions, setSessions] = useState([defaultSession]);
  const [activeSessionId, setActiveSessionId] = useState<number>(1);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableDDL, setTableDDL] = useState<string | null>(null);
  const [isDDLViewOpen, setIsDDLViewOpen] = useState(false);
  const [isMapViewOpen, setIsMapViewOpen] = useState(false);

  const createNewSession = () => {
    setSessions([...sessions, defaultSession]);
    setActiveSessionId(defaultSession.id);
    setSelectedTable(null);
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
    const session = sessions.find(session => session.active);
    if (!session) return;
    setSessions(prevSessions => 
      prevSessions.map(session => 
        session.id === activeSessionId ? {...session, clientId} : session
      )
    );
  };

  const getActiveClientId = () => {
    console.log('sessions', sessions);
    
    const session = sessions.find(session => session.active);
    if (!session) return null;
    return session.clientId;
  };



  const getTableDDL = async () => {
    if (!selectedTable) return;
    const ddl = await window.db.getTableDDL(getActiveClientId(), selectedTable);
    setTableDDL(ddl);
  }

  const setQueryText = (text: string) => {
    console.log('setQueryText', text);
    const currentSession = sessions.find(session => session.id === activeSessionId);
    if (!currentSession) {
      console.error('currentSession not found');
      return;
    }
    const updatedSession = {...currentSession, query: text};
    console.log('updatedSession', updatedSession);
    
    setSessions(prevSessions => 
      prevSessions.map(session => 
        session.id === activeSessionId ? updatedSession : session
      )
    );
  };

  const executeQuery = async (queryOverride?: string) => {
    const clientId = getActiveClientId();
    if (!clientId) return;
    const activeSession = sessions.find(session => session.id === activeSessionId);
    if (!activeSession) return;
    const queryToExecute = queryOverride || activeSession.query;
    const results = await window.db.executeQuery(clientId, queryToExecute);
    setSessions(prevSessions => 
      prevSessions.map(session => 
        session.id === activeSessionId ? {...session, queryResults: results} : session
      )
    );
  };

  const activeSession = sessions.find(session => session.id === activeSessionId) || sessions[0];

  return (
    <SessionContext.Provider
      value={{
        sessions,
        setSessions,
        activeSessionId,
        activeClientId: getActiveClientId(),
        selectedTable,
        createNewSession,
        changeClient,
        setActiveSessionId,
        setSelectedTable,
        setQueryText,
        executeQuery,
        tableDDL,
        isDDLViewOpen,
        setIsDDLViewOpen,
        isMapViewOpen,
        setIsMapViewOpen,
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
