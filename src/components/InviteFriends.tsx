import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Users, 
  Copy, 
  Check, 
  Gift,
  MessageCircle,
  Mail,
  Share2
} from 'lucide-react';
import { useReferrals } from '@/hooks/useReferrals';
import { Skeleton } from '@/components/ui/skeleton';

interface InviteFriendsProps {
  variant?: 'button' | 'card' | 'compact';
}

export const InviteFriends = ({ variant = 'button' }: InviteFriendsProps) => {
  const { referralCode, loading, getReferralLink, copyReferralLink, getConvertedCount, referrals } = useReferrals();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyReferralLink();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const referralLink = getReferralLink();
  const convertedCount = getConvertedCount();
  const totalInvites = referrals.length;

  const shareToWhatsApp = () => {
    const text = `🚀 Discover your ideal career path with CareerPath! Take the AI-powered assessment and find your perfect match. Join me: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareToTwitter = () => {
    const text = `I just discovered my ideal career using @CareerPath! 🎯 Find your perfect career match with their AI-powered assessment:`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralLink)}`, '_blank');
  };

  const shareViaEmail = () => {
    const subject = 'Discover Your Ideal Career Path!';
    const body = `Hey!\n\nI've been using CareerPath to explore career options and thought you might find it helpful too.\n\nIt has an AI-powered career assessment that helps you find the perfect career match based on your personality and interests.\n\nCheck it out: ${referralLink}\n\nHope you find it useful!`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CareerPath - Find Your Ideal Career',
          text: 'Discover your ideal career path with AI-powered assessments!',
          url: referralLink,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  const DialogContentComponent = () => (
    <div className="space-y-6">
      {/* Referral Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-accent/50">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">{totalInvites}</div>
            <div className="text-sm text-muted-foreground">Invites Sent</div>
          </CardContent>
        </Card>
        <Card className="bg-accent/50">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">{convertedCount}</div>
            <div className="text-sm text-muted-foreground">Friends Joined</div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Your Referral Link</label>
        {loading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <div className="flex gap-2">
            <Input 
              value={referralLink} 
              readOnly 
              className="bg-muted text-sm"
            />
            <Button 
              onClick={handleCopy} 
              variant="outline" 
              size="icon"
              className="shrink-0"
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        )}
        {referralCode && (
          <p className="text-xs text-muted-foreground">
            Your code: <Badge variant="secondary" className="font-mono">{referralCode}</Badge>
          </p>
        )}
      </div>

      {/* Share Options */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Share via</label>
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={shareToWhatsApp} 
            variant="outline" 
            className="h-12 gap-2"
          >
            <MessageCircle className="h-5 w-5 text-green-500" />
            WhatsApp
          </Button>
          <Button 
            onClick={shareToTwitter} 
            variant="outline" 
            className="h-12 gap-2"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Twitter/X
          </Button>
          <Button 
            onClick={shareViaEmail} 
            variant="outline" 
            className="h-12 gap-2"
          >
            <Mail className="h-5 w-5 text-blue-500" />
            Email
          </Button>
          <Button 
            onClick={shareNative} 
            variant="outline" 
            className="h-12 gap-2"
          >
            <Share2 className="h-5 w-5 text-purple-500" />
            More
          </Button>
        </div>
      </div>

      {/* Benefits */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Gift className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-sm">Help friends find their path</p>
              <p className="text-xs text-muted-foreground mt-1">
                Share CareerPath with friends and help them discover their ideal career match.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (variant === 'card') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Invite Friends
          </CardTitle>
          <CardDescription>
            Share CareerPath with your network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DialogContentComponent />
        </CardContent>
      </Card>
    );
  }

  if (variant === 'compact') {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <Users className="h-4 w-4" />
            Invite
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Invite Friends
            </DialogTitle>
            <DialogDescription>
              Share your referral link and help friends discover their career path
            </DialogDescription>
          </DialogHeader>
          <DialogContentComponent />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Users className="h-4 w-4" />
          Invite Friends
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Invite Friends
          </DialogTitle>
          <DialogDescription>
            Share your referral link and help friends discover their career path
          </DialogDescription>
        </DialogHeader>
        <DialogContentComponent />
      </DialogContent>
    </Dialog>
  );
};
