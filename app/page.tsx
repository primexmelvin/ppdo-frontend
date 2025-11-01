"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <main className="min-h-dvh bg-white flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Column - Image/Branding */}
        <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('/b1.jpg')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <div className="absolute inset-0 bg-linear-to-br from-black/40 to-black/20"></div>
          <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
              Welcome Back
            </h2>
            <p className="text-lg md:text-xl text-center text-white/90 max-w-md">
              Access your dashboard and manage all systems from one place
            </p>
          </div>
        </div>

        {/* Right Column - Login Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8 md:p-12 lg:p-16 bg-white">
          <div className="w-full max-w-md">
            {/* Logo/Title - Mobile */}
            <div className="text-center md:text-left mb-8 md:mb-12">
              <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-2">
                Sign In
              </h1>
              <p className="text-zinc-600">
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
                  className="block text-sm font-medium text-zinc-900 mb-2"
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
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="you@example.com"
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-zinc-900 mb-2"
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
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <a
                  href="#forgot-password"
                  className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-medium transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-8 pt-8 border-t border-zinc-200">
              <p className="text-center text-sm text-zinc-600">
                Don't have an account?{" "}
                <span className="text-zinc-400">Contact administrator</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
