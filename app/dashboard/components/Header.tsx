"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { useSidebar } from "../contexts/SidebarContext";
import {
  useAccentColor,
  type AccentColor,
} from "../contexts/AccentColorContext";

interface HeaderProps {
  onSearchChange?: (query: string) => void;
  searchQuery?: string;
}

export function Header({ onSearchChange, searchQuery }: HeaderProps) {
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAccentColors, setShowAccentColors] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [showEmails, setShowEmails] = useState(false);
  const [emailCount, setEmailCount] = useState(5);
  const [showDepartmentMenu, setShowDepartmentMenu] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("PPDO");
  const router = useRouter();
  const { isMinimized, toggleMinimize } = useSidebar();
  const { accentColor, setAccentColor, accentColorValue } = useAccentColor();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      setUserEmail(email);
    }
    // Mock user name - in production, this would come from user data/API
    setUserName("Tarlac Administrator");
  }, []);

  function handleLogout() {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("userEmail");
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-30 bg-[#f8f8f8]/95 dark:bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 py-4">
          {/* Left section - Sidebar Toggle, Welcome and User Name */}
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
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                Welcome back,
              </span>
              <span
                className="text-lg font-semibold text-zinc-900 dark:text-zinc-100"
                style={{ fontFamily: "var(--font-cinzel), serif" }}
              >
                {userName || "User"}
              </span>
            </div>
          </div>

          {/* Right section - Actions */}
          <div className="flex items-center gap-3">
            {/* Department Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDepartmentMenu(!showDepartmentMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                style={{
                  borderColor: showDepartmentMenu
                    ? accentColorValue
                    : undefined,
                }}
              >
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {selectedDepartment}
                </span>
                <svg
                  className={`w-4 h-4 text-zinc-600 dark:text-zinc-400 transition-transform ${
                    showDepartmentMenu ? "rotate-180" : ""
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

              {/* Department Dropdown Menu */}
              {showDepartmentMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowDepartmentMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xl z-20 overflow-hidden">
                    <div className="py-2">
                      {[
                        {
                          code: "PPDO",
                          name: "Provincial Planning and Development Office",
                        },
                        {
                          code: "HRMO",
                          name: "Human Resources Management Office",
                        },
                        { code: "PLO", name: "Provincial Legal Office" },
                        { code: "TPH", name: "Tarlac Provincial Hospital" },
                      ].map((dept) => (
                        <button
                          key={dept.code}
                          onClick={() => {
                            setSelectedDepartment(dept.code);
                            setShowDepartmentMenu(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                            selectedDepartment === dept.code
                              ? "text-white"
                              : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          }`}
                          style={
                            selectedDepartment === dept.code
                              ? { backgroundColor: accentColorValue }
                              : {}
                          }
                        >
                          <div className="font-medium">{dept.code}</div>
                          <div className="text-xs opacity-80">{dept.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mail Icon */}
            <div className="relative">
              <button
                onClick={() => setShowEmails(!showEmails)}
                className="relative p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                title="Email"
              >
                <svg
                  className="w-8 h-8 text-zinc-600 dark:text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {emailCount > 0 && (
                  <span
                    className="absolute top-1 right-1 w-2 h-2 rounded-full"
                    style={{ backgroundColor: accentColorValue }}
                  />
                )}
                {emailCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold text-white flex items-center justify-center"
                    style={{ backgroundColor: accentColorValue }}
                  >
                    {emailCount > 9 ? "9+" : emailCount}
                  </span>
                )}
              </button>

              {/* Email Dropdown */}
              {showEmails && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowEmails(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xl z-20 max-h-[600px] overflow-hidden flex flex-col">
                    {/* Email Header */}
                    <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                        Email
                      </h3>
                      {emailCount > 0 && (
                        <button
                          onClick={() => setEmailCount(0)}
                          className="text-sm font-medium"
                          style={{ color: accentColorValue }}
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    {/* Email List */}
                    <div className="flex-1 overflow-y-auto">
                      {emailCount > 0 ? (
                        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                          {/* Sample Emails */}
                          {[
                            {
                              id: 1,
                              from: "provincial.office@tarlac.gov.ph",
                              subject: "Monthly Report Submission",
                              preview:
                                "Please submit the monthly report by end of week...",
                              time: "2 hours ago",
                              isRead: false,
                            },
                            {
                              id: 2,
                              from: "hr@tarlac.gov.ph",
                              subject: "Staff Meeting Reminder",
                              preview:
                                "Reminder: Staff meeting scheduled for tomorrow...",
                              time: "5 hours ago",
                              isRead: false,
                            },
                            {
                              id: 3,
                              from: "finance@tarlac.gov.ph",
                              subject: "Budget Approval Required",
                              preview:
                                "Your department budget request needs approval...",
                              time: "1 day ago",
                              isRead: false,
                            },
                            {
                              id: 4,
                              from: "it@tarlac.gov.ph",
                              subject: "System Maintenance Notice",
                              preview:
                                "Scheduled maintenance this weekend from 10 PM...",
                              time: "2 days ago",
                              isRead: true,
                            },
                            {
                              id: 5,
                              from: "admin@tarlac.gov.ph",
                              subject: "Policy Update",
                              preview:
                                "New office policies have been updated...",
                              time: "3 days ago",
                              isRead: true,
                            },
                          ].map((email) => (
                            <div
                              key={email.id}
                              className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer transition-colors"
                              onClick={() => {
                                // Handle email click
                                setShowEmails(false);
                              }}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className="w-2 h-2 rounded-full mt-2 shrink-0"
                                  style={{
                                    backgroundColor: email.isRead
                                      ? "transparent"
                                      : accentColorValue,
                                  }}
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                                    {email.from}
                                  </p>
                                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mt-1 truncate">
                                    {email.subject}
                                  </p>
                                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2">
                                    {email.preview}
                                  </p>
                                  <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                                    {email.time}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <svg
                            className="w-12 h-12 mx-auto mb-3 text-zinc-400 dark:text-zinc-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            No new emails
                          </p>
                        </div>
                      )}
                    </div>

                    {/* View All Emails Button */}
                    <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                      <button
                        className="w-full py-2 px-4 rounded-lg font-medium transition-all hover:shadow-md text-center"
                        style={{
                          backgroundColor: accentColorValue,
                          color: "white",
                        }}
                        onClick={() => {
                          setShowEmails(false);
                          router.push("/mail");
                        }}
                      >
                        View All Emails
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                title="Notifications"
              >
                <svg
                  className="w-8 h-8 text-zinc-600 dark:text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {notificationCount > 0 && (
                  <span
                    className="absolute top-1 right-1 w-2 h-2 rounded-full"
                    style={{ backgroundColor: accentColorValue }}
                  />
                )}
                {notificationCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold text-white flex items-center justify-center"
                    style={{ backgroundColor: accentColorValue }}
                  >
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xl z-20 max-h-[500px] overflow-hidden flex flex-col">
                    {/* Notifications Header */}
                    <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                        Notifications
                      </h3>
                      {notificationCount > 0 && (
                        <button
                          onClick={() => setNotificationCount(0)}
                          className="text-sm font-medium"
                          style={{ color: accentColorValue }}
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    {/* Notifications List */}
                    <div className="flex-1 overflow-y-auto">
                      {notificationCount > 0 ? (
                        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                          {/* Sample Notifications */}
                          {[
                            {
                              id: 1,
                              title: "New document received",
                              message:
                                "A new incoming document requires your review",
                              time: "5 minutes ago",
                              isRead: false,
                            },
                            {
                              id: 2,
                              title: "Approval pending",
                              message:
                                "3 documents are waiting for your approval",
                              time: "1 hour ago",
                              isRead: false,
                            },
                            {
                              id: 3,
                              title: "System update",
                              message:
                                "System maintenance scheduled for tonight",
                              time: "2 hours ago",
                              isRead: false,
                            },
                          ].map((notification) => (
                            <div
                              key={notification.id}
                              className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer transition-colors"
                              onClick={() => {
                                // Handle notification click
                                setShowNotifications(false);
                              }}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className="w-2 h-2 rounded-full mt-2 shrink-0"
                                  style={{
                                    backgroundColor: notification.isRead
                                      ? "transparent"
                                      : accentColorValue,
                                  }}
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                    {notification.title}
                                  </p>
                                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                                    {notification.time}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <svg
                            className="w-12 h-12 mx-auto mb-3 text-zinc-400 dark:text-zinc-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                            />
                          </svg>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            No new notifications
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
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
                          {(
                            [
                              "green",
                              "blue",
                              "purple",
                              "orange",
                              "red",
                              "teal",
                            ] as AccentColor[]
                          ).map((color) => {
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
                                  className="w-4 h-4 rounded-full shrink-0"
                                  style={{ backgroundColor: colorValue }}
                                />
                                <span className="flex-1 text-sm text-zinc-700 dark:text-zinc-300 capitalize">
                                  {color}
                                </span>
                                {isSelected && (
                                  <svg
                                    className="w-4 h-4 shrink-0"
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

                    {/* Theme Toggle */}
                    <div className="border-b border-zinc-200 dark:border-zinc-700 px-4 py-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                          Theme
                        </p>
                        <ThemeToggle />
                      </div>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
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
