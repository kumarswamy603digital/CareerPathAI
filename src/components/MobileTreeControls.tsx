import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerTrigger,
  DrawerClose 
} from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Heart, 
  Scale, 
  Trash2, 
  DollarSign, 
  GraduationCap, 
  TrendingUp, 
  Wifi,
  Sparkles,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import { personalities, interests, Personality, Interest } from '@/data/careerData';
import { 
  SalaryRange, 
  salaryRanges, 
  EducationLevel, 
  educationLevels, 
  GrowthRate, 
  growthRates 
} from '@/components/FilterPanel';
import { cn } from '@/lib/utils';

interface MobileTreeControlsProps {
  selectedPersonalities: Personality[];
  selectedInterests: Interest[];
  selectedSalaryRange: SalaryRange;
  selectedEducationLevel: EducationLevel;
  selectedGrowthRate: GrowthRate;
  remoteOnly: boolean;
  onPersonalityChange: (personalities: Personality[]) => void;
  onInterestChange: (interests: Interest[]) => void;
  onSalaryRangeChange: (range: SalaryRange) => void;
  onEducationLevelChange: (level: EducationLevel) => void;
  onGrowthRateChange: (rate: GrowthRate) => void;
  onRemoteOnlyChange: (remoteOnly: boolean) => void;
  recommendedCareer?: string | null;
  shortlist: string[];
  onRemoveFromShortlist: (careerName: string) => void;
  onCompare: (careers: string[]) => void;
  onCareerClick: (careerName: string) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
}

