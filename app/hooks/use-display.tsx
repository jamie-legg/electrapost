// inherit from display context
import { createContext, useContext, useState } from "react";

interface DisplayContextProps {
  isDDLViewOpen: boolean;
  isMapViewOpen: boolean;
  isFullscreen: boolean;
  fullscreenView: string | null;
  setIsDDLViewOpen: (open: boolean) => void;
  setIsMapViewOpen: (open: boolean) => void;
  setFullscreen: (view: string | null) => void;
}

const DisplayContext = createContext<DisplayContextProps | null>(null);

export function useDisplay() {
  const context = useContext(DisplayContext);
  if (!context) {
    throw new Error('useDisplay must be used within a DisplayProvider');
  }
  return context;
}

export function DisplayProvider({ children }: { children: React.ReactNode }) {
  const [isDDLViewOpen, setIsDDLViewOpen] = useState(false);
  const [isMapViewOpen, setIsMapViewOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenView, setFullscreenView] = useState<string | null>(null);

  const setFullscreen = async (view: string | null) => {
    if (view) {
      setFullscreenView(view);
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        try {
          await elem.requestFullscreen({
            navigationUI: 'hide',
          });
          setIsFullscreen(true);
        } catch (error) {
          console.error('Failed to enter fullscreen:', error);
          // Handle the error, maybe show a user-friendly message
        }
      } else {
        console.warn('Fullscreen API is not supported in this browser');
        // Maybe fallback to a non-fullscreen alternative
      }
    } else {
      if (document.fullscreenElement) {
        try {
          await document.exitFullscreen();
        } catch (error) {
          console.error('Failed to exit fullscreen:', error);
          // Handle the error, maybe show a user-friendly message
        }
      }
      setIsFullscreen(false);
      setFullscreenView(null);
    }
  };

  return (
    <DisplayContext.Provider
      value={{
        isDDLViewOpen,
        isMapViewOpen,
        isFullscreen,
        fullscreenView,
        setIsDDLViewOpen,
        setIsMapViewOpen,
        setFullscreen,
      }}
    >
      {children}
    </DisplayContext.Provider>
  );
}