export interface Concern {
  id: string;
  trackingNumber: string;
  category:
    | "public-safety"
    | "infrastructure"
    | "environment"
    | "health-social"
    | "education"
    | "business-economy";
  title: string;
  description: string;
  submitterName: string;
  submitterEmail: string;
  submitterPhone: string;
  location: string;
  dateSubmitted: string;
  dateSubmittedRaw: Date;
  status: "pending" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  assignedDepartment: string;
  assignedTo: string;
  notes: string;
}

export interface Filters {
  category: string[];
  status: string[];
  priority: string[];
  dateFrom: string;
  dateTo: string;
}

export const categoryLabels: Record<Concern["category"], string> = {
  "public-safety": "Public Safety",
  infrastructure: "Infrastructure",
  environment: "Environment",
  "health-social": "Health & Social",
  education: "Education",
  "business-economy": "Business & Economy",
};

export function getStatusColor(status: Concern["status"]): string {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "in-progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    case "resolved":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "closed":
      return "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400";
    default:
      return "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400";
  }
}

export function getPriorityColor(priority: Concern["priority"]): string {
  switch (priority) {
    case "low":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "high":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400";
  }
}
