"use client";

import { useState } from "react";
import { Settings } from "lucide-react";

import { Button } from "../Button";
import SettingsModal from "../Settings/SettingsModal";

export const SettingsButton = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  return (
    <Button onClick={() => setIsSettingsOpen(true)}>
      <Settings size={14} />
      Settings
      <SettingsModal isOpen={isSettingsOpen} setIsOpen={setIsSettingsOpen} />
    </Button>
  );
};
