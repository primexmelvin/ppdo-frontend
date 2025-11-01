export interface Document {
  id: string;
  documentNumber: string;
  title: string;
  requester: string;
  dateSubmitted: string;
  dateSubmittedRaw: Date;
  status: "pending" | "in-progress" | "completed" | "rejected";
  priority: "low" | "medium" | "high";
}

export interface DocumentFilters {
  status: string[];
  priority: string[];
  dateFrom: string;
  dateTo: string;
}
