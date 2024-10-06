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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROUTES } from "@/data";
import { useAuth } from "@/hooks/useAuth";
import useFetchUsers from "@/hooks/useFetchUsers";
import { createUser } from "@/lib/actions/user.actions";
import { userSchema } from "@/schema/user.schema";
import { ResponseStatus, UserRole } from "@/types"; // Assuming you have an enum for roles
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

export default function CreateUserForm({
  setDialogContent,
}: {
  setDialogContent: Dispatch<SetStateAction<ReactNode>>;
}) {
  const router = useRouter();
  const { token } = useAuth();
  const { fetchUsers } = useFetchUsers({ all: true, nonAdmin: false });

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: UserRole.User, // Default role
      isActive: true, // Default active status
    },
  });

  const {
    formState: { errors },
  } = form;

  // Handle form submission
  async function onSubmit(values: z.infer<typeof userSchema>) {
    try {
      if (!token) {
        toast.error("Please login to create a user");
        router.push(ROUTES.LOGIN);
        return;
      }

      const response = await createUser(values, token);
      if (response.status === ResponseStatus.Success) {
        toast.success("User created successfully");
        await fetchUsers();
        form.reset();
        setDialogContent(null);
      } else {
        toast.error(response.message || "Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("An error occurred during user creation");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New User</CardTitle>
            <CardDescription>Fill in the user details below</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email" {...field} />
                  </FormControl>
                  {errors.email?.message && (
                    <FormMessage>{errors.email.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username" {...field} />
                  </FormControl>
                  {errors.username?.message && (
                    <FormMessage>{errors.username.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter first name" {...field} />
                  </FormControl>
                  {errors.firstName?.message && (
                    <FormMessage>{errors.firstName.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter last name" {...field} />
                  </FormControl>
                  {errors.lastName?.message && (
                    <FormMessage>{errors.lastName.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      {...field}
                    />
                  </FormControl>
                  {errors.password?.message && (
                    <FormMessage>{errors.password.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={UserRole.User}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={UserRole.User}>User</SelectItem>
                        <SelectItem value={UserRole.Admin}>Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {errors.role?.message && (
                    <FormMessage>{errors.role.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Create User
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
