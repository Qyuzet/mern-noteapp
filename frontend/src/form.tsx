// @ts-nocheck
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

import { useProductStore } from "./store/product.ts";
import { Link } from "lucide-react";

const formSchema = z.object({
  task: z.string().min(2, {
    message: "Task must be at least 2 characters.",
  }),
  priority: z
    .string()
    .refine((val) => !isNaN(Number(val)), {
      message: "Priority must be a valid number.",
    })
    .transform((val) => Number(val)),
  image: z.string().min(2, {
    message: "Image must be at least 2 characters.",
  }),
});

export function ProfileForm({
  product,
}: {
  product?: { id: string; task: string; priority: number; image: string };
}) {
  const { createProduct, updateProduct } = useProductStore();
  const { toast } = useToast();

  // 1. Define your form with default values for editing or creation.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: product
      ? {
          task: product.task,
          priority: product.priority.toString(),
          image: product.image,
        }
      : {
          task: "",
          priority: "",
          image: "",
        },
  });

  // 2. Define a submit handler for creation or update.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    if (product) {
      // Update Product
      const { success, message } = await updateProduct({
        id: product.id,
        ...values,
      });
      console.log("Success: ", success, "Message:", message);
      if (success) {
        toast({
          title: "Task Updated",
          description: "Changes have been saved.",
        });
      } else {
        alert(message); // Optional: Notify the user if something went wrong
      }
    } else {
      // Create Product
      const { success, message } = await createProduct(values);
      console.log("Success: ", success, "Message:", message);
      if (success) {
        // Reset the form fields
        form.reset({ task: "", priority: "", image: "" });
        toast({
          title: "New Product Created",
          description: "Saved in Database",
        });
      } else {
        alert(message); // Optional: Notify the user if something went wrong
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="task"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task</FormLabel>
              <FormControl>
                <Input placeholder="task" {...field} />
              </FormControl>
              <FormDescription>This is your Task.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <FormControl>
                <Input placeholder="Priority" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image Label</FormLabel>
              <FormControl>
                <Input placeholder="Image" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{product ? "Update Task" : "Create Task"}</Button>
      </form>
    </Form>
  );
}
