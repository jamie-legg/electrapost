'use client'

import { useSession } from "@/hooks/use-session";

export const SessionTabs = () => {
  const { sessions, activeSessionId, setActiveSessionId } = useSession();

  return (
    <div className="h-8 flex bg-stone-700 items-center justify-start z-20 font-mono">
      {sessions.map((session) => (
        <button
          key={session.id}
          className={`mx-1 text-xs px-3 py-1 rounded ${
            activeSessionId === session.id ? 'bg-stone-600 text-stone-200 border border-stone-500' : 'bg-stone-800 text-stone-400'
          }`}
          onClick={() => setActiveSessionId(session.id)}
        >
          {session.name}
        </button>
      ))}
    </div>
  );
};
