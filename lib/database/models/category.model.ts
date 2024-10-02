import { ICategory } from "@/types";
import { Schema, model, models } from "mongoose";

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true },
});

const Category = models.Category || model("Category", CategorySchema);

export default Category;
