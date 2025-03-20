"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Play,
  Square,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function ControlPanel() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoNext, setCanGoNext] = useState(true);

  // ฟังการอัปเดตจากหน้าต่างหลัก
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "UPDATE_STATE") {
        setIsSpinning(event.data.isSpinning);
        setCanGoBack(event.data.canGoBack);
        setCanGoNext(event.data.canGoNext);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // ส่งคำสั่งไปยังหน้าต่างหลัก
  const sendCommand = (command: string) => {
    window.opener.postMessage({ type: "COMMAND", command }, "*");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-wrap gap-3 justify-center p-6 bg-white rounded-lg shadow-lg">
        <Button
          onClick={() => sendCommand("TOGGLE_SPINNING")}
          className={
            isSpinning
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }
          size="lg"
        >
          {isSpinning ? (
            <>
              <Square className="mr-2 h-4 w-4" /> Stop
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" /> Start
            </>
          )}
        </Button>

        <Button
          onClick={() => sendCommand("RESET")}
          variant="outline"
          className="border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900"
          size="lg"
        >
          Reset
        </Button>

        <div className="flex gap-2">
          <Button
            onClick={() => sendCommand("PREVIOUS_TIER")}
            variant="outline"
            className="border-pink-500 text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900"
            disabled={!canGoBack || isSpinning}
            size="lg"
          >
            <ChevronLeft className="h-5 w-5" />
            Back
          </Button>

          <Button
            onClick={() => sendCommand("NEXT_TIER")}
            variant="outline"
            className="border-pink-500 text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900"
            disabled={!canGoNext || isSpinning}
            size="lg"
          >
            Next
            <ChevronRight className="h-5 w-5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}