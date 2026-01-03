import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ForumCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  created_at: string;
}

export interface ForumPost {
  id: string;
  user_id: string;
  category_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  author_name?: string;
  comment_count?: number;
}

export interface ForumComment {
  id: string;
  user_id: string;
  post_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  author_name?: string;
}

export const useForum = () => {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('forum_categories')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching categories:', error);
      return;
    }
    setCategories(data || []);
    setLoading(false);
  };

  const fetchPosts = async (categoryId?: string) => {
    let query = supabase
      .from('forum_posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
    
    // Fetch author names and comment counts
    const postsWithDetails = await Promise.all((data || []).map(async (post) => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('user_id', post.user_id)
        .single();
      
      const { count } = await supabase
        .from('forum_comments')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', post.id);
      
      return {
        ...post,
        author_name: profile?.display_name || 'Anonymous',
        comment_count: count || 0
      };
    }));
    
    return postsWithDetails;
  };

  const fetchPost = async (postId: string) => {
    const { data, error } = await supabase
      .from('forum_posts')
      .select('*')
      .eq('id', postId)
      .single();
    
    if (error) {
      console.error('Error fetching post:', error);
      return null;
    }
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('user_id', data.user_id)
      .single();
    
    return {
      ...data,
      author_name: profile?.display_name || 'Anonymous'
    };
  };

  const fetchComments = async (postId: string) => {
    const { data, error } = await supabase
      .from('forum_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
    
    const commentsWithAuthors = await Promise.all((data || []).map(async (comment) => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('user_id', comment.user_id)
        .single();
      
      return {
        ...comment,
        author_name: profile?.display_name || 'Anonymous'
      };
    }));
    
    return commentsWithAuthors;
  };

  const createPost = async (categoryId: string, title: string, content: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a post",
        variant: "destructive"
      });
      return null;
    }
    
    const { data, error } = await supabase
      .from('forum_posts')
      .insert({
        user_id: user.id,
        category_id: categoryId,
        title,
        content
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive"
      });
      return null;
    }
    
    toast({
      title: "Success",
      description: "Post created successfully"
    });
    
    return data;
  };

  const createComment = async (postId: string, content: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to comment",
        variant: "destructive"
      });
      return null;
    }
    
    const { data, error } = await supabase
      .from('forum_comments')
      .insert({
        user_id: user.id,
        post_id: postId,
        content
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      });
      return null;
    }
    
    toast({
      title: "Success",
      description: "Comment added"
    });
    
    return data;
  };

  const deletePost = async (postId: string) => {
    const { error } = await supabase
      .from('forum_posts')
      .delete()
      .eq('id', postId);
    
    if (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive"
      });
      return false;
    }
    
    toast({
      title: "Success",
      description: "Post deleted"
    });
    
    return true;
  };

  const deleteComment = async (commentId: string) => {
    const { error } = await supabase
      .from('forum_comments')
      .delete()
      .eq('id', commentId);
    
    if (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive"
      });
      return false;
    }
    
    toast({
      title: "Success",
      description: "Comment deleted"
    });
    
    return true;
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    fetchPosts,
    fetchPost,
    fetchComments,
    createPost,
    createComment,
    deletePost,
    deleteComment
  };
};
