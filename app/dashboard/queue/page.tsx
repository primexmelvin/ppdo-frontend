"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccentColor } from "../contexts/AccentColorContext";

export default function QueuePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const { accentColorValue } = useAccentColor();

  useEffect(() => {
    const auth = localStorage.getItem("authenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
    } else {
      router.push("/");
    }
  }, [router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Page Header */}
      <div className="mb-4">
        <h1
          className="text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1"
          style={{ fontFamily: "var(--font-cinzel), serif" }}
        >
          Queue
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Manage and monitor queued items and pending tasks
        </p>
      </div>

      {/* Queue Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Display Card */}
        <div
          className="group bg-white dark:bg-zinc-900 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 p-8 hover:shadow-xl transition-all cursor-pointer"
          style={{
            borderColor: accentColorValue + "40",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = accentColorValue;
            e.currentTarget.style.transform = "translateY(-4px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = accentColorValue + "40";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <div className="aspect-square flex items-center justify-center mb-6 overflow-hidden">
            <img
              src="https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-szxRgzd7v8fiFe8jxVaaFW8Y3mSGcy.png&w=1000&q=75"
              alt="Display"
              className="w-full h-full object-contain transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
            />
          </div>
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 text-center">
            Display
          </h3>
        </div>

        {/* Monitoring Card */}
        <div
          className="group bg-white dark:bg-zinc-900 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 p-8 hover:shadow-xl transition-all cursor-pointer"
          style={{
            borderColor: accentColorValue + "40",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = accentColorValue;
            e.currentTarget.style.transform = "translateY(-4px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = accentColorValue + "40";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <div className="aspect-square flex items-center justify-center mb-6 overflow-hidden">
            <img
              src="https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-fSMgViPMUbS0kVcbqdCIHuTbarLfB5.png&w=1000&q=75"
              alt="Monitoring"
              className="w-full h-full object-contain transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
            />
          </div>
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 text-center">
            Monitoring
          </h3>
        </div>

        {/* Settings Card */}
        <div
          className="group bg-white dark:bg-zinc-900 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 p-8 hover:shadow-xl transition-all cursor-pointer"
          style={{
            borderColor: accentColorValue + "40",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = accentColorValue;
            e.currentTarget.style.transform = "translateY(-4px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = accentColorValue + "40";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <div className="aspect-square flex items-center justify-center mb-6 overflow-hidden">
            <img
              src="https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-Kxv9xKKFv7t6qa6ee6DvtUeB4OkhrG.png&w=1000&q=75"
              alt="Settings"
              className="w-full h-full object-contain transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
            />
          </div>
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 text-center">
            Settings
          </h3>
        </div>
      </div>
    </>
  );
}
