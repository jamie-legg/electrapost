import { useSession } from "@/hooks/use-session";
import { Button } from "../Button";
import { CurrentClient } from "./CurrentClient";
import { CheckCheck, CheckCircle, CircleCheck, CircleOff, CirclePower, Map } from "lucide-react";
import { SettingsButton } from "./Settings";

export const StatusBar = ({
  onNewSession,
  activeClientId,
  onChangeClient,
}) => {
  const { isDDLViewOpen, setIsDDLViewOpen, isMapViewOpen, setIsMapViewOpen } = useSession();
  return (
    <div className="h-10 bg-stone-500 text-white w-screen flex justify-between">
      <div className="flex p-0.5 w-screen space-x-2">
        <Button onClick={onNewSession}>New</Button>
        <Button isActive={isDDLViewOpen} onClick={() => setIsDDLViewOpen(!isDDLViewOpen)}>DDL
        {isDDLViewOpen ? <CircleCheck size={14} /> : <CircleOff size={14} />}
        </Button>
        <Button isActive={isMapViewOpen} onClick={() => setIsMapViewOpen(!isMapViewOpen)}>
          MAP
          {isMapViewOpen ? <CirclePower size={14} /> : <CircleOff size={14} />}
        </Button>
      </div>
      <div className="flex space-x-2">
      <CurrentClient
        activeClientId={activeClientId}
        onChangeClient={onChangeClient}
      />
      <SettingsButton activeClientId={activeClientId} />
      </div>
    </div>
  );
};
