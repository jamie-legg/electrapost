// global.d.ts
export interface DatabaseAPI {
  newClient: (config: DatabaseClientConfig, test = false) => Promise<{success: boolean, message: string, error: string}>;
  getConnections: () => Promise<DatabaseClientConfig[]>
  getSessions: () => Promise<Session[]>
  getTableNames: (clientId: number) => Promise<string[]>
  previewTable: (clientId: number, tableName: string) => Promise<any[]>
  executeQuery: (clientId: number, query: string) => Promise<{rows: any[], columns: string[], info: QueryInfo, history: string[]}>
  getTableDDL: (clientId: number, tableName: string) => Promise<string>
  setActiveSession: (sessionId: number) => Promise<void>
}

declare global {
  interface Window {
    db: DatabaseAPI;
  }
}

export interface QueryInfo {
  duration: number;
  rowCount: number;
  status: string;
  complexity: number;
}

export interface DatabaseClientConfig {
  id?: number;
  nickname: string;
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  connectSSH: boolean;
  startupQuery: boolean;
  preConnectScript: boolean;
  serverCA: Buffer | null;
  clientCert: Buffer | null;
  clientKey: Buffer | null;
}

export interface Session {
  id: number;
  name: string;
  clientId: number;
  active: boolean;
  query: string;
  queryResults: {rows: any[], columns: string[], info: QueryInfo, history: string[]};
  tableDDL: string | null;
  isDDLViewOpen: boolean;
}