import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Share2, Twitter, MessageCircle, Copy, Check, Link2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ShareResultsProps {
  careerName: string;
  description?: string;
  variant?: 'button' | 'icon' | 'dropdown';
  className?: string;
}

export function ShareResults({ 
  careerName, 
  description,
  variant = 'button',
  className 
}: ShareResultsProps) {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const appUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = `${appUrl}/tree?career=${encodeURIComponent(careerName)}`;
  
  const shareText = `🎯 I discovered my ideal career path: ${careerName}! 

${description ? `${description.slice(0, 100)}...` : 'Discover your perfect career match too!'}

Find your path with CareerPath 👇`;

  const twitterText = `🎯 I discovered my ideal career path: ${careerName}! 

Find your perfect career match with CareerPath 👇`;

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  const handleWhatsAppShare = () => {
    const whatsappText = `${shareText}\n\n${shareUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My Career Match: ${careerName}`,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error
        if ((err as Error).name !== 'AbortError') {
          toast.error('Failed to share');
        }
      }
    } else {
      setShowPreview(true);
    }
  };

  // Check if native share is supported
  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  if (variant === 'icon') {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-9 w-9", className)}
              aria-label="Share career match"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleTwitterShare} className="gap-2 cursor-pointer">
              <Twitter className="h-4 w-4 text-[#1DA1F2]" />
              Share on Twitter
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleWhatsAppShare} className="gap-2 cursor-pointer">
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
              Share on WhatsApp
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleCopyLink} className="gap-2 cursor-pointer">
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? 'Copied!' : 'Copy Link'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    );
  }

  if (variant === 'dropdown') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className={cn("gap-2", className)}>
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleTwitterShare} className="gap-2 cursor-pointer">
            <Twitter className="h-4 w-4 text-[#1DA1F2]" />
            Share on Twitter
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleWhatsAppShare} className="gap-2 cursor-pointer">
            <MessageCircle className="h-4 w-4 text-[#25D366]" />
            Share on WhatsApp
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleCopyLink} className="gap-2 cursor-pointer">
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? 'Copied!' : 'Copy Link'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Default button variant
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={hasNativeShare ? handleNativeShare : () => setShowPreview(true)}
        className={cn("gap-2", className)}
      >
        <Share2 className="h-4 w-4" />
        Share My Match
      </Button>

      {/* Share Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Share Your Career Match
            </DialogTitle>
            <DialogDescription>
              Let others know about your ideal career path!
            </DialogDescription>
          </DialogHeader>

          {/* Preview Card */}
          <div className="rounded-lg border border-border bg-accent/30 p-4 space-y-2">
            <p className="font-medium text-foreground">🎯 My Career Match</p>
            <p className="text-lg font-serif font-bold text-primary">{careerName}</p>
            {description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {description}
              </p>
            )}
            <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2">
              <Link2 className="h-3 w-3" />
              <span className="truncate">{shareUrl}</span>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex flex-col gap-2 pt-2">
            <Button
              onClick={handleTwitterShare}
              className="w-full gap-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white"
            >
              <Twitter className="h-4 w-4" />
              Share on Twitter
            </Button>
            <Button
              onClick={handleWhatsAppShare}
              className="w-full gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white"
            >
              <MessageCircle className="h-4 w-4" />
              Share on WhatsApp
            </Button>
            <Button
              variant="outline"
              onClick={handleCopyLink}
              className="w-full gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Link
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