export function MobileTreeControls({
  selectedPersonalities,
  selectedInterests,
  selectedSalaryRange,
  selectedEducationLevel,
  selectedGrowthRate,
  remoteOnly,
  onPersonalityChange,
  onInterestChange,
  onSalaryRangeChange,
  onEducationLevelChange,
  onGrowthRateChange,
  onRemoteOnlyChange,
  recommendedCareer,
  shortlist,
  onRemoveFromShortlist,
  onCompare,
  onCareerClick,
  onZoomIn,
  onZoomOut,
  onFitView,
}: MobileTreeControlsProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [shortlistOpen, setShortlistOpen] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  // Collapsible states
  const [personalityOpen, setPersonalityOpen] = useState(true);
  const [interestOpen, setInterestOpen] = useState(false);
  const [salaryOpen, setSalaryOpen] = useState(false);
  const [educationOpen, setEducationOpen] = useState(false);
  const [growthOpen, setGrowthOpen] = useState(false);

  const hasFilters = selectedPersonalities.length > 0 || 
    selectedInterests.length > 0 || 
    selectedSalaryRange !== 'all' || 
    selectedEducationLevel !== 'all' || 
    selectedGrowthRate !== 'all' || 
    remoteOnly;

  const filterCount = selectedPersonalities.length + 
    selectedInterests.length + 
    (selectedSalaryRange !== 'all' ? 1 : 0) + 
    (selectedEducationLevel !== 'all' ? 1 : 0) + 
    (selectedGrowthRate !== 'all' ? 1 : 0) + 
    (remoteOnly ? 1 : 0);

  const togglePersonality = (p: Personality) => {
    if (selectedPersonalities.includes(p)) {
      onPersonalityChange(selectedPersonalities.filter(x => x !== p));
    } else {
      onPersonalityChange([...selectedPersonalities, p]);
    }
  };

  const toggleInterest = (i: Interest) => {
    if (selectedInterests.includes(i)) {
      onInterestChange(selectedInterests.filter(x => x !== i));
    } else {
      onInterestChange([...selectedInterests, i]);
    }
  };

  const clearAll = () => {
    onPersonalityChange([]);
    onInterestChange([]);
    onSalaryRangeChange('all');
    onEducationLevelChange('all');
    onGrowthRateChange('all');
    onRemoteOnlyChange(false);
  };

  const toggleCompareSelection = (careerName: string) => {
    setSelectedForCompare(prev => {
      if (prev.includes(careerName)) {
        return prev.filter(c => c !== careerName);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, careerName];
    });
  };

  const handleCompare = () => {
    if (selectedForCompare.length >= 2) {
      onCompare(selectedForCompare);
      setShortlistOpen(false);
    }
  };

  return (
    <>
      {/* Floating Controls - Bottom */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-card/95 backdrop-blur-sm border border-border rounded-full shadow-lg px-2 py-2">
        {/* Zoom Controls */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 rounded-full"
          onClick={onZoomOut}
        >
          <ZoomOut className="w-5 h-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 rounded-full"
          onClick={onFitView}
        >
          <Maximize2 className="w-5 h-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 rounded-full"
          onClick={onZoomIn}
        >
          <ZoomIn className="w-5 h-5" />
        </Button>

        <div className="w-px h-6 bg-border" />

        {/* Filter Button */}
        <Drawer open={filterOpen} onOpenChange={setFilterOpen}>
          <DrawerTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 rounded-full relative"
            >
              <Filter className="w-5 h-5" />
              {filterCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {filterCount}
                </span>
              )}
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[85vh]">
            <DrawerHeader className="flex items-center justify-between pb-2">
              <DrawerTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" />
                Filters
              </DrawerTitle>
              {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  <X className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              )}
            </DrawerHeader>
            <ScrollArea className="flex-1 px-4 pb-6" style={{ maxHeight: 'calc(85vh - 80px)' }}>
              <div className="space-y-4">
                {/* Recommended Career */}
                {recommendedCareer && (
                  <div className="p-3 rounded-lg bg-accent/50 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Your Match</span>
                    </div>
                    <p className="font-serif font-bold text-primary">{recommendedCareer}</p>
                  </div>
                )}

                {/* Personality Filter */}
                <Collapsible open={personalityOpen} onOpenChange={setPersonalityOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted rounded-lg">
                    <span className="font-medium">Personality Type</span>
                    {personalityOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 px-1">
                    <div className="flex flex-wrap gap-2">
                      {personalities.map(p => (
                        <Badge
                          key={p}
                          variant={selectedPersonalities.includes(p) ? "default" : "outline"}
                          className={cn(
                            "cursor-pointer py-1.5 px-3 text-sm active:scale-95 transition-transform",
                            selectedPersonalities.includes(p) 
                              ? "bg-primary text-primary-foreground" 
                              : "border-border"
                          )}
                          onClick={() => togglePersonality(p)}
                        >
                          {p}
                        </Badge>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Interest Filter */}
                <Collapsible open={interestOpen} onOpenChange={setInterestOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted rounded-lg">
                    <span className="font-medium">Interests</span>
                    {interestOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 px-1">
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                      {interests.map(i => (
                        <Badge
                          key={i}
                          variant={selectedInterests.includes(i) ? "default" : "outline"}
                          className={cn(
                            "cursor-pointer py-1.5 px-3 text-sm active:scale-95 transition-transform",
                            selectedInterests.includes(i) 
                              ? "bg-primary text-primary-foreground" 
                              : "border-border"
                          )}
                          onClick={() => toggleInterest(i)}
                        >
                          {i}
                        </Badge>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Salary Range */}
                <Collapsible open={salaryOpen} onOpenChange={setSalaryOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span className="font-medium">Salary Range</span>
                    </div>
                    {salaryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <div className="flex flex-col gap-1">
                      {salaryRanges.map(range => (
                        <button
                          key={range.value}
                          onClick={() => onSalaryRangeChange(range.value)}
                          className={cn(
                            "flex items-center gap-2 px-4 py-3 rounded-lg text-sm transition-colors text-left active:scale-[0.98]",
                            selectedSalaryRange === range.value
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          )}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Education Level */}
                <Collapsible open={educationOpen} onOpenChange={setEducationOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-primary" />
                      <span className="font-medium">Education Level</span>
                    </div>
                    {educationOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <div className="flex flex-col gap-1">
                      {educationLevels.map(level => (
                        <button
                          key={level.value}
                          onClick={() => onEducationLevelChange(level.value)}
                          className={cn(
                            "flex items-center gap-2 px-4 py-3 rounded-lg text-sm transition-colors text-left active:scale-[0.98]",
                            selectedEducationLevel === level.value
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          )}
                        >
                          {level.label}
                        </button>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Growth Rate */}
                <Collapsible open={growthOpen} onOpenChange={setGrowthOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <span className="font-medium">Growth Rate</span>
                    </div>
                    {growthOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <div className="flex flex-col gap-1">
                      {growthRates.map(rate => (
                        <button
                          key={rate.value}
                          onClick={() => onGrowthRateChange(rate.value)}
                          className={cn(
                            "flex items-center gap-2 px-4 py-3 rounded-lg text-sm transition-colors text-left active:scale-[0.98]",
                            selectedGrowthRate === rate.value
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          )}
                        >
                          {rate.label}
                        </button>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Remote Only */}
                <button
                  onClick={() => onRemoteOnlyChange(!remoteOnly)}
                  className={cn(
                    "flex items-center gap-2 w-full px-4 py-3 rounded-lg text-sm transition-colors text-left active:scale-[0.98]",
                    remoteOnly
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  <Wifi className="w-4 h-4" />
                  Remote-Friendly Only
                </button>
              </div>
            </ScrollArea>
          </DrawerContent>
        </Drawer>

        {/* Shortlist Button */}
        {shortlist.length > 0 && (
          <Drawer open={shortlistOpen} onOpenChange={setShortlistOpen}>
            <DrawerTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-full relative"
              >
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {shortlist.length}
                </span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[70vh]">
              <DrawerHeader>
                <DrawerTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  My Shortlist ({shortlist.length})
                </DrawerTitle>
              </DrawerHeader>
              <ScrollArea className="px-4 pb-6" style={{ maxHeight: 'calc(70vh - 80px)' }}>
                <div className="space-y-2">
                  {shortlist.map(careerName => (
                    <div 
                      key={careerName}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted"
                    >
                      <Checkbox
                        checked={selectedForCompare.includes(careerName)}
                        onCheckedChange={() => toggleCompareSelection(careerName)}
                        disabled={!selectedForCompare.includes(careerName) && selectedForCompare.length >= 3}
                        className="border-border"
                      />
                      <span 
                        className="flex-1 text-sm cursor-pointer active:text-primary truncate"
                        onClick={() => {
                          onCareerClick(careerName);
                          setShortlistOpen(false);
                        }}
                      >
                        {careerName}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground"
                        onClick={() => onRemoveFromShortlist(careerName)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {selectedForCompare.length >= 2 && (
                    <Button 
                      onClick={handleCompare}
                      className="w-full mt-4 bg-primary text-primary-foreground"
                    >
                      <Scale className="w-4 h-4 mr-2" />
                      Compare ({selectedForCompare.length})
                    </Button>
                  )}
                  
                  {shortlist.length >= 2 && selectedForCompare.length < 2 && (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      Select 2-3 careers to compare
                    </p>
                  )}
                </div>
              </ScrollArea>
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </>
  );
}
