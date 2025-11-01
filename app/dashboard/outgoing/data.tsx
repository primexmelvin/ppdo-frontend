export interface CategoryCard {
  id: string;
  name: string;
  description: string;
  count: number;
  icon: string; // URL to icon image
}

export const outgoingCategories: CategoryCard[] = [
  {
    id: "legal-documents",
    name: "Legal Documents",
    description: "Official legal papers and contracts",
    count: 87,
    icon: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-Q2AyLFpsfle7dsgOfa3VRInvXpfrjJ.png&w=1000&q=75", // Contract
  },
  {
    id: "memo",
    name: "Memo",
    description: "Memorandums and official notices",
    count: 142,
    icon: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-szxRgzd7v8fiFe8jxVaaFW8Y3mSGcy.png&w=1000&q=75", // File Folder
  },
  {
    id: "fuel-request",
    name: "Fuel Request",
    description: "Vehicle fuel requisition documents",
    count: 53,
    icon: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-Kxv9xKKFv7t6qa6ee6DvtUeB4OkhrG.png&w=1000&q=75", // Document (placeholder - will need actual fuel icon)
  },
];
