"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Comment } from "@/lib/types/recipe";
import { formatDate } from "@/lib/utils";
import { CommentForm } from "./comment-form";
import { useAuth } from "@/lib/auth/context";
import Link from "next/link";

interface RecipeCommentsProps {
  comments: Comment[];
  recipeId: string;
}

export function RecipeComments({ comments: initialComments, recipeId }: RecipeCommentsProps) {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState(initialComments);

  const handleCommentSuccess = (newComment: Comment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Comments</h2>

      {isAuthenticated && user ? (
        <div className="mb-8">
          <CommentForm
            recipeId={recipeId}
            user={user}
            onSuccess={handleCommentSuccess}
          />
        </div>
      ) : (
        <Card className="p-6 mb-8 text-center bg-muted/50">
          <p className="text-muted-foreground">
            Please{" "}
            <Link 
              href={`/login?redirectTo=${encodeURIComponent(window.location.pathname)}`}
              className="text-primary hover:underline"
            >
              sign in
            </Link>{" "}
            to leave a comment
          </p>
        </Card>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <Card key={comment.id} className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">{comment.username}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(comment.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="text-sm font-medium">{comment.rating}</span>
              </div>
            </div>
            <p className="mt-3 text-muted-foreground">{comment.content}</p>
          </Card>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
}