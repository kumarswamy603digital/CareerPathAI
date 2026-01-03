import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, X, Filter, Sparkles } from 'lucide-react';
import { personalities, interests, Personality, Interest } from '@/data/careerData';
import { cn } from '@/lib/utils';

interface FilterPanelProps {
  selectedPersonalities: Personality[];
  selectedInterests: Interest[];
  onPersonalityChange: (personalities: Personality[]) => void;
  onInterestChange: (interests: Interest[]) => void;
  recommendedCareer?: string | null;
}

export function FilterPanel({
  selectedPersonalities,
  selectedInterests,
  onPersonalityChange,
  onInterestChange,
  recommendedCareer,
}: FilterPanelProps) {
  const [personalityOpen, setPersonalityOpen] = useState(true);
  const [interestOpen, setInterestOpen] = useState(true);

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
  };

  const hasFilters = selectedPersonalities.length > 0 || selectedInterests.length > 0;

  return (
    <div className="w-80 bg-sidebar border-r border-sidebar-border h-full flex flex-col">
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          <h2 className="font-serif font-semibold text-lg text-sidebar-foreground">Filters</h2>
        </div>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Recommended Career Banner */}
      {recommendedCareer && (
        <div className="p-4 border-b border-sidebar-border bg-accent/50">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-sidebar-foreground">Your Match</span>
          </div>
          <p className="font-serif font-bold text-primary text-lg">{recommendedCareer}</p>
          <p className="text-xs text-muted-foreground mt-1">
            This career is highlighted on the tree
          </p>
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Personality Filter */}
          <Collapsible open={personalityOpen} onOpenChange={setPersonalityOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-sidebar-accent rounded-lg transition-colors">
              <span className="font-medium text-sidebar-foreground">Personality Type</span>
              {personalityOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="flex flex-wrap gap-2">
                {personalities.map(p => (
                  <Badge
                    key={p}
                    variant={selectedPersonalities.includes(p) ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer transition-all hover:scale-105",
                      selectedPersonalities.includes(p) 
                        ? "bg-primary text-primary-foreground" 
                        : "border-border text-sidebar-foreground hover:bg-sidebar-accent"
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
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-sidebar-accent rounded-lg transition-colors">
              <span className="font-medium text-sidebar-foreground">Interests</span>
              {interestOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="flex flex-wrap gap-2 max-h-[400px] overflow-y-auto">
                {interests.map(i => (
                  <Badge
                    key={i}
                    variant={selectedInterests.includes(i) ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer transition-all hover:scale-105",
                      selectedInterests.includes(i) 
                        ? "bg-primary text-primary-foreground" 
                        : "border-border text-sidebar-foreground hover:bg-sidebar-accent"
                    )}
                    onClick={() => toggleInterest(i)}
                  >
                    {i}
                  </Badge>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>

      {hasFilters && (
        <div className="p-4 border-t border-sidebar-border bg-sidebar-accent/50">
          <p className="text-sm text-muted-foreground">
            Showing careers matching: {selectedPersonalities.length > 0 && `${selectedPersonalities.length} personality type(s)`}
            {selectedPersonalities.length > 0 && selectedInterests.length > 0 && ' & '}
            {selectedInterests.length > 0 && `${selectedInterests.length} interest(s)`}
          </p>
        </div>
      )}
    </div>
  );
}
