import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useForum, ForumPost as ForumPostType, ForumComment } from '@/hooks/useForum';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Clock, User, Trash2, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ForumPost = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { fetchPost, fetchComments, createComment, deletePost, deleteComment } = useForum();
  
  const [post, setPost] = useState<ForumPostType | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [deletePostDialog, setDeletePostDialog] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUserId(user?.id || null);
    });
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (!postId) return;
      
      setLoading(true);
      const [postData, commentsData] = await Promise.all([
        fetchPost(postId),
        fetchComments(postId)
      ]);
      
      setPost(postData);
      setComments(commentsData);
      setLoading(false);
    };

    loadData();
  }, [postId]);

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !postId) return;
    
    setSubmitting(true);
    const result = await createComment(postId, newComment.trim());
    
    if (result) {
      setNewComment('');
      const updatedComments = await fetchComments(postId);
      setComments(updatedComments);
    }
    setSubmitting(false);
  };

  const handleDeletePost = async () => {
    if (!postId) return;
    
    const success = await deletePost(postId);
    if (success) {
      navigate('/forum');
    }
    setDeletePostDialog(false);
  };

  const handleDeleteComment = async () => {
    if (!deleteCommentId || !postId) return;
    
    const success = await deleteComment(deleteCommentId);
    if (success) {
      const updatedComments = await fetchComments(postId);
      setComments(updatedComments);
    }
    setDeleteCommentId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Post not found</h2>
            <p className="text-muted-foreground mb-4">This discussion may have been deleted.</p>
            <Link to="/forum">
              <Button>Back to Forum</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPostOwner = currentUserId === post.user_id;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/forum')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-serif font-bold text-primary">Discussion</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Post */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {post.author_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
              {isPostOwner && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setDeletePostDialog(true)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
          </CardContent>
        </Card>

        {/* Comments */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            {comments.length} {comments.length === 1 ? 'Reply' : 'Replies'}
          </h2>

          {/* Comment Input */}
          {currentUserId ? (
            <Card>
              <CardContent className="pt-4">
                <Textarea
                  placeholder="Write a reply..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px] mb-3"
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSubmitComment} 
                    disabled={!newComment.trim() || submitting}
                    className="gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {submitting ? 'Sending...' : 'Reply'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center py-6">
                <p className="text-muted-foreground mb-4">Sign in to join the discussion</p>
                <Link to="/auth">
                  <Button>Sign In</Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Comments List */}
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1 font-medium text-foreground">
                      <User className="w-4 h-4" />
                      {comment.author_name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  {currentUserId === comment.user_id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => setDeleteCommentId(comment.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                <p className="text-foreground whitespace-pre-wrap">{comment.content}</p>
              </CardContent>
            </Card>
          ))}

          {comments.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No replies yet. Be the first to respond!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Delete Post Dialog */}
      <AlertDialog open={deletePostDialog} onOpenChange={setDeletePostDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your post and all its replies. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Comment Dialog */}
      <AlertDialog open={!!deleteCommentId} onOpenChange={() => setDeleteCommentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this reply?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteComment} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ForumPost;
