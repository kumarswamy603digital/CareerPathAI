import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { CareerDetails, formatSalaryRange } from '@/data/careerDetails';
import { 
  DollarSign, 
  GraduationCap, 
  Briefcase, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Zap,
  BookOpen,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CareerDetailPanelProps {
  career: CareerDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isInShortlist?: boolean;
  onToggleShortlist?: (careerName: string) => void;
}

const JobOutlookIcon = ({ outlook }: { outlook: CareerDetails['jobOutlook'] }) => {
  switch (outlook) {
    case 'High Demand':
      return <Zap className="w-4 h-4 text-green-600" />;
    case 'Growing':
      return <TrendingUp className="w-4 h-4 text-emerald-600" />;
    case 'Stable':
      return <Minus className="w-4 h-4 text-amber-600" />;
    case 'Declining':
      return <TrendingDown className="w-4 h-4 text-red-600" />;
  }
};

const JobOutlookBadge = ({ outlook }: { outlook: CareerDetails['jobOutlook'] }) => {
  const colorClasses = {
    'High Demand': 'bg-green-100 text-green-800 border-green-200',
    'Growing': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Stable': 'bg-amber-100 text-amber-800 border-amber-200',
    'Declining': 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <Badge variant="outline" className={cn('gap-1', colorClasses[outlook])}>
      <JobOutlookIcon outlook={outlook} />
      {outlook}
    </Badge>
  );
};

export function CareerDetailPanel({ 
  career, 
  open, 
  onOpenChange,
  isInShortlist = false,
  onToggleShortlist
}: CareerDetailPanelProps) {
  if (!career) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto bg-card">
        <SheetHeader className="text-left pb-4">
          <div className="flex items-start justify-between gap-2">
            <SheetTitle className="text-2xl font-serif text-foreground">
              {career.name}
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleShortlist?.(career.name)}
              className={cn(
                "shrink-0 transition-colors",
                isInShortlist 
                  ? "text-red-500 hover:text-red-600" 
                  : "text-muted-foreground hover:text-red-500"
              )}
              aria-label={isInShortlist ? "Remove from shortlist" : "Add to shortlist"}
            >
              <Heart className={cn("w-5 h-5", isInShortlist && "fill-current")} />
            </Button>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {career.description}
          </p>
        </SheetHeader>

        <div className="space-y-6 pt-2">
          {/* Salary Range */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <DollarSign className="w-5 h-5 text-primary" />
              <span>Salary Range</span>
            </div>
            <div className="bg-accent/50 rounded-lg p-4 border border-border">
              <p className="text-xl font-semibold text-foreground">
                {formatSalaryRange(career.salaryRange)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Annual (USD)</p>
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Job Outlook */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <Briefcase className="w-5 h-5 text-primary" />
              <span>Job Outlook</span>
            </div>
            <div className="bg-accent/50 rounded-lg p-4 border border-border space-y-2">
              <JobOutlookBadge outlook={career.jobOutlook} />
              <p className="text-sm text-muted-foreground">
                {career.jobOutlookDescription}
              </p>
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Skills Required */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <Zap className="w-5 h-5 text-primary" />
              <span>Skills Required</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {career.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Education Paths */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <GraduationCap className="w-5 h-5 text-primary" />
              <span>Education Paths</span>
            </div>
            <ul className="space-y-2">
              {career.education.map((edu, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <BookOpen className="w-4 h-4 mt-0.5 text-primary/60 shrink-0" />
                  <span>{edu}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
