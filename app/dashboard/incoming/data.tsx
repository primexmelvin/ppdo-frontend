export interface CategoryCard {
  id: string;
  name: string;
  description: string;
  count: number;
  icon: string; // URL to icon image
}

export const incomingCategories: CategoryCard[] = [
  {
    id: "social-service",
    name: "Social Service",
    description: "Community support and welfare services",
    count: 124,
    icon: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-1sSWsMSyKdRLezddAdTAGvRoZBHCLa.png&w=1000&q=75", // Donating
  },
  {
    id: "barangay-affairs",
    name: "Barangay Affairs",
    description: "Local governance and community matters",
    count: 89,
    icon: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-D82IhWyIP8ltpbzsHH6O7jLYuRWxWG.png&w=1000&q=75", // Village
  },
  {
    id: "financial-assistance",
    name: "Financial Assistance",
    description: "Financial aid and support requests",
    count: 156,
    icon: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-IeKGYKeLd25OWlrmd5WrSsfbD7OIPA.png&w=1000&q=75", // Money
  },
  {
    id: "use-of-facilities",
    name: "Use of Facilities",
    description: "Requests for facility usage",
    count: 67,
    icon: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-iU4rmwBdlMt24UolY2WynkeolDz2nj.png&w=1000&q=75", // Building
  },
  {
    id: "use-of-vehicle",
    name: "Use of Vehicle and Ambulance",
    description: "Transportation and ambulance requests",
    count: 43,
    icon: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-AYUl8fBBUAB87V9MUkKFWYlwiYC14i.png&w=1000&q=75", // Ambulance
  },
  {
    id: "appointment-meeting",
    name: "Appointment/Meeting",
    description: "Scheduling and meeting requests",
    count: 92,
    icon: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-ij7GEZhfmzLNlLgDJVhkST8FIm5rJV.png&w=1000&q=75", // Calendar
  },
  {
    id: "other-request",
    name: "Other Request",
    description: "Miscellaneous requests and inquiries",
    count: 38,
    icon: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-BjimxRD0gb4rZBjr9jbO9LYXmOZJao.png&w=1000&q=75", // Document
  },
];
