import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CareerDetails, formatSalaryRange, getCareerDetails } from '@/data/careerDetails';
import { 
  DollarSign, 
  GraduationCap, 
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CareerCompareModalProps {
  careers: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRemoveCareer: (careerName: string) => void;
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

const outlookColors = {
  'High Demand': 'bg-green-100 text-green-800 border-green-200',
  'Growing': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Stable': 'bg-amber-100 text-amber-800 border-amber-200',
  'Declining': 'bg-red-100 text-red-800 border-red-200',
};

export function CareerCompareModal({ 
  careers, 
  open, 
  onOpenChange,
  onRemoveCareer 
}: CareerCompareModalProps) {
  const careerDetails = careers
    .map(name => getCareerDetails(name))
    .filter((c): c is CareerDetails => c !== null);

  if (careerDetails.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden bg-card">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-serif text-foreground">
            Compare Careers
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-100px)]">
          <div className="p-6 pt-4">
            {/* Career Headers */}
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${careerDetails.length}, 1fr)` }}>
              {careerDetails.map((career) => (
                <div 
                  key={career.id} 
                  className="bg-accent/50 rounded-lg p-4 border border-border relative"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-foreground"
                    onClick={() => onRemoveCareer(career.name)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <h3 className="font-serif font-bold text-lg text-foreground pr-6">
                    {career.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {career.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Salary Comparison */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-5 h-5 text-primary" />
                <h4 className="font-medium text-foreground">Salary Range</h4>
              </div>
              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${careerDetails.length}, 1fr)` }}>
                {careerDetails.map((career) => (
                  <div key={career.id} className="bg-background rounded-lg p-4 border border-border">
                    <p className="text-lg font-semibold text-foreground">
                      {formatSalaryRange(career.salaryRange)}
                    </p>
                    <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ 
                          width: `${Math.min(100, (career.salaryRange.max / 300000) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Job Outlook Comparison */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h4 className="font-medium text-foreground">Job Outlook</h4>
              </div>
              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${careerDetails.length}, 1fr)` }}>
                {careerDetails.map((career) => (
                  <div key={career.id} className="bg-background rounded-lg p-4 border border-border">
                    <Badge 
                      variant="outline" 
                      className={cn('gap-1', outlookColors[career.jobOutlook])}
                    >
                      <JobOutlookIcon outlook={career.jobOutlook} />
                      {career.jobOutlook}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      {career.jobOutlookDescription}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Comparison */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-primary" />
                <h4 className="font-medium text-foreground">Required Skills</h4>
              </div>
              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${careerDetails.length}, 1fr)` }}>
                {careerDetails.map((career) => (
                  <div key={career.id} className="bg-background rounded-lg p-4 border border-border">
                    <div className="flex flex-wrap gap-1.5">
                      {career.skills.map((skill) => (
                        <Badge 
                          key={skill} 
                          variant="secondary"
                          className="text-xs bg-secondary text-secondary-foreground"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Comparison */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-5 h-5 text-primary" />
                <h4 className="font-medium text-foreground">Education Paths</h4>
              </div>
              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${careerDetails.length}, 1fr)` }}>
                {careerDetails.map((career) => (
                  <div key={career.id} className="bg-background rounded-lg p-4 border border-border">
                    <ul className="space-y-1.5">
                      {career.education.map((edu, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{edu}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
