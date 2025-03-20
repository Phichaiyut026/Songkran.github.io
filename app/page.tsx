"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Droplet,
  Upload,
  Users,
  Trophy,
  Play,
  Square,
  ChevronRight,
  ChevronLeft,
  Save,
  FolderOpen,
  Settings,
} from "lucide-react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import Papa from "papaparse";
import WaterWave from "@/components/water-wave";
import WaterDrops from "@/components/water-drops";
import SongkranDecorations from "@/components/SongkranDecorations";
import WaterGunAnimation from "@/components/WaterGunAnimation";
import ThaiNewYearBanner from "@/components/ThaiNewYearBanner";
import DancingElephant from "@/components/elephantDanceSVG";

const triggerFestiveConfetti = () => {
  const duration = 5 * 1000;
  const animationEnd = Date.now() + duration;
  const colors = [
    "#FF6D6A",
    "#87CEEB",
    "#FFD700",
    "#77DD77",
    "#FFC0CB",
    "#FF85A2",
  ];

  const randomInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  confetti({
    particleCount: 150,
    spread: 180,
    origin: { y: 0.6 },
    colors: colors,
    disableForReducedMotion: true,
  });

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }
    confetti({
      particleCount: 5,
      startVelocity: 30,
      spread: 360,
      origin: {
        x: randomInRange(0.1, 0.9),
        y: randomInRange(0.1, 0.5),
      },
      colors: colors,
      disableForReducedMotion: true,
    });
  }, 200);
};

type PrizeTier = {
  tier: number;
  name: string;
  amount: string | number;
  quantity: number;
  winnersPerRound: number;
  active: boolean;
  drawnCount: number;
  winners: string[];
};

