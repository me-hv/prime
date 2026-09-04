"use client";

import * as React from "react";
import { createContext, useContext, useState, useEffect } from "react";

interface NavigationContextType {
  isQuickCaptureOpen: boolean;
  openQuickCapture: () => void;
  closeQuickCapture: () => void;
  toggleQuickCapture: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const openQuickCapture = () => setIsQuickCaptureOpen(true);
  const closeQuickCapture = () => setIsQuickCaptureOpen(false);
  const toggleQuickCapture = () => setIsQuickCaptureOpen((prev) => !prev);

  // Keyboard shortcut listener (Cmd/Ctrl + K or simply 'c' when not typing in input)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggleQuickCapture();
        return;
      }

      // Check for standalone 'c' hotkey when not in input/textarea/editable
      if (
        e.key.toLowerCase() === "c" &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(
          (document.activeElement as HTMLElement)?.tagName || ""
        ) &&
        !(document.activeElement as HTMLElement)?.isContentEditable
      ) {
        e.preventDefault();
        openQuickCapture();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <NavigationContext.Provider
      value={{
        isQuickCaptureOpen,
        openQuickCapture,
        closeQuickCapture,
        toggleQuickCapture,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}
