'use client'

import { Database, ChevronDown } from "lucide-react";
import NewClientModal from "../NewClient/NewClientModal";
import { useState, useEffect } from "react";
import { Button } from "../Button";
import { DatabaseClientConfig } from "global";

export const CurrentClient = ({ activeClientId, onChangeClient }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [clients, setClients] = useState<DatabaseClientConfig[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      const fetchedClients = await window.db.getConnections();
      console.log('fetchedClients', fetchedClients);
      
      setClients(fetchedClients);
    };
    fetchClients();
  }, []);

  const currentClient = clients.find(client => client.id === activeClientId);

  return (
    <div className="relative flex p-0.5">
      <Button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        <Database size={14} className="mr-2" />
        {currentClient ? currentClient.nickname : 'No Client'}
        <ChevronDown size={14} className="ml-2" />
      </Button>
      {isDropdownOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-stone-800 shadow-lg rounded-md overflow-hidden z-50">
          {clients.map(client => (
            <div
              key={client.id}
              className="px-4 py-2 hover:bg-stone-900 cursor-pointer"
              onClick={() => {
                onChangeClient(client.id);
                setIsDropdownOpen(false);
              }}
            >
                  {client.nickname}
            </div>
          ))}
          <div
            className="px-4 py-2 hover:bg-stone-900 bg-stone-900 cursor-pointer font-bold"
            onClick={() => {
              setIsSettingsOpen(true);
              setIsDropdownOpen(false);
            }}
          >
            New Client
          </div>
        </div>
      )}
      <NewClientModal
        isOpen={isSettingsOpen}
        setIsOpen={setIsSettingsOpen}
      />
    </div>
  );
}