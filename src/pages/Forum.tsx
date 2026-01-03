import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useForum, ForumCategory, ForumPost } from '@/hooks/useForum';
import { supabase } from '@/integrations/supabase/client';
import { 
  ArrowLeft, 
  MessageSquare, 
  Compass, 
  Code, 
  Heart, 
  Palette, 
  TrendingUp, 
  GraduationCap,
  Plus,
  Clock,
  User
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { CreatePostDialog } from '@/components/forum/CreatePostDialog';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MessageSquare,
  Compass,
  Code,
  Heart,
  Palette,
  TrendingUp,
  GraduationCap
};

const Forum = () => {
  const navigate = useNavigate();
  const { categories, loading, fetchPosts } = useForum();
  const [selectedCategory, setSelectedCategory] = useState<ForumCategory | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const loadPosts = async () => {
      setLoadingPosts(true);
      const data = await fetchPosts(selectedCategory?.id);
      setPosts(data);
      setLoadingPosts(false);
    };

    loadPosts();
  }, [selectedCategory]);

  const handlePostCreated = async () => {
    setShowCreatePost(false);
    const data = await fetchPosts(selectedCategory?.id);
    setPosts(data);
  };

  const getIcon = (iconName: string | null) => {
    const Icon = iconMap[iconName || 'MessageSquare'] || MessageSquare;
    return Icon;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-serif font-bold text-primary">Community Forum</h1>
              <p className="text-sm text-muted-foreground">Discuss careers with others</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <Button onClick={() => setShowCreatePost(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                New Post
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Categories Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-accent transition-colors ${
                    !selectedCategory ? 'bg-accent' : ''
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">All Discussions</span>
                </button>
                {loading ? (
                  <div className="px-4 py-3 text-sm text-muted-foreground">Loading...</div>
                ) : (
                  categories.map((category) => {
                    const Icon = getIcon(category.icon);
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-accent transition-colors ${
                          selectedCategory?.id === category.id ? 'bg-accent' : ''
                        }`}
                      >
                        <Icon className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">{category.name}</span>
                      </button>
                    );
                  })
                )}
              </CardContent>
            </Card>

            {!isAuthenticated && (
              <Card className="mt-4">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    Sign in to join the discussion
                  </p>
                  <Link to="/auth">
                    <Button className="w-full">Sign In</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Posts List */}
          <div className="md:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {selectedCategory ? selectedCategory.name : 'All Discussions'}
              </h2>
            </div>

            {loadingPosts ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="pt-6">
                      <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No discussions yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Be the first to start a conversation!
                  </p>
                  {isAuthenticated && (
                    <Button onClick={() => setShowCreatePost(true)}>
                      Create First Post
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              posts.map((post) => (
                <Link key={post.id} to={`/forum/post/${post.id}`}>
                  <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-semibold mb-2 text-foreground hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {post.author_name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {post.comment_count} {post.comment_count === 1 ? 'reply' : 'replies'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </main>

      <CreatePostDialog
        open={showCreatePost}
        onOpenChange={setShowCreatePost}
        categories={categories}
        selectedCategory={selectedCategory}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
};

export default Forum;
