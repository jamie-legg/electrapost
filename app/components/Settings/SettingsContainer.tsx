import { useState } from 'react';
import { Button } from '../Button';
import { useToast } from '@/hooks/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClientSettings } from './ClientSettings';
import { SessionSettings } from './SessionSettings';
import { ThemeSettings } from './ThemeSettings';
import { AISettings } from './AISettings';

interface SettingsContainerProps {
  onCancel: () => void;
}

export default function SettingsContainer({ onCancel }: SettingsContainerProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("client");

  const onSubmit = async () => {
    // Handle submit based on active tab
    switch (activeTab) {
      case "client":
        // Handle client settings submit
        break;
      case "session":
        // Handle session settings submit
        break;
      case "theme":
        // Handle theme settings submit
        break;
      case "ai":
        // Handle AI settings submit
        break;
    }
  }

  const testDatabase = async () => {
    // Implement database test logic
  }

  return (
    <div className="max-w-xl mx-auto bg-gradient-to-br from-black to-stone-900 p-6 rounded-lg shadow-lg border border-stone-500 m-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="client">Client</TabsTrigger>
          <TabsTrigger value="session">Session</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="ai">AI</TabsTrigger>
        </TabsList>
        <TabsContent value="client">
          <ClientSettings />
        </TabsContent>
        <TabsContent value="session">
          <SessionSettings />
        </TabsContent>
        <TabsContent value="theme">
          <ThemeSettings />
        </TabsContent>
        <TabsContent value="ai">
          <AISettings />
        </TabsContent>
      </Tabs>
      
      {/* Buttons */}
      <div className="flex justify-between space-x-4 mt-4">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <div className="flex space-x-4">
          {activeTab === "client" && (
            <>
              <Button variant="outline" onClick={testDatabase}>Test</Button>
              <Button onClick={onSubmit}>Save</Button>
            </>
          )}
          {activeTab !== "client" && (
            <Button onClick={onSubmit}>Save</Button>
          )}
        </div>
      </div>
    </div>
  );
}
