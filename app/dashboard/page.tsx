"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SYSTEMS, ExtendedSystem } from "./data/systems";
import { DashboardGrid } from "./components/DashboardGrid";
import { ExpandingAnimation } from "./components/ExpandingAnimation";
import { DetailView } from "./components/DetailView";

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<ExtendedSystem | null>(
    null
  );
  const [hasAutoNavigated, setHasAutoNavigated] = useState(false);
  const [animationStage, setAnimationStage] = useState<
    "showcase" | "expanding" | "detail"
  >("showcase");
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const auth = localStorage.getItem("authenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
    } else {
      router.push("/login");
    }
  }, [router]);

  // DISABLED: Auto-navigate animation
  // useEffect(() => {
  //   // Auto-navigate to Database Manager after showcasing the dashboard for 3 seconds
  //   if (
  //     isAuthenticated &&
  //     !selectedSystem &&
  //     !hasAutoNavigated &&
  //     animationStage === "showcase"
  //   ) {
  //     const timer = setTimeout(() => {
  //       const databaseSystem = SYSTEMS.find((sys) => sys.id === "5");
  //       if (databaseSystem) {
  //         setAnimationStage("expanding");
  //         // Wait for expanding animation to complete
  //         setTimeout(() => {
  //           setSelectedSystem(databaseSystem);
  //           setHasAutoNavigated(true);
  //           setAnimationStage("detail");
  //         }, 5000); // Match the complete dramatic animation duration
  //       }
  //     }, 1000); // Quick dashboard showcase (1 second)

  //     return () => clearTimeout(timer);
  //   }
  // }, [isAuthenticated, selectedSystem, hasAutoNavigated, animationStage]);

  function handleCardClick(system: ExtendedSystem) {
    if (selectedSystem) return;
    setSelectedSystem(system);
    setHasAutoNavigated(true);
  }

  function handleCloseDetail() {
    setSelectedSystem(null);
  }

  function handleLogout() {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("userEmail");
    router.push("/login");
  }

  if (!isAuthenticated) {
    return null;
  }

  // Render expanding animation stage
  if (animationStage === "expanding") {
    return <ExpandingAnimation />;
  }

  // Render detailed view when system is selected
  if (selectedSystem) {
    return <DetailView system={selectedSystem} onClose={handleCloseDetail} />;
  }

  // Render dashboard view
  return (
    <DashboardGrid
      systems={SYSTEMS}
      onCardClick={handleCardClick}
      onLogout={handleLogout}
    />
  );
}
