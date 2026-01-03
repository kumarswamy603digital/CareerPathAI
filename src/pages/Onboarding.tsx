import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConversation } from '@elevenlabs/react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CareerResultModal } from '@/components/CareerResultModal';
import { PersonalityQuiz } from '@/components/PersonalityQuiz';
import { toast } from 'sonner';
import { Mic, MicOff, Compass, Volume2, Loader2, ClipboardList } from 'lucide-react';

const ELEVENLABS_AGENT_ID = 'agent_8501k18x4qeee61vtwnh9g56b0em';

interface CareerResult {
  interests: string[];
  personality: string[];
  career: string;
  reasoning?: string;
}

export default function Onboarding() {
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [careerResult, setCareerResult] = useState<CareerResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

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

  const saveCareerResults = async (params: CareerResult) => {
    if (!userId) {
      toast.error('User not found');
      return 'Error: User not found';
    }

    console.log('Career tool called with:', params);
    
    // Store the result and show modal instead of saving immediately
    setCareerResult(params);
    setShowResult(true);

    return `Career recommendation received: ${params.career}. Showing to user for confirmation.`;
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

    toast.success(`Great choice! Exploring ${careerResult.career}`);
    
    // Navigate to tree with filters applied via URL params
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
    // End current session if connected
    if (conversation.status === 'connected') {
      conversation.endSession();
    }
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
  };

  const conversation = useConversation({
    clientTools: {
      career: async (params: { interests: string[]; personality: string[]; career: string; reasoning?: string }) => {
        console.log('Career tool called with:', params);
        return await saveCareerResults(params);
      },
    },
    onConnect: () => {
      console.log('Connected to ElevenLabs agent');
      toast.success('Connected! Start speaking with your career advisor.');
    },
    onDisconnect: () => {
      console.log('Disconnected from agent');
    },
    onError: (error) => {
      console.error('Conversation error:', error);
      toast.error('Connection error. Please try again.');
      setIsConnecting(false);
    },
  });

  const startConversation = useCallback(async () => {
    setIsConnecting(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      await conversation.startSession({
        agentId: ELEVENLABS_AGENT_ID,
      } as any);
    } catch (error) {
      console.error('Failed to start conversation:', error);
      toast.error('Failed to start conversation. Please allow microphone access.');
    } finally {
      setIsConnecting(false);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const isConnected = conversation.status === 'connected';
  const isSpeaking = conversation.isSpeaking;

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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-card border-border shadow-xl">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent mx-auto mb-4 relative">
            <Compass className="w-10 h-10 text-primary" />
            {isConnected && isSpeaking && (
              <div className="absolute inset-0 rounded-full border-4 border-primary animate-pulse" />
            )}
          </div>
          <CardTitle className="text-2xl font-serif">Career Discovery</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Have a conversation with our AI advisor to discover your ideal career path based on your interests and personality.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status indicator */}
          <div className="flex items-center justify-center gap-2 text-sm">
            {isConnected ? (
              <>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-muted-foreground">
                  {isSpeaking ? 'AI is speaking...' : 'Listening...'}
                </span>
                {isSpeaking && <Volume2 className="w-4 h-4 text-primary animate-pulse" />}
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                <span className="text-muted-foreground">Not connected</span>
              </>
            )}
          </div>

          {/* Main action buttons */}
          <div className="flex flex-col items-center gap-3">
            {!isConnected ? (
              <>
                <Button
                  size="lg"
                  onClick={startConversation}
                  disabled={isConnecting}
                  className="gap-2 text-lg px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold w-full max-w-xs"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5" />
                      Start Voice Chat
                    </>
                  )}
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
              </>
            ) : (
              <Button
                size="lg"
                variant="destructive"
                onClick={stopConversation}
                className="gap-2 text-lg px-8 py-6"
              >
                <MicOff className="w-5 h-5" />
                End Conversation
              </Button>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm font-serif">How it works:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Voice Chat:</strong> Talk naturally about your interests and strengths</li>
              <li>• <strong>Quiz:</strong> Answer questions if you prefer typing</li>
              <li>• The AI will analyze your responses and recommend careers</li>
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
