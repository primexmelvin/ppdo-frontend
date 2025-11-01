"use client";

interface LoginEvent {
  id: string;
  user: string;
  email: string;
  timestamp: string;
  dateTime: Date;
  ipAddress: string;
  location: string;
  status: "success" | "failed" | "suspicious";
  device: string;
  browser: string;
}

interface LoginTrailProps {
  events?: LoginEvent[];
}

const mockLoginEvents: LoginEvent[] = [
  {
    id: "1",
    user: "Maria Cristina Santos",
    email: "maria.santos@tarlac.gov.ph",
    timestamp: "2 minutes ago",
    dateTime: new Date(Date.now() - 2 * 60 * 1000),
    ipAddress: "192.168.1.45",
    location: "Tarlac City, Philippines",
    status: "success",
    device: "Windows PC",
    browser: "Chrome 120",
  },
  {
    id: "2",
    user: "Juan Dela Cruz",
    email: "juan.delacruz@tarlac.gov.ph",
    timestamp: "15 minutes ago",
    dateTime: new Date(Date.now() - 15 * 60 * 1000),
    ipAddress: "192.168.1.102",
    location: "Tarlac City, Philippines",
    status: "success",
    device: "MacBook Pro",
    browser: "Safari 17",
  },
  {
    id: "3",
    user: "Ana Garcia",
    email: "ana.garcia@tarlac.gov.ph",
    timestamp: "1 hour ago",
    dateTime: new Date(Date.now() - 60 * 60 * 1000),
    ipAddress: "103.45.67.89",
    location: "Manila, Philippines",
    status: "suspicious",
    device: "Unknown Device",
    browser: "Chrome Mobile",
  },
  {
    id: "4",
    user: "Roberto Martinez",
    email: "roberto.martinez@tarlac.gov.ph",
    timestamp: "2 hours ago",
    dateTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    ipAddress: "192.168.1.78",
    location: "Tarlac City, Philippines",
    status: "success",
    device: "Windows PC",
    browser: "Edge 120",
  },
  {
    id: "5",
    user: "Unknown User",
    email: "admin@tarlac.gov.ph",
    timestamp: "3 hours ago",
    dateTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
    ipAddress: "185.220.101.45",
    location: "Unknown Location",
    status: "failed",
    device: "Unknown Device",
    browser: "Unknown",
  },
  {
    id: "6",
    user: "Sofia Torres",
    email: "sofia.torres@tarlac.gov.ph",
    timestamp: "4 hours ago",
    dateTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
    ipAddress: "192.168.1.56",
    location: "Tarlac City, Philippines",
    status: "success",
    device: "Windows PC",
    browser: "Firefox 121",
  },
  {
    id: "7",
    user: "Carlos Mendoza",
    email: "carlos.mendoza@tarlac.gov.ph",
    timestamp: "5 hours ago",
    dateTime: new Date(Date.now() - 5 * 60 * 60 * 1000),
    ipAddress: "192.168.1.34",
    location: "Tarlac City, Philippines",
    status: "success",
    device: "iPad",
    browser: "Safari Mobile",
  },
];

export function LoginTrail({ events = mockLoginEvents }: LoginTrailProps) {
  const getStatusColor = (status: LoginEvent["status"]) => {
    switch (status) {
      case "success":
        return "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/50";
      case "failed":
        return "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/50";
      case "suspicious":
        return "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900/50";
      default:
        return "bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-700";
    }
  };

  const getStatusIcon = (status: LoginEvent["status"]) => {
    switch (status) {
      case "success":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "failed":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "suspicious":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
            Login Trail
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Monitor system access and detect anomalies
          </p>
        </div>
        <button className="text-sm font-medium text-[#15803d] hover:text-[#16a34a] transition-colors dark:text-green-400 dark:hover:text-green-300">
          View All
        </button>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {events.map((event) => (
          <div
            key={event.id}
            className={`flex items-start gap-4 p-4 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors border ${
              event.status === "suspicious" || event.status === "failed"
                ? "border-yellow-200 dark:border-yellow-900/50 bg-yellow-50/50 dark:bg-yellow-950/20"
                : "border-zinc-200 dark:border-zinc-700"
            }`}
          >
            <div className={`p-2 rounded-lg border ${getStatusColor(event.status)} shrink-0`}>
              {getStatusIcon(event.status)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                    {event.user}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500 truncate">
                    {event.email}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded border capitalize shrink-0 ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="truncate">{event.timestamp}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <span className="truncate font-mono">{event.ipAddress}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="truncate">{event.device} • {event.browser}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
