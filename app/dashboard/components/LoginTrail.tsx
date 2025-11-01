"use client";

interface LoginActivity {
  id: string;
  user: string;
  email: string;
  timestamp: string;
  ipAddress: string;
  status: "success" | "failed";
  location?: string;
}

interface LoginTrailProps {
  activities?: LoginActivity[];
}

const mockActivities: LoginActivity[] = [
  {
    id: "1",
    user: "Gov. Christian Yap",
    email: "governor@tarlac.gov.ph",
    timestamp: "2 minutes ago",
    ipAddress: "192.168.1.45",
    status: "success",
    location: "Capitol Building",
  },
  {
    id: "2",
    user: "Maria Santos",
    email: "maria.santos@tarlac.gov.ph",
    timestamp: "15 minutes ago",
    ipAddress: "192.168.1.32",
    status: "success",
    location: "IT Department",
  },
  {
    id: "3",
    user: "John Reyes",
    email: "john.reyes@tarlac.gov.ph",
    timestamp: "1 hour ago",
    ipAddress: "192.168.1.28",
    status: "success",
    location: "Administration",
  },
  {
    id: "4",
    user: "admin@tarlac.gov.ph",
    email: "admin@tarlac.gov.ph",
    timestamp: "2 hours ago",
    ipAddress: "203.0.113.42",
    status: "failed",
    location: "External",
  },
  {
    id: "5",
    user: "Anna Cruz",
    email: "anna.cruz@tarlac.gov.ph",
    timestamp: "3 hours ago",
    ipAddress: "192.168.1.15",
    status: "success",
    location: "Records Office",
  },
];

export function LoginTrail({ activities = mockActivities }: LoginTrailProps) {
  return (
    <div className="bg-[#f8f8f8] dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
            Login Activity
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Recent authentication attempts
          </p>
        </div>
        <button className="text-sm font-medium text-[#15803d] hover:text-[#16a34a] transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 p-3 rounded-lg hover:bg-white dark:hover:bg-zinc-800/50 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
          >
            <div
              className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                activity.status === "success"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                    {activity.user}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500 truncate">
                    {activity.email}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded ${
                    activity.status === "success"
                      ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400"
                      : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"
                  }`}
                >
                  {activity.status === "success" ? "Success" : "Failed"}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-500 mt-2">
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {activity.timestamp}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {activity.location || activity.ipAddress}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

