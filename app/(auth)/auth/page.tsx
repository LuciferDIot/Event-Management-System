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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { logInUser } from "@/lib/actions/user.actions";
import { handleError } from "@/lib/utils";
import { loginSchema } from "@/schema/login.schema";
import { ResponseStatus } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

export default function ProfileForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      isEmail: false,
      email: "",
      username: "",
      password: "",
    },
  });

  const {
    formState: { errors },
  } = form;

  // Handle the form submission
  async function onSubmit(values: z.infer<typeof loginSchema>) {
    const loginField = values.isEmail ? values.email : values.username;
    try {
      if (!loginField) throw new Error("Please enter your email or username.");
      const response = await logInUser(loginField, values.password);

      if (response.status === ResponseStatus.Success) {
        if (response.field) {
          localStorage.setItem("token", response.field);
        } else {
          throw new Error("Token is undefined.");
        }
        toast.success(response.message);
        router.push("/");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      const errorRecreate = handleError(error);

      if (errorRecreate.message) {
        toast.error(errorRecreate.message);
      } else {
        toast.error("An error occurred during login.");
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>Login</span>
              <Image
                src="/images/logo.svg"
                alt="Event Sync"
                width={120}
                height={24}
              />
            </CardTitle>
            <CardDescription>
              Login using your email or username.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Tabs
              defaultValue="username"
              className="w-[600px] flex flex-col gap-4"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="username"
                  onClick={() => form.setValue("isEmail", false)}
                >
                  Username
                </TabsTrigger>
                <TabsTrigger
                  value="email"
                  onClick={() => form.setValue("isEmail", true)}
                >
                  Email
                </TabsTrigger>
              </TabsList>

              <TabsContent value="username">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your username" {...field} />
                      </FormControl>
                      {errors.username?.message && (
                        <FormMessage>
                          {errors.username.message ?? ""}
                        </FormMessage>
                      )}
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="email">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      {errors.email?.message && (
                        <FormMessage>{errors.email.message ?? ""}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />
              </TabsContent>

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    {errors.password?.message && (
                      <FormMessage>{errors.password.message ?? ""}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button type="submit">Login</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
