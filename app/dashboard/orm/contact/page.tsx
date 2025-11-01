"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ContactPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

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
          Contact
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Manage contact information and communications
        </p>
      </div>

      {/* Placeholder Content */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8">
        <p className="text-center text-zinc-500 dark:text-zinc-400">
          Contact management content coming soon...
        </p>
      </div>
    </>
  );
}
