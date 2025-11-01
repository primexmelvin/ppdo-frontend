"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
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
    <main className="min-h-[100dvh] flex items-center justify-center relative px-4 py-12 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url('https://cdn.prod.website-files.com/68a25157e0edb92947ffe4a2/68af49e2f002d2c50022786b_Story%20Image-min.avif')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
      
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/50 via-black/60 to-zinc-950/50"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-gradient-to-br from-[#16a34a]/20 via-[#16a34a]/10 to-[#16a34a]/20 rounded-3xl border border-[#16a34a]/30 p-8 sm:p-12 shadow-xl backdrop-blur-sm">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#16a34a] mb-2" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}>
              Welcome Back
            </h1>
            <p className="text-[#16a34a]/80" style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.25)" }}>
              Sign in to your account to continue
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400"
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
                className="block text-sm font-medium text-[#16a34a] mb-2"
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
                className="w-full px-4 py-3 rounded-xl border border-[#16a34a]/30 bg-[#16a34a]/10 backdrop-blur-sm text-[#16a34a] placeholder:text-[#16a34a]/50 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/50 focus:bg-[#16a34a]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="you@example.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#16a34a] mb-2"
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
                className="w-full px-4 py-3 rounded-xl border border-[#16a34a]/30 bg-[#16a34a]/10 backdrop-blur-sm text-[#16a34a] placeholder:text-[#16a34a]/50 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/50 focus:bg-[#16a34a]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="••••••••"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <a
                href="#forgot-password"
                className="text-sm text-[#16a34a]/80 hover:text-[#16a34a] transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#16a34a]/30 hover:bg-[#16a34a]/40 text-[#16a34a] font-medium transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed border border-[#16a34a]/40"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#16a34a] border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 pt-8 border-t border-[#16a34a]/30">
            <p className="text-center text-sm text-[#16a34a]/80">
              Don't have an account?{" "}
              <span className="text-[#16a34a]/60">
                Contact administrator
              </span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

