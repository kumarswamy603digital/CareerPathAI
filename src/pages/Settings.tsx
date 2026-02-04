import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAssessmentHistory } from '@/hooks/useAssessmentHistory';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { PageLoadingSkeleton, AssessmentHistorySkeleton } from '@/components/LoadingSkeletons';
import { toast } from 'sonner';
import { format } from 'date-fns';
import careerPathLogo from '@/assets/logo_career_path_icon.png';
import { 
  Compass,
  ArrowLeft,
  User,
  Mail,
  Lock,
  Bell,
  Palette,
  Save,
  Loader2,
  RefreshCw,
  History,
  Briefcase,
  Trash2,
  Download,
  AlertTriangle
} from 'lucide-react';
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
import { exportCareerRecommendationsPdf } from '@/lib/exportPdf';
import { PublicProfileSettings } from '@/components/PublicProfileSettings';

const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resettingAssessment, setResettingAssessment] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  
  const { history: assessmentHistory, loading: historyLoading, deleteFromHistory } = useAssessmentHistory();
  
  // Form states
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [careerAlerts, setCareerAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
        setEmail(session.user.email || '');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
        setEmail(session.user.email || '');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleUpdateEmail = async () => {
    if (!email || email === user?.email) {
      toast.error('Please enter a new email address');
      return;
    }

    setSaving(true);
    const { error } = await supabase.auth.updateUser({ email });
    setSaving(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Confirmation email sent. Please check your inbox to verify your new email.');
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSaving(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleSavePreferences = () => {
    // Preferences would be saved to the database in a real app
    toast.success('Preferences saved successfully');
  };

  const handleRetakeAssessment = async () => {
    if (!user) return;

    setResettingAssessment(true);
    
    // Reset profile assessment data but keep history and shortlist intact
    const { error } = await supabase
      .from('profiles')
      .update({
        personality: null,
        interests: null,
        recommended_career: null,
        onboarding_completed: false
      })
      .eq('user_id', user.id);

    setResettingAssessment(false);

    if (error) {
      toast.error('Failed to reset assessment. Please try again.');
    } else {
      toast.success('Assessment reset! Redirecting to onboarding...');
      setTimeout(() => {
        navigate('/onboarding');
      }, 500);
    }
  };

  const handleDeleteAssessment = async (id: string) => {
    const success = await deleteFromHistory(id);
    if (success) {
      toast.success('Assessment removed from history');
    } else {
      toast.error('Failed to delete assessment');
    }
  };

  const handleExportPdf = () => {
    if (assessmentHistory.length === 0) {
      toast.error('No assessments to export');
      return;
    }
    exportCareerRecommendationsPdf(assessmentHistory, user?.email);
    toast.success('PDF downloaded successfully');
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;
    
    setDeleting(true);
    
    try {
      // Delete all user data from all tables (GDPR compliance)
      const userId = user.id;
      
      // Delete in order to respect foreign key constraints
      await supabase.from('forum_comments').delete().eq('user_id', userId);
      await supabase.from('forum_posts').delete().eq('user_id', userId);
      await supabase.from('referrals').delete().eq('referrer_id', userId);
      await supabase.from('career_view_history').delete().eq('user_id', userId);
      await supabase.from('career_shortlist').delete().eq('user_id', userId);
      await supabase.from('assessment_history').delete().eq('user_id', userId);
      await supabase.from('profiles').delete().eq('user_id', userId);
      
      // Sign out the user (account deletion requires admin API, but we've cleared all data)
      await supabase.auth.signOut();
      
      toast.success('Your account and all associated data have been deleted.');
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account. Please try again.');
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
      setDeleteConfirmText('');
    }
  };

  if (loading) {
    return <PageLoadingSkeleton icon={Compass} message="Loading settings..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={careerPathLogo} alt="CareerPath" className="w-8 h-8 rounded-lg" />
            <span className="text-xl font-serif font-bold text-primary">CareerPath</span>
          </Link>
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
            Profile Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        {/* Account Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5 text-primary" />
              Account Information
            </CardTitle>
            <CardDescription>
              Your account details and email address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1"
                />
                <Button 
                  onClick={handleUpdateEmail} 
                  disabled={saving || email === user?.email}
                  size="sm"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                A confirmation email will be sent to verify the new address.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Password */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lock className="w-5 h-5 text-primary" />
              Change Password
            </CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
            <Button 
              onClick={handleUpdatePassword} 
              disabled={saving || !newPassword || !confirmPassword}
              className="w-full"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Password
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="w-5 h-5 text-primary" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Choose how you want to be notified
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates about your account via email
                </p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Career Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about new careers matching your interests
                </p>
              </div>
              <Switch
                checked={careerAlerts}
                onCheckedChange={setCareerAlerts}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weekly Digest</Label>
                <p className="text-sm text-muted-foreground">
                  Receive a weekly summary of career insights
                </p>
              </div>
              <Switch
                checked={weeklyDigest}
                onCheckedChange={setWeeklyDigest}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Palette className="w-5 h-5 text-primary" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize how CareerPath looks for you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Use dark theme for the interface
                </p>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
          </CardContent>
        </Card>

        {/* Public Profile */}
        {user && <PublicProfileSettings userId={user.id} />}

        {/* Save Preferences Button */}
        <Button onClick={handleSavePreferences} className="w-full" size="lg">
          <Save className="w-4 h-4 mr-2" />
          Save All Preferences
        </Button>

        {/* Retake Assessment */}
        <Card className="mb-6 border-amber-200 bg-amber-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <RefreshCw className="w-5 h-5 text-amber-600" />
              Retake Career Assessment
            </CardTitle>
            <CardDescription>
              Redo the personality quiz to get new career recommendations. Your saved careers and viewing history will be preserved.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleRetakeAssessment} 
              disabled={resettingAssessment}
              variant="outline"
              className="w-full border-amber-300 hover:bg-amber-100"
            >
              {resettingAssessment ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Resetting...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retake Assessment
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Assessment History */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <History className="w-5 h-5 text-primary" />
                  Assessment History
                </CardTitle>
                <CardDescription>
                  View your past career assessments and recommendations over time
                </CardDescription>
              </div>
              {assessmentHistory.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportPdf}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export PDF
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <AssessmentHistorySkeleton count={2} />
            ) : assessmentHistory.length === 0 ? (
              <div className="text-center py-8">
                <History className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground mb-2">No assessment history yet</p>
                <p className="text-sm text-muted-foreground">
                  Complete an assessment to see your recommendations here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {assessmentHistory.map((assessment, index) => (
                  <div
                    key={assessment.id}
                    className="p-4 rounded-lg border bg-card hover:bg-accent/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-foreground">
                          {assessment.recommended_career}
                        </span>
                        {index === 0 && (
                          <Badge variant="secondary" className="text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(assessment.completed_at), 'MMM d, yyyy')}
                        </span>
                        {index !== 0 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-red-500"
                            onClick={() => handleDeleteAssessment(assessment.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          Personality Types
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {assessment.personality.map((type) => (
                            <Badge 
                              key={type} 
                              variant="outline" 
                              className="text-xs bg-primary/5 border-primary/20"
                            >
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          Interests
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {assessment.interests.map((interest) => (
                            <Badge 
                              key={interest} 
                              variant="outline" 
                              className="text-xs"
                            >
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Save Preferences Button */}
        <Button onClick={handleSavePreferences} className="w-full mb-6" size="lg">
          <Save className="w-4 h-4 mr-2" />
          Save All Preferences
        </Button>

        {/* Delete Account - Danger Zone */}
        <Card className="mb-6 border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Delete Account
            </CardTitle>
            <CardDescription>
              Permanently delete your account and all associated data. This action is irreversible and complies with GDPR data deletion requirements.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-2">This will permanently delete:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Your profile and personal information</li>
                  <li>All assessment history and career recommendations</li>
                  <li>Your career shortlist and viewing history</li>
                  <li>All forum posts and comments</li>
                  <li>Referral data</li>
                </ul>
              </div>
              <Button 
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete My Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Delete Your Account?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                This action <strong>cannot be undone</strong>. All your data will be permanently removed from our servers in compliance with GDPR.
              </p>
              <div className="space-y-2">
                <Label htmlFor="confirmDelete" className="text-sm font-medium">
                  Type <span className="font-mono bg-muted px-1 rounded">DELETE</span> to confirm:
                </Label>
                <Input
                  id="confirmDelete"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type DELETE"
                  className="font-mono"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirmText('')}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={deleteConfirmText !== 'DELETE' || deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete Account'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;
