"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { SearchBar } from "./SearchBar";
import { useSidebar } from "../contexts/SidebarContext";
import { useAccentColor, type AccentColor } from "../contexts/AccentColorContext";

interface HeaderProps {
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

export function Header({ onSearchChange, searchQuery }: HeaderProps) {
  const [userEmail, setUserEmail] = useState<string>("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAccentColors, setShowAccentColors] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [location, setLocation] = useState<string>("Getting location...");
  const router = useRouter();
  const { isMinimized, toggleMinimize } = useSidebar();
  const { accentColor, setAccentColor, accentColorValue } = useAccentColor();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      setUserEmail(email);
    }
  }, []);

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Get user location
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation("Location not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocoding using Nominatim (OpenStreetMap)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
          );
          
          if (response.ok) {
            const data = await response.json();
            const address = data.address;
            
            // Build location string
            let locationString = "";
            if (address.city || address.town || address.municipality) {
              locationString = address.city || address.town || address.municipality;
            } else if (address.village) {
              locationString = address.village;
            }
            
            if (address.state || address.province) {
              locationString += locationString ? `, ${address.state || address.province}` : (address.state || address.province);
            }
            
            if (address.country) {
              locationString += locationString ? `, ${address.country}` : address.country;
            }
            
            setLocation(locationString || "Location found");
          } else {
            setLocation("Tarlac, Philippines");
          }
        } catch (error) {
          console.error("Error getting location:", error);
          setLocation("Tarlac, Philippines");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLocation("Tarlac, Philippines");
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 600000, // 10 minutes
      }
    );
  }, []);

  function handleLogout() {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("userEmail");
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-30 bg-[#f8f8f8]/95 dark:bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section - Sidebar Toggle, Time and Location */}
          <div className="flex items-center gap-4 flex-1">
            {/* Sidebar Toggle Button */}
            <button
              onClick={toggleMinimize}
              className="hidden md:flex p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
              title={isMinimized ? "Expand sidebar" : "Minimize sidebar"}
            >
              <svg
                className="w-5 h-5 text-zinc-600 dark:text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMinimized ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                )}
              </svg>
            </button>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-zinc-500 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 font-mono">
                  {currentTime}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-zinc-500 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-xs text-zinc-600 dark:text-zinc-400">
                  {location}
                </span>
              </div>
            </div>
          </div>

          {/* Center section - Search */}
          <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-4">
            <SearchBar searchQuery={searchQuery} onSearchChange={onSearchChange} />
          </div>

          {/* Right section - Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Search Toggle */}
            <div className="md:hidden">
              <SearchBar searchQuery={searchQuery} onSearchChange={onSearchChange} />
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: accentColorValue }}
                >
                  <span className="text-white font-medium text-sm">
                    {userEmail ? userEmail.charAt(0).toUpperCase() : "U"}
                  </span>
                </div>
                <span className="hidden sm:block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {userEmail || "User"}
                </span>
                <svg
                  className={`w-4 h-4 text-zinc-600 dark:text-zinc-400 transition-transform ${
                    showUserMenu ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-[#f8f8f8] dark:bg-zinc-800 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700 py-2 z-50">
                    <div className="px-4 py-2 border-b border-zinc-200 dark:border-zinc-700">
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {userEmail || "User"}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Administrator
                      </p>
                    </div>
                    
                    {/* Accent Color Theme Selection */}
                    <div className="border-b border-zinc-200 dark:border-zinc-700">
                      <button
                        onClick={() => setShowAccentColors(!showAccentColors)}
                        className="w-full px-4 py-2 flex items-center justify-between hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                          Accent Color
                        </p>
                        <svg
                          className={`w-4 h-4 text-zinc-500 dark:text-zinc-400 transition-transform ${
                            showAccentColors ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {showAccentColors && (
                        <div className="px-4 pb-2 space-y-1">
                          {(["green", "blue", "purple", "orange", "red", "teal"] as AccentColor[]).map((color) => {
                            const colorValue =
                              color === "green"
                                ? "#15803d"
                                : color === "blue"
                                ? "#3b82f6"
                                : color === "purple"
                                ? "#9333ea"
                                : color === "orange"
                                ? "#f59e0b"
                                : color === "red"
                                ? "#ef4444"
                                : "#14b8a6";
                            const isSelected = accentColor === color;

                            return (
                              <button
                                key={color}
                                onClick={() => {
                                  setAccentColor(color);
                                  setShowUserMenu(false);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
                              >
                                <div
                                  className="w-4 h-4 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: colorValue }}
                                />
                                <span className="flex-1 text-sm text-zinc-700 dark:text-zinc-300 capitalize">
                                  {color}
                                </span>
                                {isSelected && (
                                  <svg
                                    className="w-4 h-4 flex-shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    style={{ color: colorValue }}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

