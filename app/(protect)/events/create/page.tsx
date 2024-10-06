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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ROUTES } from "@/data";
import { useAuth } from "@/hooks/useAuth";
import useFetchCategories from "@/hooks/useFetchCategories";
import { createEvent } from "@/lib/actions/event.actions";
import { createEventSchema } from "@/schema/event.schema";
import { EventData, ResponseStatus } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleX } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

export default function CreateEventForm() {
  const { token } = useAuth();
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { categories, createNewCategory } = useFetchCategories();
  const [newCategoryName, setNewCategoryName] = useState<string>("");

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
    setValue,
    watch,
  } = form;

  const imagePreview = watch("imageUrl");

  // Handle image upload and convert to Base64
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue("imageUrl", reader.result as string); // Set the Base64 string in the form
      };
      reader.readAsDataURL(file);
    }
  };

  // Clear image preview and reset file input
  const handleRemoveImage = () => {
    setValue("imageUrl", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
        price: values.isFree ? "" : String(values.price),
        category: JSON.parse(JSON.stringify(values.category)),
        organizer: JSON.parse(JSON.stringify(user)),
      };

      const response = await createEvent(newEvent, token);
      if (response.status === ResponseStatus.Success) {
        toast.success("Event created successfully");
        form.reset();
        router.push(ROUTES.EVENTS);
      } else {
        toast.error(response.message || "Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("An error occurred during event creation");
    }
  }

  // Watch the isFree checkbox value
  const isFree = watch("isFree");

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
                  <FormMessage />
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
                    <Textarea
                      placeholder="Enter description (optional)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
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
                  <FormMessage />
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
                  <FormMessage />
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="w-full h-full flex items-start gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter event price"
                        {...field}
                        disabled={isFree} // Disable if isFree is checked
                        onChange={(e) => {
                          const value = parseFloat(e.target.value); // Parse the input value as a float
                          field.onChange(isNaN(value) ? undefined : value); // Set the value, handle NaN case
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slots"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tickets/ Slots</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter ticket/ slots"
                        {...field}
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10); // Parse the input value as an integer
                          field.onChange(isNaN(value) ? undefined : value); // Set the value, handle NaN case
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="ml-2">Is this event free?</FormLabel>
                </FormItem>
              )}
            />

            <div className="w-full h-full flex items-start gap-4">
              {/* Category Dropdown */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const selectedCategory = JSON.parse(value);
                        field.onChange(selectedCategory);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category._id}
                            value={JSON.stringify(category)}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* New Category Input */}
              <FormItem className="flex-1">
                <FormLabel>Add New Category</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      placeholder="Enter new category"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                  </FormControl>
                  <Button size={"sm"} onClick={handleCreateCategory}>
                    Add Category
                  </Button>
                </div>
              </FormItem>
            </div>

            <FormItem>
              <FormLabel>Upload Image</FormLabel>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {
                // Display error message if image upload fails
                errors.imageUrl?.message && (
                  <FormMessage>{errors.imageUrl.message}</FormMessage>
                )
              }
            </FormItem>

            {imagePreview && (
              <FormItem>
                <FormLabel>Image Preview</FormLabel>
                <div className="relative w-fit h-fit border border-gray-300 rounded-md overflow-hidden">
                  <CircleX
                    className="rounded-full absolute right-[2%] top-[2%] w-4 h-4 bg-white text-red-500 cursor-pointer"
                    onClick={handleRemoveImage}
                  />
                  <Image
                    src={imagePreview}
                    alt="Image preview"
                    width={200}
                    height={200}
                    className="object-cover"
                  />
                </div>
              </FormItem>
            )}
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full">
              Create Event
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
