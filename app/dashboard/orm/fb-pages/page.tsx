"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAccentColor } from "../../contexts/AccentColorContext";
import { mockAccounts } from "./data";

export default function FBPagesPage() {
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
      <div className="mb-8">
        <h1
          className="text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2"
          style={{ fontFamily: "var(--font-cinzel), serif" }}
        >
          FB Pages
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Select a Facebook account to manage
        </p>
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {mockAccounts.map((account) => (
          <Link
            key={account.id}
            href={`/dashboard/orm/fb-pages/${account.id}`}
            className="
              bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6
              transition-all duration-200 cursor-pointer
              hover:shadow-lg hover:scale-[1.02]
              flex flex-col
            "
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = accentColorValue;
              e.currentTarget.style.backgroundColor = `${accentColorValue}08`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "";
              e.currentTarget.style.backgroundColor = "";
            }}
          >
            {/* Profile Picture and Account Info */}
            <div className="flex items-start gap-4 mb-4">
              <img
                src={account.profilePic}
                alt={account.name}
                className="w-16 h-16 rounded-full object-cover shrink-0 border-2"
                style={{ borderColor: accentColorValue }}
              />
              <div className="flex-1 min-w-0">
                <h3
                  className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1 truncate"
                  style={{
                    fontFamily: "var(--font-cinzel), serif",
                    color: accentColorValue,
                  }}
                >
                  {account.name}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
                  {account.username}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2">
              {account.description}
            </p>

            {/* Followers and Status */}
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-500 mb-1">
                  Followers
                </p>
                <p
                  className="text-xl font-bold"
                  style={{
                    fontFamily: "var(--font-cinzel), serif",
                    color: accentColorValue,
                  }}
                >
                  {account.followers.toLocaleString()}
                </p>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  account.isActive
                    ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400"
                    : "bg-zinc-50 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-400"
                }`}
              >
                {account.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
