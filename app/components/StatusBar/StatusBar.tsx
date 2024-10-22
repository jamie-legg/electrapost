import { useSession } from "@/hooks/use-session";
import { Button } from "../Button";
import { CurrentClient } from "./CurrentClient";

export const StatusBar = ({
  onNewSession,
  activeClientId,
  onChangeClient,
}) => {
  const { isDDLViewOpen, setIsDDLViewOpen } = useSession();
  return (
    <div className="bg-stone-500 text-white w-screen flex justify-between">
      <div className="flex p-0.5 w-screen">
        <Button onClick={onNewSession}>New</Button>
        <Button onClick={() => setIsDDLViewOpen(!isDDLViewOpen)}>DDL</Button>
      </div>
      <CurrentClient
        activeClientId={activeClientId}
        onChangeClient={onChangeClient}
      />
    </div>
  );
};
