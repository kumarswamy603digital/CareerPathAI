import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Compass, Mail, Lock, CheckCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Check if email is confirmed
        if (session.user.email_confirmed_at) {
          checkOnboardingStatus(session.user.id);
        } else {
          setPendingVerification(true);
          setEmail(session.user.email || '');
        }
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        if (session.user.email_confirmed_at) {
          checkOnboardingStatus(session.user.id);
        } else {
          setPendingVerification(true);
          setEmail(session.user.email || '');
        }
      }
    });

    // Check for email confirmation from URL
    const confirmed = searchParams.get('confirmed');
    if (confirmed === 'true') {
      toast.success('Email verified successfully! You can now sign in.');
    }

    return () => subscription.unsubscribe();
  }, [navigate, searchParams]);

  const checkOnboardingStatus = async (userId: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('user_id', userId)
      .maybeSingle();

    if (profile?.onboarding_completed) {
      navigate('/tree');
    } else {
      navigate('/onboarding');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = authSchema.safeParse({ email, password });
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    setLoading(true);
    const redirectUrl = `${window.location.origin}/auth?confirmed=true`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });

    if (error) {
      if (error.message.includes('already registered')) {
        toast.error('This email is already registered. Please sign in instead.');
      } else {
        toast.error(error.message);
      }
    } else if (data.user && !data.user.email_confirmed_at) {
      setPendingVerification(true);
      toast.success('Verification email sent! Please check your inbox.');
    }
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = authSchema.safeParse({ email, password });
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        toast.error('Invalid email or password. Please try again.');
      } else if (error.message.includes('Email not confirmed')) {
        setPendingVerification(true);
        toast.error('Please verify your email before signing in.');
      } else {
        toast.error(error.message);
      }
    } else if (data.user && !data.user.email_confirmed_at) {
      setPendingVerification(true);
      toast.error('Please verify your email before accessing the app.');
    }
    setLoading(false);
  };

  const handleResendVerification = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setResendingEmail(true);
    const redirectUrl = `${window.location.origin}/auth?confirmed=true`;
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: redirectUrl
      }
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Verification email sent! Please check your inbox.');
    }
    setResendingEmail(false);
  };

  const handleBackToLogin = async () => {
    await supabase.auth.signOut();
    setPendingVerification(false);
    setEmail('');
    setPassword('');
  };

  // Pending verification screen
  if (pendingVerification) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card border-border shadow-xl">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-serif">Verify Your Email</CardTitle>
            <CardDescription className="text-muted-foreground">
              We've sent a verification link to
            </CardDescription>
            <p className="font-medium text-foreground mt-2">{email}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-accent/50 rounded-lg p-4 text-center">
              <CheckCircle className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Click the link in your email to verify your account and get full access to CareerPath.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-center text-muted-foreground">
                Didn't receive the email?
              </p>
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={handleResendVerification}
                disabled={resendingEmail}
              >
                {resendingEmail ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Resend Verification Email
                  </>
                )}
              </Button>
              <Button 
                variant="ghost" 
                className="w-full gap-2"
                onClick={handleBackToLogin}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Button>
            </div>

            <div className="text-xs text-center text-muted-foreground space-y-1">
              <p>Check your spam folder if you don't see the email.</p>
              <p>The verification link expires in 24 hours.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border shadow-xl">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent mx-auto mb-4">
            <Compass className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-serif">CareerPath</CardTitle>
          <CardDescription className="text-muted-foreground">
            Discover your ideal career path
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted">
              <TabsTrigger value="signin" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Sign Up
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-foreground">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-background border-border"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-foreground">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 bg-background border-border"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-foreground">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-background border-border"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-foreground">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 bg-background border-border"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  You'll need to verify your email to access all features.
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
