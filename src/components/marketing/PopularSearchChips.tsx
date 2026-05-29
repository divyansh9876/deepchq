"use client";

type Chip = { name: string; image: string };

export function PopularSearchChips({
  items,
  onSelect,
}: {
  items: Chip[];
  onSelect: (name: string) => void;
}) {
  return (
    <div className="mt-6 flex flex-wrap justify-center gap-4 md:gap-6">
      {items.map((item) => (
        <button
          key={item.name}
          type="button"
          onClick={() => onSelect(item.name)}
          className="group flex w-24 flex-col items-center gap-2"
        >
          <span className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-gray-700 ring-2 ring-transparent transition group-hover:border-blue-500 group-hover:ring-blue-500/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </span>
          <span className="text-center text-xs font-medium text-gray-300 group-hover:text-white">
            {item.name}
          </span>
        </button>
      ))}
    </div>
  );
}
