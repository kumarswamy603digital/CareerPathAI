import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { careerDetails } from '@/data/careerDetails';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Compass, 
  Briefcase, 
  Sparkles, 
  Heart,
  User,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';

interface PublicProfileData {
  display_name: string | null;
  bio: string | null;
  personality: string[] | null;
  interests: string[] | null;
  recommended_career: string | null;
}

const PublicProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const [profile, setProfile] = useState<PublicProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!slug) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('display_name, bio, personality, interests, recommended_career')
        .eq('public_slug', slug)
        .eq('is_public', true)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Compass className="w-8 h-8 text-primary" />
              <span className="text-xl font-serif font-bold text-primary">CareerPath</span>
            </Link>
          </div>
        </header>
        <main className="container mx-auto px-4 py-12 max-w-2xl">
          <div className="text-center mb-8">
            <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
            <Skeleton className="h-8 w-48 mx-auto mb-2" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
          <Skeleton className="h-40 w-full mb-6" />
          <Skeleton className="h-32 w-full" />
        </main>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
            Profile Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            This profile doesn't exist or is not public.
          </p>
          <Link to="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const careerInfo = profile?.recommended_career 
    ? careerDetails[profile.recommended_career] 
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Compass className="w-8 h-8 text-primary" />
            <span className="text-xl font-serif font-bold text-primary">CareerPath</span>
          </Link>
          <Link to="/auth">
            <Button variant="outline" size="sm">
              Join CareerPath
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Profile Header */}
        <div className="text-center mb-10">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
            {profile?.display_name || 'Career Explorer'}
          </h1>
          {profile?.bio && (
            <p className="text-muted-foreground max-w-md mx-auto">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Recommended Career */}
        {profile?.recommended_career && careerInfo && (
          <Card className="mb-6 bg-gradient-to-br from-primary/5 to-accent/30 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Briefcase className="w-5 h-5 text-primary" />
                Career Match
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {profile.recommended_career}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    {careerInfo.description}
                  </p>
                  <Link to={`/tree?career=${encodeURIComponent(profile.recommended_career)}`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      View Career Details
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Personality Traits */}
        {profile?.personality && profile.personality.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Heart className="w-5 h-5 text-primary" />
                Personality Traits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.personality.map((trait) => (
                  <Badge key={trait} variant="secondary" className="text-sm py-1 px-3">
                    {trait}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Interests */}
        {profile?.interests && profile.interests.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5 text-primary" />
                Career Interests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest) => (
                  <Badge key={interest} variant="outline" className="text-sm py-1 px-3">
                    {interest}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* CTA */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="py-6 text-center">
            <h3 className="font-semibold text-lg mb-2">Discover Your Career Path</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Take the AI-powered career assessment and find your perfect match.
            </p>
            <Link to="/auth">
              <Button className="gap-2">
                <Compass className="w-4 h-4" />
                Get Started Free
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PublicProfile;
