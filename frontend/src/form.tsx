// @ts-nocheck
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ListTodo,
  Image as ImageIcon,
  AlertTriangle,
} from "lucide-react";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useProductStore } from "./store/product.ts";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  task: z.string().min(2, {
    message: "Task must be at least 2 characters.",
  }),
  priority: z
    .string()
    .refine((val) => !isNaN(Number(val)), {
      message: "Priority must be a valid number.",
    })
    .refine((val) => Number(val) >= 1 && Number(val) <= 5, {
      message: "Priority must be between 1 (lowest) and 5 (highest).",
    })
    .transform((val) => Number(val)),
  image: z.string().min(2, {
    message: "Image URL must be at least 2 characters.",
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
          priority: "3",
          image: "",
        },
  });

  // 2. Define a submit handler for creation or update.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (product) {
      // Update Product
      const { success, message } = await updateProduct({
        id: product.id,
        ...values,
      });
      if (success) {
        toast({
          title: "Task Updated",
          description: "Your changes have been saved successfully.",
          icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
        });
      } else {
        toast({
          title: "Update Failed",
          description: message || "There was an error updating your task.",
          variant: "destructive",
          icon: <AlertTriangle className="h-4 w-4" />,
        });
      }
    } else {
      // Create Product
      const { success, message } = await createProduct(values);
      if (success) {
        // Reset the form fields
        form.reset({ task: "", priority: "3", image: "" });
        toast({
          title: "Task Created",
          description: "Your new task has been saved to the database.",
          icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
        });
      } else {
        toast({
          title: "Creation Failed",
          description: message || "There was an error creating your task.",
          variant: "destructive",
          icon: <AlertTriangle className="h-4 w-4" />,
        });
      }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300 },
    },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Card className="w-full max-w-md mx-auto shadow-md">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="text-xl text-blue-800">
            {product ? "Update Task" : "Create New Task"}
          </CardTitle>
          <CardDescription>
            {product
              ? "Make changes to your existing task"
              : "Add a new task to your list"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="task"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <ListTodo className="h-4 w-4 text-blue-600" /> Task Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter task name"
                          {...field}
                          className="border-blue-200 focus:border-blue-400"
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
                        Provide a clear and descriptive name for your task.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />{" "}
                        Priority Level
                      </FormLabel>
                      <FormControl>
                        <div>
                          <Input
                            type="range"
                            min="1"
                            max="5"
                            step="1"
                            {...field}
                            className="w-full accent-blue-600"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Low (1)</span>
                            <span>Medium (3)</span>
                            <span>High (5)</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500 mt-2">
                        Current value: {field.value} -{" "}
                        {field.value <= 2
                          ? "Low"
                          : field.value <= 4
                          ? "Medium"
                          : "High"}{" "}
                        priority
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-purple-600" /> Image
                        URL
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter image URL"
                          {...field}
                          className="border-blue-200 focus:border-blue-400"
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
                        Provide a URL for an image that represents this task.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <Separator className="my-4" />

              <motion.div variants={itemVariants} className="pt-2">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  {product ? "Update Task" : "Create Task"}
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
