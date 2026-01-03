import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useCareerShortlist } from '@/hooks/useCareerShortlist';
import { useCareerHistory } from '@/hooks/useCareerHistory';
import { careerDetails } from '@/data/careerDetails';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { 
  Compass, 
  Heart, 
  Clock, 
  TrendingUp, 
  Briefcase, 
  LogOut, 
  GitBranch,
  Target,
  Sparkles,
  ChevronRight,
  Trash2,
  Eye,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const { shortlist, loading: shortlistLoading, removeFromShortlist } = useCareerShortlist();
  const { history, loading: historyLoading, clearHistory, uniqueCareersViewed, totalViews } = useCareerHistory();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      setProfile(data);
    };

    fetchProfile();
  }, [user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const totalCareers = Object.keys(careerDetails).length;
  const explorationProgress = Math.round((uniqueCareersViewed.length / totalCareers) * 100);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Compass className="w-12 h-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Compass className="w-8 h-8 text-primary" />
            <span className="text-xl font-serif font-bold text-primary">CareerPath</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/tree">
              <Button variant="outline" size="sm" className="gap-2">
                <GitBranch className="w-4 h-4" />
                Explore Careers
              </Button>
            </Link>
            <Link to="/settings">
              <Button variant="ghost" size="sm" className="gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2 text-muted-foreground">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
            Welcome back{profile?.recommended_career ? `, future ${profile.recommended_career}` : ''}!
          </h1>
          <p className="text-muted-foreground">
            Track your career exploration journey and saved opportunities.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-accent/50 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{shortlist.length}</p>
                  <p className="text-sm text-muted-foreground">Saved Careers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500/10 to-accent/50 border-emerald-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <Eye className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{uniqueCareersViewed.length}</p>
                  <p className="text-sm text-muted-foreground">Careers Explored</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/10 to-accent/50 border-amber-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalViews}</p>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-accent/50 border-purple-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{explorationProgress}%</p>
                  <p className="text-sm text-muted-foreground">Explored</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Exploration Progress */}
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Career Exploration Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  You've explored {uniqueCareersViewed.length} of {totalCareers} careers
                </span>
                <span className="font-medium text-foreground">{explorationProgress}%</span>
              </div>
              <Progress value={explorationProgress} className="h-2" />
              {explorationProgress < 50 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Keep exploring! Discover more careers to find your perfect match.
                </p>
              )}
              {explorationProgress >= 50 && explorationProgress < 100 && (
                <p className="text-xs text-emerald-600 mt-2">
                  Great progress! You're on your way to becoming a career exploration expert.
                </p>
              )}
              {explorationProgress === 100 && (
                <p className="text-xs text-primary mt-2">
                  🎉 Amazing! You've explored every career in our database!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Saved Careers */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Saved Careers
              </CardTitle>
              {shortlist.length > 0 && (
                <Badge variant="secondary">{shortlist.length}</Badge>
              )}
            </CardHeader>
            <CardContent>
              {shortlistLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : shortlist.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">No saved careers yet</p>
                  <Link to="/tree">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Sparkles className="w-4 h-4" />
                      Start Exploring
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {shortlist.map((careerName) => {
                    const career = careerDetails[careerName];
                    return (
                      <div
                        key={careerName}
                        className="flex items-center justify-between p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors group"
                      >
                        <div className="flex-1 min-w-0">
                          <Link to={`/tree?career=${encodeURIComponent(careerName)}`}>
                            <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                              {careerName}
                            </p>
                          </Link>
                          {career && (
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className={cn(
                                "text-[10px]",
                                career.jobOutlook === 'High Demand' && "bg-green-100 text-green-700 border-green-200",
                                career.jobOutlook === 'Growing' && "bg-emerald-100 text-emerald-700 border-emerald-200",
                                career.jobOutlook === 'Stable' && "bg-amber-100 text-amber-700 border-amber-200",
                                career.jobOutlook === 'Declining' && "bg-red-100 text-red-700 border-red-200"
                              )}>
                                {career.jobOutlook}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                ${(career.salaryRange.min / 1000).toFixed(0)}k - ${(career.salaryRange.max / 1000).toFixed(0)}k
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Link to={`/tree?career=${encodeURIComponent(careerName)}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-red-500"
                            onClick={() => removeFromShortlist(careerName)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                Recent Activity
              </CardTitle>
              {history.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-red-500"
                  onClick={clearHistory}
                >
                  Clear History
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {historyLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">No viewing history yet</p>
                  <Link to="/tree">
                    <Button variant="outline" size="sm" className="gap-2">
                      <GitBranch className="w-4 h-4" />
                      Explore Career Tree
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {history.slice(0, 20).map((item) => (
                    <Link
                      key={item.id}
                      to={`/tree?career=${encodeURIComponent(item.career_name)}`}
                      className="flex items-center justify-between p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <Briefcase className="w-4 h-4 text-primary/60" />
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {item.career_name}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(item.viewed_at), { addSuffix: true })}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Profile Summary */}
        {profile && (profile.personality?.length > 0 || profile.interests?.length > 0) && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.personality?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Personality Types</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.personality.map((type: string) => (
                        <Badge key={type} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {profile.interests?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Interests</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest: string) => (
                        <Badge key={interest} variant="outline">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {profile.recommended_career && (
                <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-accent/50 border border-primary/20">
                  <p className="text-sm text-muted-foreground">Recommended Career</p>
                  <p className="text-lg font-semibold text-foreground">{profile.recommended_career}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
