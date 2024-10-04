"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import useFetchCategories from "@/hooks/useFetchCategories";
import { createEvent } from "@/lib/actions/event.actions";
import { createEventSchema } from "@/schema/event.schema";
import { EventData, ResponseStatus } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { CircleX } from "lucide-react";
import Image from "next/image"; // Import the Next.js Image component
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

export default function CreateEventForm() {
  const { token } = useAuth();
  const { user } = useAuth();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [newCategory, setNewCategory] = useState("");
  const [newCategoryName, setNewCategoryName] = useState<string>("");

  const { categories, createNewCategory } = useFetchCategories(); // For storing the uploaded file

  const fileInputRef = useRef<HTMLInputElement | null>(null); // Reference for file input

  const form = useForm<z.infer<typeof createEventSchema>>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      isFree: false,
      startDateTime: new Date(),
      endDateTime: new Date(),
    },
  });

  const {
    formState: { errors },
  } = form;

  // Handle image upload and preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file); // Store the file
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string); // Set preview to file's data URL
      };
      reader.readAsDataURL(file);
    }
  };

  // Clear image preview, uploaded file, and reset file input
  const handleRemoveImage = () => {
    setImagePreview(null);
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input field
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
    if (newCategoryName.trim()) {
      await createNewCategory(newCategoryName);
      setNewCategoryName(""); // Clear input after creation
    }
  };

  async function onSubmit(values: z.infer<typeof createEventSchema>) {
    try {
      if (!token) {
        toast.error("Please login to create an event");
        return;
      }

      const newEvent: EventData = {
        ...values,
        category: JSON.parse(JSON.stringify(values.category)),
        organizer: JSON.parse(JSON.stringify(user)),
      };
      const response = await createEvent(newEvent, token);
      if (response.status === ResponseStatus.Success) {
        toast.success("Event created successfully");
        form.reset();
        setImagePreview(null); // Reset the image preview after form submission
      } else {
        toast.error(response.message || "Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("An error occurred during event creation");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 py-[4%]"
      >
        <Card>
          <CardHeader>
            <CardTitle>Create New Event</CardTitle>
            <CardDescription>Fill in the event details below</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event title" {...field} />
                  </FormControl>
                  {errors.title?.message && (
                    <FormMessage>{errors.title.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter description (optional)"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter location" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDateTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date and Time</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      value={
                        field.value
                          ? new Date(field.value).toISOString().slice(0, 16)
                          : ""
                      }
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDateTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date and Time</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      value={
                        field.value
                          ? new Date(field.value).toISOString().slice(0, 16)
                          : ""
                      }
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter event price"
                      {...field}
                    />
                  </FormControl>
                  {errors.price?.message && (
                    <FormMessage>{errors.price.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            {/* Category Dropdown */}
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={(value) =>
                  form.setValue("category", JSON.parse(value))
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={JSON.stringify(category)}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="create-new">
                    <Input
                      placeholder="Create new category"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    />
                    <Button onClick={handleCreateCategory}>Create</Button>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>Upload Image</FormLabel>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </FormItem>

            {imagePreview && (
              <FormItem>
                <FormLabel>Image Preview</FormLabel>
                <div className="relative w-fit h-fit border border-gray-300 rounded-md overflow-hidden">
                  <CircleX
                    className="absolute right-[2%] top-[2%] w-4 h-4 bg-white text-red-500 cursor-pointer"
                    onClick={handleRemoveImage} // Clear image preview and file on click
                  />
                  <Image
                    src={imagePreview}
                    alt="Image preview"
                    width={200}
                    height={200}
                    objectFit="cover"
                  />
                </div>
              </FormItem>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit">Create Event</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
