import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Compass, GitBranch, Sparkles, Mic, LayoutDashboard, MessageSquare, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ThemeToggle } from '@/components/ThemeToggle';
import { InviteFriends } from '@/components/InviteFriends';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been signed out successfully"
      });
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthenticated(!!session);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {isAuthenticated && (
          <Button variant="ghost" size="icon" onClick={handleLogout} title="Sign out">
            <LogOut className="w-5 h-5" />
          </Button>
        )}
        <ThemeToggle />
      </div>
      <div className="text-center max-w-2xl mx-auto px-6">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-accent mb-6">
            <Compass className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-5xl font-serif font-bold mb-4 text-primary">
            CareerPath
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Discover your ideal career path based on your personality and interests
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-10">
          <div className="p-6 rounded-xl bg-card border border-border hover:glow-amber transition-all duration-300">
            <Mic className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-serif font-semibold mb-2 text-foreground">AI Career Advisor</h3>
            <p className="text-sm text-muted-foreground">
              Have a voice conversation to discover your ideal career
            </p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border hover:glow-amber transition-all duration-300">
            <GitBranch className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-serif font-semibold mb-2 text-foreground">Visual Career Tree</h3>
            <p className="text-sm text-muted-foreground">
              Explore 60+ careers organized in an interactive flowchart
            </p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border hover:glow-amber transition-all duration-300">
            <Sparkles className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-serif font-semibold mb-2 text-foreground">Smart Filters</h3>
            <p className="text-sm text-muted-foreground">
              Filter by personality type and interests to find your match
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">
                <Button size="lg" className="text-lg px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                  My Dashboard
                  <LayoutDashboard className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/tree">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary text-primary hover:bg-accent font-semibold">
                  Explore Careers
                  <GitBranch className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/forum">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary text-primary hover:bg-accent font-semibold">
                  Community
                  <MessageSquare className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <InviteFriends />
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button size="lg" className="text-lg px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                  Get Started
                  <Mic className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/tree">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary text-primary hover:bg-accent font-semibold">
                  Explore Careers
                  <GitBranch className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/forum">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary text-primary hover:bg-accent font-semibold">
                  Community
                  <MessageSquare className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
