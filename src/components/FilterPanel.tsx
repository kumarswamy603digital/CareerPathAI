import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, X, Filter } from 'lucide-react';
import { personalities, interests, Personality, Interest } from '@/data/careerData';
import { cn } from '@/lib/utils';

interface FilterPanelProps {
  selectedPersonalities: Personality[];
  selectedInterests: Interest[];
  onPersonalityChange: (personalities: Personality[]) => void;
  onInterestChange: (interests: Interest[]) => void;
}

export function FilterPanel({
  selectedPersonalities,
  selectedInterests,
  onPersonalityChange,
  onInterestChange,
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
    <div className="w-80 bg-card border-r border-border h-full flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-lg">Filters</h2>
        </div>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="text-muted-foreground">
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Personality Filter */}
          <Collapsible open={personalityOpen} onOpenChange={setPersonalityOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted rounded-lg transition-colors">
              <span className="font-medium">Personality Type</span>
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
                      selectedPersonalities.includes(p) && "bg-primary text-primary-foreground"
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
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted rounded-lg transition-colors">
              <span className="font-medium">Interests</span>
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
                      selectedInterests.includes(i) && "bg-primary text-primary-foreground"
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
        <div className="p-4 border-t border-border bg-muted/50">
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
