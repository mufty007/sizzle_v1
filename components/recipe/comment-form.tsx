"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { StarRating } from "./star-rating";
import { Comment } from "@/lib/types/recipe";
import { User } from "@/lib/auth/types";

const commentSchema = z.object({
  content: z.string().min(3, "Comment must be at least 3 characters"),
  rating: z.number().min(1).max(5),
});

type CommentFormData = z.infer<typeof commentSchema>;

interface CommentFormProps {
  recipeId: string;
  user: User;
  onSuccess: (comment: Comment) => void;
}

export function CommentForm({ recipeId, user, onSuccess }: CommentFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
      rating: 5,
    },
  });

  async function onSubmit(data: CommentFormData) {
    try {
      setIsSubmitting(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newComment: Comment = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        username: user.username,
        content: data.content,
        rating: data.rating,
        createdAt: new Date().toISOString(),
      };

      onSuccess(newComment);
      
      toast({
        title: "Comment posted",
        description: "Your comment has been added successfully",
      });
      
      form.reset();
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <StarRating value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Share your thoughts about this recipe..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Posting..." : "Post Comment"}
        </Button>
      </form>
    </Form>
  );
}