export default function SongkranRaffle() {
  const [employees, setEmployees] = useState<string[]>([]);
  const [remainingEmployees, setRemainingEmployees] = useState<string[]>([]);
  const [currentWinners, setCurrentWinners] = useState<string[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [fileImported, setFileImported] = useState(false);
  const [triggerConfetti, setTriggerConfetti] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(false); // เพิ่ม state ใหม่
  const fileInputRef = useRef<HTMLInputElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const spinIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const controlWindowRef = useRef<Window | null>(null);

  const [prizeTiers, setPrizeTiers] = useState<PrizeTier[]>([
    {
      tier: 9,
      name: "รางวัลที่ 9",
      amount: "ของขวัญบริษัท",
      quantity: 20,
      winnersPerRound: 10,
      active: true,
      drawnCount: 0,
      winners: [],
    },
    {
      tier: 8,
      name: "รางวัลที่ 8",
      amount: 300,
      quantity: 50,
      winnersPerRound: 10,
      active: false,
      drawnCount: 0,
      winners: [],
    },
    {
      tier: 7,
      name: "รางวัลที่ 7",
      amount: 600,
      quantity: 40,
      winnersPerRound: 8,
      active: false,
      drawnCount: 0,
      winners: [],
    },
    {
      tier: 6,
      name: "รางวัลที่ 6",
      amount: 800,
      quantity: 30,
      winnersPerRound: 5,
      active: false,
      drawnCount: 0,
      winners: [],
    },
    {
      tier: 5,
      name: "รางวัลที่ 5",
      amount: 1000,
      quantity: 15,
      winnersPerRound: 5,
      active: false,
      drawnCount: 0,
      winners: [],
    },
    {
      tier: 4,
      name: "รางวัลที่ 4",
      amount: 2000,
      quantity: 6,
      winnersPerRound: 3,
      active: false,
      drawnCount: 0,
      winners: [],
    },
    {
      tier: 3,
      name: "รางวัลที่ 3",
      amount: 3000,
      quantity: 4,
      winnersPerRound: 4,
      active: false,
      drawnCount: 0,
      winners: [],
    },
    {
      tier: 2,
      name: "รางวัลที่ 2",
      amount: 5000,
      quantity: 2,
      winnersPerRound: 2,
      active: false,
      drawnCount: 0,
      winners: [],
    },
    {
      tier: 1,
      name: "รางวัลที่ 1",
      amount: 8000,
      quantity: 1,
      winnersPerRound: 1,
      active: false,
      drawnCount: 0,
      winners: [],
    },
  ]);

  // ฟังคำสั่งจาก ControlPanel
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "COMMAND") {
        switch (event.data.command) {
          case "TOGGLE_SPINNING":
            toggleSpinning();
            break;
          case "RESET":
            resetRaffle();
            break;
          case "PREVIOUS_TIER":
            moveToPreviousPrizeTier();
            break;
          case "NEXT_TIER":
            moveToNextPrizeTier();
            break;
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [isSpinning, prizeTiers, remainingEmployees, currentWinners]);

  // อัปเดตสถานะไปยัง ControlPanel และตรวจสอบเมื่อหน้าต่างปิด
  useEffect(() => {
    if (controlWindowRef.current) {
      controlWindowRef.current.postMessage(
        {
          type: "UPDATE_STATE",
          isSpinning,
          canGoBack: prizeTiers.findIndex((prize) => prize.active) > 0,
          canGoNext:
            prizeTiers.findIndex((prize) => prize.active) <
            prizeTiers.length - 1,
        },
        "*"
      );

      // ตรวจสอบว่าหน้าต่างถูกปิดหรือไม่
      const checkWindowClosed = setInterval(() => {
        if (controlWindowRef.current?.closed) {
          setIsControlPanelOpen(false);
          controlWindowRef.current = null;
          clearInterval(checkWindowClosed);
        }
      }, 500);

      return () => clearInterval(checkWindowClosed);
    }
  }, [isSpinning, prizeTiers]);

  // ตั้งค่า isClient เป็น true หลังจาก mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load saved data from localStorage
  useEffect(() => {
    const savedEmployees = localStorage.getItem("songkran-employees");
    const savedPrizeTiers = localStorage.getItem("songkran-prize-tiers");
    const savedRemainingEmployees = localStorage.getItem(
      "songkran-remaining-employees"
    );

    if (savedEmployees) {
      const parsedEmployees = JSON.parse(savedEmployees);
      setEmployees(parsedEmployees);
      setFileImported(parsedEmployees.length > 0);
    }

    if (savedPrizeTiers) {
      setPrizeTiers(JSON.parse(savedPrizeTiers));
    }

    if (savedRemainingEmployees) {
      setRemainingEmployees(JSON.parse(savedRemainingEmployees));
    } else if (savedEmployees) {
      setRemainingEmployees(JSON.parse(savedEmployees));
    }
  }, []);

  // Trigger confetti
  useEffect(() => {
    if (triggerConfetti && isClient) {
      triggerFestiveConfetti();
      setTriggerConfetti(false);
    }
  }, [triggerConfetti, isClient]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
      }
      if (controlWindowRef.current) {
        controlWindowRef.current.close();
      }
    };
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (employees.length > 0) {
      localStorage.setItem("songkran-employees", JSON.stringify(employees));
    }
  }, [employees]);

  useEffect(() => {
    if (remainingEmployees.length > 0) {
      localStorage.setItem(
        "songkran-remaining-employees",
        JSON.stringify(remainingEmployees)
      );
    }
  }, [remainingEmployees]);

  useEffect(() => {
    localStorage.setItem("songkran-prize-tiers", JSON.stringify(prizeTiers));
  }, [prizeTiers]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type === "text/csv") {
      Papa.parse(file, {
        complete: (results: { data: any[] }) => {
          const names = results.data
            .flat()
            .filter(
              (name): name is string =>
                typeof name === "string" && name.trim() !== ""
            );
          setEmployees(names);
          setRemainingEmployees(names);
          setFileImported(true);
        },
        error: (error: any) => {
          console.error("Error parsing CSV:", error);
        },
      });
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const lines = content.split("\n");
        const names = lines.filter((line) => line.trim() !== "");
        setEmployees(names);
        setRemainingEmployees(names);
        setFileImported(true);
      };
      reader.readAsText(file);
    }
  };

  const openControlPanel = () => {
    if (controlWindowRef.current && !controlWindowRef.current.closed) {
      controlWindowRef.current.focus();
      return;
    }

    const controlWindow = window.open(
      "/control-panel",
      "ControlPanel",
      "width=600,height=400"
    );
    if (controlWindow) {
      controlWindowRef.current = controlWindow;
      setIsControlPanelOpen(true); // ตั้งค่าเมื่อเปิดหน้าต่าง
    }
  };

  const getCurrentActivePrize = (): PrizeTier | null => {
    const activePrize = prizeTiers.find((prize) => prize.active);
    return activePrize || null;
  };

  const moveToNextPrizeTier = () => {
    const currentActiveIndex = prizeTiers.findIndex((prize) => prize.active);
    if (
      currentActiveIndex !== -1 &&
      currentActiveIndex + 1 < prizeTiers.length
    ) {
      const updatedPrizeTiers = [...prizeTiers];
      updatedPrizeTiers[currentActiveIndex].active = false;
      updatedPrizeTiers[currentActiveIndex + 1].active = true;
      setPrizeTiers(updatedPrizeTiers);
      setTriggerConfetti(true);
      setCurrentWinners([]);
    }
  };

  const moveToPreviousPrizeTier = () => {
    const currentActiveIndex = prizeTiers.findIndex((prize) => prize.active);
    if (currentActiveIndex > 0) {
      const updatedPrizeTiers = [...prizeTiers];
      updatedPrizeTiers[currentActiveIndex].active = false;
      updatedPrizeTiers[currentActiveIndex - 1].active = true;
      setPrizeTiers(updatedPrizeTiers);
      setCurrentWinners([]);
    }
  };

  const toggleSpinning = () => {
    const activePrize = getCurrentActivePrize();
    if (!activePrize) {
      alert("All prizes have been awarded!");
      return;
    }

    const remainingForPrize = activePrize.quantity - activePrize.drawnCount;
    const winnerCount = Math.min(activePrize.winnersPerRound, remainingForPrize);

    if (remainingEmployees.length < winnerCount) {
      alert(
        `Not enough employees remaining! Need at least ${winnerCount} for this round.`
      );
      return;
    }

    if (isSpinning) {
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
        spinIntervalRef.current = null;
      }

      const finalWinners: string[] = [];
      const updatedRemaining = [...remainingEmployees];

      for (let i = 0; i < winnerCount; i++) {
        if (updatedRemaining.length === 0) break;
        const winnerIndex = Math.floor(Math.random() * updatedRemaining.length);
        const winner = updatedRemaining[winnerIndex];
        finalWinners.push(winner);
        updatedRemaining.splice(winnerIndex, 1);
      }

      setCurrentWinners(finalWinners);
      setRemainingEmployees(updatedRemaining);
      setIsSpinning(false);
      setTriggerConfetti(true);

      const updatedPrizeTiers = [...prizeTiers];
      const prizeIndex = updatedPrizeTiers.findIndex((p) => p.active);
      if (prizeIndex !== -1) {
        updatedPrizeTiers[prizeIndex].drawnCount += winnerCount;
        updatedPrizeTiers[prizeIndex].winners = [
          ...updatedPrizeTiers[prizeIndex].winners,
          ...finalWinners,
        ];
        setPrizeTiers(updatedPrizeTiers);
      }
    } else {
      setIsSpinning(true);
      spinIntervalRef.current = setInterval(() => {
        const tempWinners: string[] = [];
        for (let i = 0; i < winnerCount; i++) {
          const randomIndex = Math.floor(
            Math.random() * remainingEmployees.length
          );
          tempWinners.push(remainingEmployees[randomIndex]);
        }
        setCurrentWinners(tempWinners);
      }, 100);
    }
  };

  const resetRaffle = () => {
    if (spinIntervalRef.current) {
      clearInterval(spinIntervalRef.current);
      spinIntervalRef.current = null;
    }

    setIsSpinning(false);
    setRemainingEmployees([...employees]);
    setCurrentWinners([]);

    setPrizeTiers([
      {
        tier: 9,
        name: "รางวัลที่ 9",
        amount: "ของขวัญบริษัท",
        quantity: 20,
        winnersPerRound: 10,
        active: true,
        drawnCount: 0,
        winners: [],
      },
      {
        tier: 8,
        name: "รางวัลที่ 8",
        amount: 300,
        quantity: 50,
        winnersPerRound: 10,
        active: false,
        drawnCount: 0,
        winners: [],
      },
      {
        tier: 7,
        name: "รางวัลที่ 7",
        amount: 600,
        quantity: 40,
        winnersPerRound: 8,
        active: false,
        drawnCount: 0,
        winners: [],
      },
      {
        tier: 6,
        name: "รางวัลที่ 6",
        amount: 800,
        quantity: 30,
        winnersPerRound: 5,
        active: false,
        drawnCount: 0,
        winners: [],
      },
      {
        tier: 5,
        name: "รางวัลที่ 5",
        amount: 1000,
        quantity: 15,
        winnersPerRound: 5,
        active: false,
        drawnCount: 0,
        winners: [],
      },
      {
        tier: 4,
        name: "รางวัลที่ 4",
        amount: 2000,
        quantity: 6,
        winnersPerRound: 3,
        active: false,
        drawnCount: 0,
        winners: [],
      },
      {
        tier: 3,
        name: "รางวัลที่ 3",
        amount: 3000,
        quantity: 4,
        winnersPerRound: 4,
        active: false,
        drawnCount: 0,
        winners: [],
      },
      {
        tier: 2,
        name: "รางวัลที่ 2",
        amount: 5000,
        quantity: 2,
        winnersPerRound: 2,
        active: false,
        drawnCount: 0,
        winners: [],
      },
      {
        tier: 1,
        name: "รางวัลที่ 1",
        amount: 8000,
        quantity: 1,
        winnersPerRound: 1,
        active: false,
        drawnCount: 0,
        winners: [],
      },
    ]);

    localStorage.removeItem("songkran-prize-tiers");
    localStorage.removeItem("songkran-remaining-employees");
  };

  const formatPrizeAmount = (amount: string | number) => {
    if (typeof amount === "number") {
      return `฿${amount.toLocaleString()}`;
    }
    return amount;
  };

  const getRemainingWinnersForCurrentPrize = () => {
    const activePrize = getCurrentActivePrize();
    if (!activePrize) return 0;
    return activePrize.quantity - activePrize.drawnCount;
  };

  const getWinnersForNextRound = () => {
    const activePrize = getCurrentActivePrize();
    if (!activePrize) return 0;
    const remainingForPrize = activePrize.quantity - activePrize.drawnCount;
    return Math.min(activePrize.winnersPerRound, remainingForPrize);
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url('/songkran-background.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-white/40 dark:bg-black/60 backdrop-blur-sm"></div>
      {isClient && (
        <>
          <WaterDrops />
          <SongkranDecorations />
          <WaterGunAnimation />
          <DancingElephant />
        </>
      )}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-8">
          <h1
            className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-md"
            style={{
              fontFamily: "'Dancing Script', cursive",
              color: "#00A1E4",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
              fontSize: 125,
            }}
          >
            Songkran{" "}
            <span
              style={{
                color: "#FFD700",
              }}
            >
              Festival
            </span>
          </h1>
        </div>

        <div className="max-w-5xl mx-auto mb-8">
          {!fileImported ? (
            <Card className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-blue-200 dark:border-blue-700 shadow-lg">
              <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-300 mb-4 flex items-center">
                <Upload className="mr-2 h-5 w-5" />
                Import Employee Names
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="file-upload" className="block mb-2">
                    Upload CSV or text file with employee names
                  </Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".csv,.txt,.xlsx"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </Card>
          ) : (
            <>
              <Card className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-blue-200 dark:border-blue-700 shadow-lg mb-4">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-full">
                    <Trophy className="mr-2 h-5 w-5" />
                    <span className="font-medium text-lg">
                      {getCurrentActivePrize()?.name || "All prizes awarded"}
                      {getCurrentActivePrize() &&
                        ` - ${formatPrizeAmount(
                          getCurrentActivePrize()?.amount!
                        )}`}
                    </span>
                  </div>
                  {getCurrentActivePrize() && (
                    <div className="mt-2 text-blue-600 dark:text-blue-300">
                      จำนวน {getCurrentActivePrize()?.quantity} รางวัล (เหลือ{" "}
                      {getRemainingWinnersForCurrentPrize()} รางวัล)
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center">
                    <div
                      ref={spinnerRef}
                      className="relative w-full min-h-[200px] mb-4 flex items-center justify-center bg-gradient-to-r from-blue-100/80 to-blue-200/80 dark:from-blue-800/80 dark:to-blue-700/80 rounded-lg overflow-hidden p-4"
                    >
                      <WaterWave />
                      <AnimatePresence>
                        {currentWinners.length > 0 ? (
                          <motion.div
                            key="winners-list"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className={`grid gap-3 z-10 w-full ${
                              currentWinners.length <= 2
                                ? "grid-cols-1 max-w-md mx-auto"
                                : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
                            }`}
                          >
                            {currentWinners.map((winner, index) => (
                              <div
                                key={index}
                                className="bg-white/80 dark:bg-blue-900/80 backdrop-blur-sm p-3 rounded-lg shadow text-center"
                              >
                                <div className="font-bold text-blue-700 dark:text-white">
                                  {winner}
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-lg text-center text-blue-600 dark:text-blue-300 z-10"
                          >
                            {isSpinning
                              ? "Spinning..."
                              : `กด Start เพื่อเริ่ม`}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-gray-600 dark:text-gray-300 flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <Users className="mr-1 h-4 w-4" />
                      {employees.length} employees loaded
                    </div>
                    <div>{remainingEmployees.length} remaining</div>
                  </div>
                </div>
              </Card>

              {!isControlPanelOpen && ( // แสดงปุ่มเฉพาะเมื่อหน้าต่างควบคุมไม่ได้เปิด
                <div className="flex justify-center mb-4">
                  <Button
                    onClick={openControlPanel}
                    className="bg-purple-500 hover:bg-purple-600 text-white"
                    size="lg"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Open Control Panel
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}