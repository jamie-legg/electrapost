"use client";

import { useSession } from "@/hooks/use-session";
import { useDisplay } from "@/hooks/use-display"
import { ArrowRight, CircleArrowOutDownLeft, CircleArrowOutUpRight, Expand, Play, Shrink, Tally1, Tally2, Tally3 } from "lucide-react";
import { KeyboardEvent, useEffect, useState } from "react";
import { SqlEditor } from "./SqlEditor";
import { QueryHistory } from "./QueryHistory";

export const QueryEditor = () => {
  const { sessions, activeSessionId, setQueryText, executeQuery } = useSession();
  const { isDDLViewOpen, isFullscreen, setFullscreen } = useDisplay();
  const query = sessions.find(session => session.id === activeSessionId)?.query || '';
  const [isFocused, setIsFocused] = useState(false);
  const [expansionLevel, setExpansionLevel] = useState(1);

  const toggleExpand = () => {
    setExpansionLevel((prevLevel) => (prevLevel % 3) + 1);
  };

  const toggleFullscreen = () => {
    setFullscreen(isFullscreen ? null : 'query');
  };

  return (
    <div 
    onFocus={() => setIsFocused(true)}
    onBlur={() => setIsFocused(false)}
    onMouseLeave={() => setIsFocused(false)}
    onMouseEnter={() => setIsFocused(true)}
    className={`z-10 w-full ${
      expansionLevel === 1 ? 'h-[calc(100vh-47rem)]' : 
      expansionLevel === 2 ? 'h-[calc(100vh-30rem)]' : 
      'h-[calc(100vh-10rem)]'
    } bottom-0 transition-all overflow-hidden`}>
    <Toolbar toggleExpand={toggleExpand} expansionLevel={expansionLevel} toggleFullscreen={toggleFullscreen} isFullscreen={isFullscreen} />

<SqlEditor />
      </div>
  );
};

const Toolbar = ({ toggleExpand, expansionLevel, toggleFullscreen, isFullscreen }) => {
  const {executeQuery, sessions, activeSessionId} = useSession();
  const activeSession = sessions.find(session => session.id === activeSessionId);
  const { info, history } = activeSession?.queryResults || { info: { duration: 0, rowCount: 0, complexity: 'N/A' }, history: [] };

  return <div className="w-full h-6 bg-stone-800 z-10 flex items-center justify-between px-2">
    <div className="flex items-center space-x-2">
      <button onClick={toggleExpand} className="text-stone-400 hover:text-stone-100 px-2 border border-stone-700 rounded transform rotate-180">
        {expansionLevel === 1 ? <Tally1 size={14} className="transform rotate-90" /> : 
         expansionLevel === 2 ? <Tally2 size={14} className="transform rotate-90" /> : 
         <Tally3 size={14} className="transform rotate-90" />}
      </button>
      <button onClick={() => executeQuery()} className="text-stone-400 hover:text-stone-100 px-2 border border-stone-700 rounded">
        <Play size={14} />
      </button>
      <button onClick={toggleFullscreen} className="text-stone-400 hover:text-stone-100 px-2 border border-stone-700 rounded">
        {isFullscreen ? <Shrink size={14} /> : <Expand size={14} />}
      </button>
    </div>
    <div className="flex items-center space-x-4">
      <span>Time: {info.duration ?? 0}ms</span>
      <span>Rows: {info.rowCount ?? 0}</span>
      <span>Complexity: {info.complexity ?? 'N/A'}</span>
    </div>
    <div className="flex items-center space-x-2">
      <QueryHistory history={history} />
    </div>
  </div>;
};
