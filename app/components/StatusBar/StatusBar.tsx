import { useSession } from "@/hooks/use-session";
import { Button } from "../Button";
import { CurrentClient } from "./CurrentClient";
import { CheckCheck, CheckCircle, CircleCheck, CircleOff } from "lucide-react";

export const StatusBar = ({
  onNewSession,
  activeClientId,
  onChangeClient,
}) => {
  const { isDDLViewOpen, setIsDDLViewOpen } = useSession();
  return (
    <div className="bg-stone-500 text-white w-screen flex justify-between">
      <div className="flex p-0.5 w-screen space-x-2">
        <Button onClick={onNewSession}>New</Button>
        <Button isActive={isDDLViewOpen} onClick={() => setIsDDLViewOpen(!isDDLViewOpen)}>DDL
        {isDDLViewOpen ? <CircleCheck size={14} /> : <CircleOff size={14} />}
        </Button>
      </div>
      <CurrentClient
        activeClientId={activeClientId}
        onChangeClient={onChangeClient}
      />
    </div>
  );
};
