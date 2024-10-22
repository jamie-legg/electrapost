// global.d.ts
export interface DatabaseAPI {
  newClient: (config: DatabaseClientConfig, test = false) => Promise<{success: boolean, message: string, error: string}>;
  getConnections: () => Promise<DatabaseClientConfig[]>
  getTableNames: (clientId: number) => Promise<string[]>
  previewTable: (clientId: number, tableName: string) => Promise<any[]>
  executeQuery: (clientId: number, query: string) => Promise<{rows: any[], columns: string[]}>
  getTableDDL: (clientId: number, tableName: string) => Promise<string>
}

declare global {
  interface Window {
    db: DatabaseAPI;
  }
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
