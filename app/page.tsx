'use client'

// page.tsx
import { SessionContent } from "./components/SessionContent";
import { SessionTabs } from "./components/SessionTabs";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { StatusBar } from "./components/StatusBar/StatusBar";
import { SessionProvider, useSession } from "./hooks/use-session";
import { DisplayProvider } from "./hooks/use-display";

export default function Page() {
  return (
    <SessionProvider>
    <DisplayProvider>
      <div className="flex flex-col bg-stone-900 h-screen w-screen">
        <AppContent />
      </div>
    </DisplayProvider>
    </SessionProvider>
  );
}

function AppContent() {
  const {
    activeClientId,
    createNewSession,
    changeClient,
  } = useSession();

  return (
    <>
      <StatusBar
        onNewSession={createNewSession}
        activeClientId={activeClientId}
        onChangeClient={changeClient}
      />
      <SessionTabs />
      <div className="flex h-[calc(100vh-5rem)] font-mono">
        <div className='w-72 h-full'>
          <Sidebar activeClientId={activeClientId} />
        </div>
        <div className='w-[calc(100vw-18rem)] h-full'>
          <SessionContent />
        </div>
      </div>
    </>
  );
}
