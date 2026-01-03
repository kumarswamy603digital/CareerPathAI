import { X, Check, RotateCcw, Sparkles, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CareerResultModalProps {
  career: string;
  interests: string[];
  personality: string[];
  reasoning?: string;
  onAccept: () => void;
  onRedo: () => void;
  onClose: () => void;
}

export function CareerResultModal({
  career,
  interests,
  personality,
  reasoning,
  onAccept,
  onRedo,
  onClose,
}: CareerResultModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm">
      <div className="relative w-full max-w-lg mx-4 bg-card rounded-2xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with glow effect */}
        <div className="relative px-8 pt-8 pb-6 text-center bg-gradient-to-b from-accent/50 to-transparent">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 animate-pulse-ring">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-2">
            Your Career Match
          </h2>
          <p className="text-muted-foreground">
            Based on your conversation, we recommend:
          </p>
        </div>

        {/* Career recommendation */}
        <div className="px-8 py-6 space-y-5">
          <div className="text-center">
            <h3 className="text-3xl font-serif font-bold text-primary glow-amber inline-block px-4 py-2 rounded-lg bg-accent/30">
              {career}
            </h3>
          </div>

          {/* AI Reasoning Section */}
          {reasoning && (
            <div className="bg-accent/20 border border-accent rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Why I recommended this:</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{reasoning}</p>
                </div>
              </div>
            </div>
          )}

          {/* Personality badges */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Personality Types:</p>
            <div className="flex flex-wrap gap-2">
              {personality.map((p) => (
                <Badge 
                  key={p} 
                  variant="secondary"
                  className="bg-secondary text-secondary-foreground"
                >
                  {p}
                </Badge>
              ))}
            </div>
          </div>

          {/* Interest badges */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Key Interests:</p>
            <div className="flex flex-wrap gap-2">
              {interests.slice(0, 6).map((interest) => (
                <Badge 
                  key={interest} 
                  variant="outline"
                  className="border-primary/30 text-foreground"
                >
                  {interest}
                </Badge>
              ))}
              {interests.length > 6 && (
                <Badge variant="outline" className="border-muted text-muted-foreground">
                  +{interests.length - 6} more
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-8 pb-8 flex gap-3">
          <Button
            variant="outline"
            onClick={onRedo}
            className="flex-1 gap-2 border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <RotateCcw className="w-4 h-4" />
            Redo
          </Button>
          <Button
            onClick={onAccept}
            className="flex-1 gap-2 bg-accept text-accept-foreground hover:bg-accept/90 font-semibold"
          >
            <Check className="w-4 h-4" />
            Accept & Explore
          </Button>
        </div>
      </div>
    </div>
  );
}
