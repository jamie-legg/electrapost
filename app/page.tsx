'use client'

// page.tsx
import { SessionContent } from "./components/SessionContent";
import { SessionTabs } from "./components/SessionTabs";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { StatusBar } from "./components/StatusBar/StatusBar";
import { SessionProvider, useSession } from "./hooks/use-session";

export default function Page() {
  return (
    <SessionProvider>
      <div className="flex flex-col bg-stone-900 h-screen w-screen">
        <AppContent />
      </div>
    </SessionProvider>
  );
}

function AppContent() {
  const {
    sessions,
    activeSessionId,
    activeClientId,
    createNewSession,
    changeClient,
    setActiveSessionId,
  } = useSession();

  return (
    <>
      <StatusBar
        onNewSession={createNewSession}
        activeClientId={activeClientId}
        onChangeClient={changeClient}
      />
      <SessionTabs />
      <div className="flex max-h-[calc(100vh-90px)] font-mono">
        <Sidebar activeClientId={activeClientId} />
        <SessionContent />
      </div>
    </>
  );
}
