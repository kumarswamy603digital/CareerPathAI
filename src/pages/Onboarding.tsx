import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAssessmentHistory } from '@/hooks/useAssessmentHistory';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CareerResultModal } from '@/components/CareerResultModal';
import { PersonalityQuiz } from '@/components/PersonalityQuiz';
import { VoiceCareerAdvisor } from '@/components/VoiceCareerAdvisor';
import { toast } from 'sonner';
import { Compass, Mic, ClipboardList } from 'lucide-react';

interface CareerResult {
  interests: string[];
  personality: string[];
  career: string;
  reasoning?: string;
}

export default function Onboarding() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [careerResult, setCareerResult] = useState<CareerResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { addToHistory } = useAssessmentHistory();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUserId(session.user.id);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUserId(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleCareerResult = (result: CareerResult) => {
    setCareerResult(result);
    setShowResult(true);
  };

  const handleAcceptCareer = async () => {
    if (!userId || !careerResult) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        interests: careerResult.interests,
        personality: careerResult.personality,
        recommended_career: careerResult.career,
        onboarding_completed: true,
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save your results');
      return;
    }

    await addToHistory({
      personality: careerResult.personality,
      interests: careerResult.interests,
      recommended_career: careerResult.career,
    });

    toast.success(`Great choice! Exploring ${careerResult.career}`);
    
    const params = new URLSearchParams();
    params.set('career', careerResult.career);
    params.set('interests', careerResult.interests.join(','));
    params.set('personality', careerResult.personality.join(','));
    
    navigate(`/tree?${params.toString()}`);
  };

  const handleRedoConversation = () => {
    setShowResult(false);
    setCareerResult(null);
    setShowQuiz(false);
    setShowChat(false);
  };

  const handleQuizComplete = (result: CareerResult) => {
    setCareerResult(result);
    setShowQuiz(false);
    setShowResult(true);
  };

  const handleCloseModal = () => {
    setShowResult(false);
    setCareerResult(null);
    setShowQuiz(false);
    setShowChat(false);
  };

  // Show quiz mode
  if (showQuiz) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <PersonalityQuiz
          onComplete={handleQuizComplete}
          onCancel={() => setShowQuiz(false)}
        />
      </div>
    );
  }

  // Show voice chat mode
  if (showChat) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl mb-4">
          <Button
            variant="ghost"
            onClick={() => setShowChat(false)}
            className="text-muted-foreground"
          >
            ← Back
          </Button>
        </div>
        <VoiceCareerAdvisor onCareerResult={handleCareerResult} />
        
        {showResult && careerResult && (
          <CareerResultModal
            career={careerResult.career}
            interests={careerResult.interests}
            personality={careerResult.personality}
            reasoning={careerResult.reasoning}
            onAccept={handleAcceptCareer}
            onRedo={handleRedoConversation}
            onClose={handleCloseModal}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-card border-border shadow-xl">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent mx-auto mb-4">
            <Compass className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-serif">Career Discovery</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Have a voice conversation with our AI advisor to discover your ideal career path.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main action buttons */}
          <div className="flex flex-col items-center gap-3">
            <Button
              size="lg"
              onClick={() => setShowChat(true)}
              className="gap-2 text-lg px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold w-full max-w-xs"
            >
              <Mic className="w-5 h-5" />
              Talk to AI Advisor
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowQuiz(true)}
              className="gap-2 px-8 py-6 w-full max-w-xs"
            >
              <ClipboardList className="w-5 h-5" />
              Take Personality Quiz
            </Button>
          </div>

          {/* Instructions */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm font-serif">How it works:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Voice:</strong> Have a real-time voice conversation with AI</li>
              <li>• <strong>Quiz:</strong> Answer questions if you prefer a structured approach</li>
              <li>• The AI will analyze your responses and recommend careers</li>
              <li>• 🎤 Speak naturally - the AI understands you</li>
            </ul>
          </div>

          {/* Skip option */}
          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/tree')}
              className="text-muted-foreground hover:text-foreground"
            >
              Skip for now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Career Result Modal */}
      {showResult && careerResult && (
        <CareerResultModal
          career={careerResult.career}
          interests={careerResult.interests}
          personality={careerResult.personality}
          reasoning={careerResult.reasoning}
          onAccept={handleAcceptCareer}
          onRedo={handleRedoConversation}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
