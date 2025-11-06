"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/app/dashboard/components/ThemeToggle";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // TODO: Replace with actual API call to your backend
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Placeholder validation
    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    // Simulate API call - successful login
    setIsLoading(false);

    // Store mock session (replace with proper auth)
    localStorage.setItem("authenticated", "true");
    localStorage.setItem("userEmail", email);

    // Redirect to dashboard
    router.push("/dashboard");
  }

  return (
    <main
      className="min-h-dvh flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden"
      style={{
        backgroundImage: `url('/b1.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-linear-to-br from-black/50 via-black/60 to-black/50"></div>

      {/* Container */}
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden relative z-20">
        {/* Left Column - Image */}
        <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-white dark:bg-zinc-900 flex-col items-start p-8">
          {/* Logos */}
          <div className="flex items-center gap-2 mb-8 w-full">
            <img src="/logo.png" alt="Logo" className="h-12 object-contain" />
            <img src="/y.png" alt="Y Logo" className="h-12 object-contain" />
          </div>
          <div className="shrink-0 mb-1 w-full flex justify-center relative">
            {/* Floating elements around the image */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Top Left - Document Icon */}
              <div className="absolute top-8 left-8 w-8 h-8 opacity-20 dark:opacity-10 animate-float-slow">
                <svg
                  className="w-full h-full text-zinc-700 dark:text-zinc-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>

              {/* Top Right - Star Icon */}
              <div className="absolute top-6 right-6 w-10 h-10 opacity-20 dark:opacity-10 animate-float-medium">
                <svg
                  className="w-full h-full text-zinc-700 dark:text-zinc-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>

              {/* Bottom Left - Shield Icon */}
              <div className="absolute bottom-8 left-6 w-9 h-9 opacity-20 dark:opacity-10 animate-float-slow-delayed">
                <svg
                  className="w-full h-full text-zinc-700 dark:text-zinc-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>

              {/* Bottom Right - Building Icon */}
              <div className="absolute bottom-6 right-8 w-8 h-8 opacity-20 dark:opacity-10 animate-float-medium-delayed">
                <svg
                  className="w-full h-full text-zinc-700 dark:text-zinc-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>

              {/* Left Middle - Circle */}
              <div className="absolute top-1/2 left-4 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-zinc-400 dark:border-zinc-600 opacity-30 dark:opacity-20 animate-float-slow"></div>

              {/* Right Middle - Circle */}
              <div className="absolute top-1/2 right-4 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-zinc-400 dark:border-zinc-600 opacity-30 dark:opacity-20 animate-float-medium"></div>
            </div>

            <div className="relative z-10 depth-of-field-container">
              <img
                src="/cy (2).png"
                alt="Profile"
                className="max-w-full max-h-[400px] object-contain relative z-10"
                style={{
                  filter: "drop-shadow(0 25px 50px rgba(0, 0, 0, 0.15))",
                }}
              />
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center px-6">
            <div className="text-center">
              <blockquote className="text-xl md:text-2xl font-medium text-zinc-700 dark:text-zinc-300 mb-4 italic">
                "Building a better tomorrow for Tarlac, one system at a time."
              </blockquote>
              <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400">
                — Gov. Christian Yap
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Login Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8 md:p-12 lg:p-16 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm relative">
          {/* Theme Toggle - Top Right */}
          <div className="absolute top-4 right-4 md:top-6 md:right-6">
            <ThemeToggle />
          </div>
          <div className="w-full max-w-md">
            {/* Logo/Title */}
            <div className="text-center md:text-left mb-8 md:mb-12">
              <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                Sign In
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400">
                Enter your credentials to continue
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div
                role="alert"
                className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700"
              >
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#15803d] focus:border-[#15803d] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="you@example.com"
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#15803d] focus:border-[#15803d] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <a
                  href="#forgot-password"
                  className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#15803d] hover:bg-[#16a34a] text-white font-medium transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
              >
                {/* Progress Bar Overlay */}
                {isLoading && (
                  <div className="absolute bg-[#16a34a] animate-progress-bar"></div>
                )}
                <span className="relative z-10">
                  {isLoading ? "Authenticating" : "Sign In"}
                </span>
              </button>
            </form>

            {/* Divider */}
            <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-700">
              <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                Don't have an account?{" "}
                <span className="text-zinc-400 dark:text-zinc-500">
                  Contact administrator
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
