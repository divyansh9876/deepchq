/** Shared popular search cards (homepage + logged-in chat). */
export type PopularSearchCard = {
  name: string;
  role: string;
  image: string;
};

export const POPULAR_SEARCH_CARDS: PopularSearchCard[] = [
  {
    name: "Elon Musk",
    role: "Entrepreneur",
    image: "https://i.pravatar.cc/120?u=elon-musk",
  },
  {
    name: "Lady Gaga",
    role: "Singer",
    image: "https://i.pravatar.cc/120?u=lady-gaga",
  },
  {
    name: "MrBeast",
    role: "YouTuber",
    image: "https://i.pravatar.cc/120?u=mrbeast",
  },
  {
    name: "Taylor Swift",
    role: "Songwriter",
    image: "https://i.pravatar.cc/120?u=taylor-swift",
  },
  {
    name: "Grant Cardone",
    role: "Investor",
    image: "https://i.pravatar.cc/120?u=grant-cardone",
  },
];
