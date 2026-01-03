import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Mouse, 
  Move, 
  ZoomIn, 
  Filter, 
  Search, 
  Keyboard,
  Heart,
  Maximize
} from 'lucide-react';
import { cn } from '@/lib/utils';

const TUTORIAL_STORAGE_KEY = 'careerpath-tree-tutorial-completed';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to the Career Tree!',
    description: 'This interactive tree helps you explore 60+ career paths. Let us show you how to navigate it.',
    icon: <Maximize className="w-8 h-8 text-primary" />,
    position: 'center',
  },
  {
    id: 'pan',
    title: 'Pan & Navigate',
    description: 'Click and drag anywhere on the background to pan around the tree. On mobile, use one finger to drag.',
    icon: <Move className="w-8 h-8 text-primary" />,
    position: 'center',
  },
  {
    id: 'zoom',
    title: 'Zoom In & Out',
    description: 'Use your mouse scroll wheel to zoom, or pinch on mobile. You can also use the + and - buttons in the bottom-left controls.',
    icon: <ZoomIn className="w-8 h-8 text-primary" />,
    position: 'bottom-left',
  },
  {
    id: 'click',
    title: 'Select a Career',
    description: 'Click on any career node to view detailed information including salary, education requirements, and job outlook.',
    icon: <Mouse className="w-8 h-8 text-primary" />,
    position: 'center',
  },
  {
    id: 'filter',
    title: 'Filter Careers',
    description: 'Use the filter panel on the left to narrow down careers by personality type, interests, salary range, and more.',
    icon: <Filter className="w-8 h-8 text-primary" />,
    position: 'top-left',
  },
  {
    id: 'search',
    title: 'Search Careers',
    description: 'Use the search bar at the top to quickly find specific careers by name.',
    icon: <Search className="w-8 h-8 text-primary" />,
    position: 'top-right',
  },
  {
    id: 'keyboard',
    title: 'Keyboard Navigation',
    description: 'Use arrow keys to navigate between careers, Enter to select, and Escape to exit keyboard mode.',
    icon: <Keyboard className="w-8 h-8 text-primary" />,
    position: 'center',
  },
  {
    id: 'shortlist',
    title: 'Save to Shortlist',
    description: 'Click the heart icon on any career to add it to your shortlist for easy comparison later.',
    icon: <Heart className="w-8 h-8 text-primary" />,
    position: 'center',
  },
];

interface TreeOnboardingTutorialProps {
  onComplete: () => void;
}

export function TreeOnboardingTutorial({ onComplete }: TreeOnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const step = tutorialSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tutorialSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
    setIsVisible(false);
    onComplete();
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!isVisible) return null;

  const positionClasses = {
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'top-left': 'top-24 left-24 md:left-80',
    'top-right': 'top-24 right-8 md:right-24',
    'bottom-left': 'bottom-24 left-8 md:left-24',
    'bottom-right': 'bottom-24 right-8 md:right-24',
  };

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      
      {/* Tutorial Card */}
      <Card
        className={cn(
          'absolute w-[90vw] max-w-md p-6 shadow-2xl border-primary/20 bg-card animate-in fade-in-0 zoom-in-95 duration-300',
          positionClasses[step.position]
        )}
      >
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8"
          onClick={handleSkip}
          aria-label="Skip tutorial"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Progress indicator */}
        <div className="flex gap-1 mb-4">
          {tutorialSteps.map((_, index) => (
            <div
              key={index}
              className={cn(
                'h-1 flex-1 rounded-full transition-colors',
                index <= currentStep ? 'bg-primary' : 'bg-muted'
              )}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent mb-4">
            {step.icon}
          </div>
          <h2 className="text-xl font-serif font-bold mb-2 text-foreground">
            {step.title}
          </h2>
          <p className="text-muted-foreground">
            {step.description}
          </p>
        </div>

        {/* Step counter */}
        <p className="text-xs text-muted-foreground text-center mb-4">
          Step {currentStep + 1} of {tutorialSteps.length}
        </p>

        {/* Navigation buttons */}
        <div className="flex gap-2">
          {!isFirstStep && (
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="flex-1"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          )}
          {isFirstStep && (
            <Button
              variant="outline"
              onClick={handleSkip}
              className="flex-1"
            >
              Skip Tour
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLastStep ? "Let's Go!" : 'Next'}
            {!isLastStep && <ChevronRight className="w-4 h-4 ml-1" />}
          </Button>
        </div>
      </Card>
    </div>
  );
}

export function useTutorialStatus() {
  const [hasCompletedTutorial, setHasCompletedTutorial] = useState<boolean | null>(null);

  useEffect(() => {
    const completed = localStorage.getItem(TUTORIAL_STORAGE_KEY) === 'true';
    setHasCompletedTutorial(completed);
  }, []);

  const resetTutorial = () => {
    localStorage.removeItem(TUTORIAL_STORAGE_KEY);
    setHasCompletedTutorial(false);
  };

  return { hasCompletedTutorial, resetTutorial };
}
