export interface FBAccount {
  id: string;
  name: string;
  username: string;
  profilePic: string;
  followers: number;
  description: string;
  isActive: boolean;
}

export const mockAccounts: FBAccount[] = [
  {
    id: "account-1",
    name: "Tarlac Provincial Government",
    username: "@tarlacgov",
    profilePic: "https://i.pravatar.cc/150?img=1",
    followers: 45230,
    description:
      "Official Facebook page of the Provincial Government of Tarlac",
    isActive: true,
  },
  {
    id: "account-2",
    name: "Tarlac Public Information Office",
    username: "@tarlacpio",
    profilePic: "https://i.pravatar.cc/150?img=5",
    followers: 28940,
    description: "Public information and updates from Tarlac Province",
    isActive: true,
  },
  {
    id: "account-3",
    name: "Tarlac Tourism Office",
    username: "@tarlactourism",
    profilePic: "https://i.pravatar.cc/150?img=9",
    followers: 15670,
    description: "Discover the beauty and attractions of Tarlac Province",
    isActive: false,
  },
];
