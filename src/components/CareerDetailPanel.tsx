import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CareerDetails, formatSalaryRange, getCareerTrajectory } from '@/data/careerDetails';
import { getResourcesForCareer, getPlatformColor } from '@/data/learningResources';
import { getVideosForCareer } from '@/data/careerVideos';
import { useLiveSalaryData } from '@/hooks/useLiveSalaryData';
import { useJobDemand } from '@/hooks/useJobDemand';
import { 
  DollarSign, 
  GraduationCap, 
  Briefcase, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Zap,
  BookOpen,
  Heart,
  ArrowRight,
  Target,
  Sparkles,
  ChevronRight,
  Radio,
  Clock,
  MapPin,
  Building2,
  Users,
  ExternalLink,
  PlayCircle,
  Video,
  Youtube
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSimilarCareers, hasCareerDetails } from '@/lib/careerSuggestions';

interface CareerDetailPanelProps {
  career: CareerDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isInShortlist?: boolean;
  onToggleShortlist?: (careerName: string) => void;
  onViewCareer?: (careerName: string) => void;
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
  onToggleShortlist,
  onViewCareer
}: CareerDetailPanelProps) {
  const { salary: liveSalary, isLoading: salaryLoading, isLive } = useLiveSalaryData(career?.name || null);
  const { demand: jobDemand, isLoading: demandLoading } = useJobDemand(career?.name || null);
  
  if (!career) return null;
  
  const similarCareers = getSimilarCareers(career.name, 3);

  // Format live salary for display
  const formatLiveSalary = (min: number, max: number) => {
    return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
  };

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
              {salaryLoading ? (
                <Badge variant="outline" className="ml-auto text-xs gap-1 animate-pulse">
                  <Clock className="w-3 h-3" />
                  Loading...
                </Badge>
              ) : isLive ? (
                <Badge variant="outline" className="ml-auto text-xs gap-1 bg-green-50 text-green-700 border-green-200">
                  <Radio className="w-3 h-3" />
                  Live Data
                </Badge>
              ) : liveSalary ? (
                <Badge variant="outline" className="ml-auto text-xs gap-1 bg-blue-50 text-blue-700 border-blue-200">
                  BLS 2023
                </Badge>
              ) : null}
            </div>
            <div className="bg-accent/50 rounded-lg p-4 border border-border">
              {salaryLoading ? (
                <Skeleton className="h-7 w-40" />
              ) : liveSalary ? (
                <>
                  <p className="text-xl font-semibold text-foreground">
                    {formatLiveSalary(liveSalary.min, liveSalary.max)}
                  </p>
                  {liveSalary.median && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Median: ${liveSalary.median.toLocaleString()}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Source: {liveSalary.source} • Updated: {liveSalary.lastUpdated}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xl font-semibold text-foreground">
                    {formatSalaryRange(career.salaryRange)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Annual (USD) • Static Data</p>
                </>
              )}
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Job Market Demand */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <Users className="w-5 h-5 text-primary" />
              <span>Job Market Demand</span>
              {demandLoading ? (
                <Badge variant="outline" className="ml-auto text-xs gap-1 animate-pulse">
                  <Clock className="w-3 h-3" />
                  Loading...
                </Badge>
              ) : jobDemand ? (
                <Badge variant="outline" className={cn(
                  "ml-auto text-xs gap-1",
                  jobDemand.demandLevel === 'Very High' && "bg-green-50 text-green-700 border-green-200",
                  jobDemand.demandLevel === 'High' && "bg-emerald-50 text-emerald-700 border-emerald-200",
                  jobDemand.demandLevel === 'Moderate' && "bg-amber-50 text-amber-700 border-amber-200",
                  jobDemand.demandLevel === 'Low' && "bg-red-50 text-red-700 border-red-200"
                )}>
                  {jobDemand.demandLevel}
                </Badge>
              ) : null}
            </div>
            <div className="bg-accent/50 rounded-lg p-4 border border-border space-y-3">
              {demandLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              ) : jobDemand ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">
                      {jobDemand.currentOpenings.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">open positions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-green-600 font-medium">+{jobDemand.monthlyGrowth}%</span>
                    <span className="text-muted-foreground">monthly growth</span>
                  </div>
                  <div className="pt-2 space-y-2">
                    <div className="flex items-start gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-foreground mb-1">Top Hiring Companies</p>
                        <div className="flex flex-wrap gap-1">
                          {jobDemand.topHiringCompanies.slice(0, 4).map((company) => (
                            <Badge key={company} variant="secondary" className="text-[10px] px-1.5 py-0">
                              {company}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-foreground mb-1">Hot Locations</p>
                        <p className="text-xs text-muted-foreground">
                          {jobDemand.hotLocations.slice(0, 4).join(' • ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                      <Clock className="w-3 h-3" />
                      Avg. time to hire: {jobDemand.avgTimeToHire}
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No demand data available</p>
              )}
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

          {/* Skills Gap Analysis */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <Zap className="w-5 h-5 text-primary" />
              <span>Skills Gap Analysis</span>
            </div>
            <div className="bg-gradient-to-br from-primary/5 to-accent/50 rounded-lg p-4 border border-primary/20">
              <p className="text-sm text-muted-foreground mb-3">
                <span className="font-medium text-foreground">To succeed as a {career.name},</span> you need to learn:
              </p>
              <div className="space-y-3">
                {career.skills.map((skill, index) => {
                  // Determine priority based on position (first skills are more essential)
                  const priority = index < 2 ? 'Essential' : index < 4 ? 'Important' : 'Helpful';
                  const priorityColors = {
                    'Essential': 'bg-red-100 text-red-700 border-red-200',
                    'Important': 'bg-amber-100 text-amber-700 border-amber-200',
                    'Helpful': 'bg-green-100 text-green-700 border-green-200'
                  };
                  const priorityIcons = {
                    'Essential': '🔴',
                    'Important': '🟡',
                    'Helpful': '🟢'
                  };
                  
                  return (
                    <div 
                      key={skill} 
                      className="flex items-center gap-3 bg-background/80 rounded-md p-2.5 border border-border/50"
                    >
                      <span className="text-sm">{priorityIcons[priority]}</span>
                      <div className="flex-1">
                        <span className="text-sm font-medium text-foreground">{skill}</span>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={cn("text-[10px] px-2 py-0.5", priorityColors[priority])}
                      >
                        {priority}
                      </Badge>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-3 border-t border-border/50">
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <span className="inline-flex items-center gap-1">🔴 Essential</span>
                  <span className="inline-flex items-center gap-1">🟡 Important</span>
                  <span className="inline-flex items-center gap-1">🟢 Helpful</span>
                </p>
              </div>
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Learning Resources */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <PlayCircle className="w-5 h-5 text-primary" />
              <span>Learning Resources</span>
            </div>
            <div className="space-y-2">
              {getResourcesForCareer(career.name).map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-accent/40 hover:bg-accent/70 rounded-lg p-3 border border-border/50 transition-all hover:border-primary/30 group"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors flex-1">
                      {resource.title}
                    </span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={cn("text-[10px] px-2 py-0.5", getPlatformColor(resource.platform))}
                    >
                      {resource.platform}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
                      {resource.type}
                    </Badge>
                    {resource.duration && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {resource.duration}
                      </span>
                    )}
                    {resource.free && (
                      <Badge className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                        Free
                      </Badge>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Day-in-the-Life Videos */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <Video className="w-5 h-5 text-primary" />
              <span>Day-in-the-Life Videos</span>
            </div>
            <div className="space-y-3">
              {getVideosForCareer(career.name).map((video, index) => (
                <div key={index} className="rounded-lg overflow-hidden border border-border bg-background">
                  <div className="aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.videoId}`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                  <div className="p-3 bg-accent/30">
                    <p className="text-sm font-medium text-foreground line-clamp-1">{video.title}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Youtube className="w-3 h-3 text-red-500" />
                      <span className="text-xs text-muted-foreground">{video.channel}</span>
                    </div>
                  </div>
                </div>
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

          <Separator className="bg-border" />

          {/* Career Trajectory */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <Target className="w-5 h-5 text-primary" />
              <span>Career Trajectory</span>
            </div>
            <div className="relative">
              {getCareerTrajectory(career).map((level, index, arr) => (
                <div key={index} className="relative flex items-start gap-3 pb-4">
                  {/* Vertical line connector */}
                  {index < arr.length - 1 && (
                    <div className="absolute left-[15px] top-8 w-0.5 h-full bg-gradient-to-b from-primary/60 to-primary/20" />
                  )}
                  
                  {/* Level indicator */}
                  <div className={cn(
                    "shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10",
                    index === 0 && "bg-muted text-muted-foreground",
                    index === 1 && "bg-secondary text-secondary-foreground",
                    index === 2 && "bg-primary/70 text-primary-foreground",
                    index === 3 && "bg-primary text-primary-foreground"
                  )}>
                    {index + 1}
                  </div>
                  
                  {/* Level details */}
                  <div className="flex-1 bg-accent/30 rounded-lg p-3 border border-border/50">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-sm text-foreground">{level.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {level.yearsExperience}
                      </Badge>
                    </div>
                    <p className="text-xs text-primary font-medium mb-2">
                      ${level.salaryRange.min.toLocaleString()} - ${level.salaryRange.max.toLocaleString()}
                    </p>
                    <ul className="space-y-0.5">
                      {level.responsibilities.slice(0, 2).map((resp, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                          <ArrowRight className="w-3 h-3 shrink-0" />
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Similar Careers */}
          {similarCareers.length > 0 && (
            <>
              <Separator className="bg-border" />
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span>You Might Also Like</span>
                </div>
                <div className="space-y-2">
                  {similarCareers.map((similar) => (
                    <button
                      key={similar.name}
                      onClick={() => {
                        if (hasCareerDetails(similar.name) && onViewCareer) {
                          onViewCareer(similar.name);
                        }
                      }}
                      disabled={!hasCareerDetails(similar.name)}
                      className={cn(
                        "w-full text-left bg-accent/40 hover:bg-accent/70 rounded-lg p-3 border border-border/50 transition-colors group",
                        !hasCareerDetails(similar.name) && "opacity-60 cursor-not-allowed"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                          {similar.name}
                        </span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {similar.sharedInterests.slice(0, 3).map((interest) => (
                          <Badge 
                            key={interest} 
                            variant="outline" 
                            className="text-[10px] px-1.5 py-0 bg-primary/10 border-primary/20 text-primary"
                          >
                            {interest}
                          </Badge>
                        ))}
                        {similar.sharedPersonalities.slice(0, 1).map((personality) => (
                          <Badge 
                            key={personality} 
                            variant="outline" 
                            className="text-[10px] px-1.5 py-0 bg-secondary/50 border-secondary text-secondary-foreground"
                          >
                            {personality}
                          </Badge>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
