import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Globe, 
  Copy, 
  Check, 
  Loader2, 
  Save,
  ExternalLink 
} from 'lucide-react';

interface PublicProfileSettingsProps {
  userId: string;
}

export const PublicProfileSettings = ({ userId }: PublicProfileSettingsProps) => {
  const [isPublic, setIsPublic] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [publicSlug, setPublicSlug] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProfileSettings = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_public, display_name, bio, public_slug')
        .eq('user_id', userId)
        .single();

      if (!error && data) {
        setIsPublic(data.is_public || false);
        setDisplayName(data.display_name || '');
        setBio(data.bio || '');
        setPublicSlug(data.public_slug || '');
      }
      setLoading(false);
    };

    fetchProfileSettings();
  }, [userId]);

  const generateSlug = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const slug = Array.from({ length: 8 }, () => 
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
    setPublicSlug(slug);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // If enabling public profile and no slug, generate one
      let slugToSave = publicSlug;
      if (isPublic && !slugToSave) {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        slugToSave = Array.from({ length: 8 }, () => 
          chars.charAt(Math.floor(Math.random() * chars.length))
        ).join('');
        setPublicSlug(slugToSave);
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          is_public: isPublic,
          display_name: displayName || null,
          bio: bio || null,
          public_slug: isPublic ? slugToSave : publicSlug,
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast.success('Public profile settings saved!');
    } catch (error: any) {
      if (error.code === '23505') {
        toast.error('This profile URL is already taken. Please choose another.');
        generateSlug();
      } else {
        toast.error('Failed to save settings');
      }
    } finally {
      setSaving(false);
    }
  };

  const getPublicUrl = () => {
    if (!publicSlug) return '';
    return `${window.location.origin}/u/${publicSlug}`;
  };

  const copyUrl = async () => {
    const url = getPublicUrl();
    if (!url) return;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Profile URL copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy URL');
    }
  };

  if (loading) {
    return (
      <Card className="mb-6">
        <CardContent className="py-8 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Globe className="w-5 h-5 text-primary" />
          Public Profile
        </CardTitle>
        <CardDescription>
          Share your career interests with others via a public profile page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Enable Public Profile</Label>
            <p className="text-sm text-muted-foreground">
              Allow others to view your career interests and personality
            </p>
          </div>
          <Switch
            checked={isPublic}
            onCheckedChange={setIsPublic}
          />
        </div>

        {isPublic && (
          <>
            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="How you want to be known"
                maxLength={50}
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="A short description about yourself..."
                rows={3}
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground text-right">
                {bio.length}/200 characters
              </p>
            </div>

            {/* Profile URL */}
            <div className="space-y-2">
              <Label htmlFor="publicSlug">Profile URL</Label>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-1 bg-muted rounded-md px-3 text-sm">
                  <span className="text-muted-foreground">{window.location.origin}/u/</span>
                  <Input
                    id="publicSlug"
                    value={publicSlug}
                    onChange={(e) => setPublicSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="your-username"
                    className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0 text-foreground"
                    maxLength={30}
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={copyUrl}
                  disabled={!publicSlug}
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={generateSlug}
                  className="text-xs"
                >
                  Generate random URL
                </Button>
                {publicSlug && (
                  <a 
                    href={getPublicUrl()} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    Preview profile
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </>
        )}

        {/* Save Button */}
        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Public Profile Settings
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
