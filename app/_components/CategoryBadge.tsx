// src/components/CategoryBadge.tsx
import { Badge } from "@/components/ui/badge";
import useFetchCategories from "@/hooks/useFetchCategories";

type Props = {
  category: { _id: string; name: string };
};
// Predefined color palette
const colors = [
  "bg-blue-500 text-white",
  "bg-green-500 text-white",
  "bg-yellow-500 text-black",
  "bg-purple-500 text-white",
  "bg-red-500 text-white",
  "bg-pink-500 text-white",
  "bg-indigo-500 text-white",
  "bg-teal-500 text-white",
];

// Function to get color based on index
const getColorForCategory = (index: number) => {
  return colors[index % colors.length];
};

function CategoryBadge({ category }: Props) {
  const { categories } = useFetchCategories();
  const index = categories.findIndex((c) => c._id === category._id);
  const categoryColorClass =
    index !== -1 ? getColorForCategory(index) : "bg-gray-500 text-white"; // Default color

  return (
    <Badge
      className={`text-sm font-semibold px-3 py-1 rounded-md ${categoryColorClass}`}
    >
      {category.name}
    </Badge>
  );
}

export default CategoryBadge;
