"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "../contexts/SidebarContext";
import { useAccentColor } from "../contexts/AccentColorContext";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  navItems?: NavItem[];
}

const defaultNavItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    name: "Incoming",
    href: "/dashboard/incoming",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
        />
      </svg>
    ),
  },
  {
    name: "Outgoing",
    href: "/dashboard/outgoing",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"
        />
      </svg>
    ),
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
];

export function Sidebar({ navItems = defaultNavItems }: SidebarProps) {
  // Mobile sidebar state (for mobile menu overlay)
  const [isOpen, setIsOpen] = useState(true);
  // Desktop minimized state from context
  const { isMinimized } = useSidebar();
  const pathname = usePathname();
  const { accentColorValue } = useAccentColor();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50
          h-dvh
          bg-[#f8f8f8]/95 dark:bg-zinc-900/95 backdrop-blur-sm
          border-r border-zinc-200 dark:border-zinc-800
          transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${isMinimized ? "md:w-20" : "md:w-64"}
          w-64
          flex flex-col
        `}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-4 sm:px-6 flex items-center justify-center border-b border-zinc-200 dark:border-zinc-800 relative">
          {/* Logo and text - hidden when minimized */}
          <div
            className={`flex items-center gap-1 transition-opacity duration-300 ${
              isMinimized ? "md:opacity-0 md:absolute md:pointer-events-none" : ""
            }`}
          >
            <img
              src="/logo.png"
              alt="Logo"
              className="h-8 object-contain shrink-0"
            />
            <img
              src="/y.png"
              alt="Y Logo"
              className="h-8 object-contain shrink-0"
            />
            <div className="flex flex-col ml-1 leading-tight">
              <h2 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm leading-tight">
                PGO System
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-tight">
                Tarlac
              </p>
            </div>
          </div>
          
          {/* Logo - shown when minimized */}
          <div
            className={`hidden md:flex items-center justify-center w-full transition-opacity duration-300 ${
              isMinimized ? "opacity-100" : "opacity-0 absolute pointer-events-none"
            }`}
          >
            <img
              src="/logo.png"
              alt="Tarlac Provincial Government Logo"
              className="h-12 w-12 object-contain"
            />
          </div>

          {/* Mobile close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0 absolute right-0"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center rounded-xl
                      transition-all duration-200 group
                      ${
                        isMinimized
                          ? "md:justify-center md:px-3 md:py-3"
                          : "gap-3 px-4 py-3"
                      }
                      ${
                        isActive
                          ? "font-medium"
                          : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      }
                    `}
                    style={
                      isActive
                        ? {
                            backgroundColor: `${accentColorValue}10`,
                            color: accentColorValue,
                          }
                        : undefined
                    }
                    title={isMinimized ? item.name : undefined}
                  >
                    <span
                      className={isMinimized ? "flex-shrink-0" : ""}
                      style={isActive ? { color: accentColorValue } : undefined}
                    >
                      {item.icon}
                    </span>
                    <span
                      className={`
                        transition-all duration-300 whitespace-nowrap
                        ${isMinimized ? "md:hidden" : ""}
                      `}
                    >
                      {item.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div
          className={`p-4 border-t border-zinc-200 dark:border-zinc-800 transition-opacity duration-300 ${
            isMinimized ? "md:opacity-0 md:pointer-events-none" : ""
          }`}
        >
          <div className="px-4 py-3 rounded-xl bg-[#f8f8f8] dark:bg-zinc-800/50">
            <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100 mb-1">
              Provincial Government
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              © {new Date().getFullYear()} Tarlac
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile menu button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-[#f8f8f8] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      )}
    </>
  );
}
