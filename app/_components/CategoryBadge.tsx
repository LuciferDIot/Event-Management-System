// src/components/CategoryBadge.tsx
import { Badge } from "@/components/ui/badge";
import useFetchCategories from "@/hooks/useFetchCategories";

type Props = {
  category: { _id: string; name: string };
};
// Predefined color palette
const colors = [
  "bg-blue-100 text-blue-600",
  "bg-green-100 text-green-600",
  "bg-yellow-100 text-yellow-600",
  "bg-purple-100 text-purple-600",
  "bg-red-100 text-red-600",
  "bg-pink-100 textpink-600",
  "bg-indigo-100 textindigo-600",
  "bg-teal-100 text-teal-600",
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
    <Badge className={`text-xs px-3 py-1 rounded-md ${categoryColorClass}`}>
      {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
    </Badge>
  );
}

export default CategoryBadge;
