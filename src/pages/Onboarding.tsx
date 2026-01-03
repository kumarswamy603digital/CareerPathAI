import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConversation } from '@elevenlabs/react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Mic, MicOff, Compass, Volume2, Loader2 } from 'lucide-react';

const ELEVENLABS_AGENT_ID = 'agent_8501k18x4qeee61vtwnh9g56b0em';

export default function Onboarding() {
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

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

  const saveCareerResults = async (params: { 
    interests: string[]; 
    personality: string; 
    career: string;
  }) => {
    if (!userId) {
      toast.error('User not found');
      return 'Error: User not found';
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        interests: params.interests,
        personality: params.personality,
        recommended_career: params.career,
        onboarding_completed: true,
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save your results');
      return 'Error saving results';
    }

    toast.success(`Great! Your recommended career is: ${params.career}`);
    
    // Navigate after a short delay to let the user hear the final message
    setTimeout(() => {
      navigate('/tree');
    }, 3000);

    return `Successfully saved career recommendation: ${params.career}`;
  };

  const conversation = useConversation({
    clientTools: {
      career: async (params: { interests: string[]; personality: string; career: string }) => {
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
      } as any); // Public agent doesn't require token
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mx-auto mb-4 relative">
            <Compass className="w-10 h-10 text-primary" />
            {isConnected && isSpeaking && (
              <div className="absolute inset-0 rounded-full border-4 border-primary animate-pulse" />
            )}
          </div>
          <CardTitle className="text-2xl">Career Discovery</CardTitle>
          <CardDescription className="text-base">
            Have a conversation with our AI advisor to discover your ideal career path based on your interests and personality.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status indicator */}
          <div className="flex items-center justify-center gap-2 text-sm">
            {isConnected ? (
              <>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
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

          {/* Main action button */}
          <div className="flex justify-center">
            {!isConnected ? (
              <Button
                size="lg"
                onClick={startConversation}
                disabled={isConnecting}
                className="gap-2 text-lg px-8 py-6"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" />
                    Start Conversation
                  </>
                )}
              </Button>
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
            <h4 className="font-medium text-sm">How it works:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Click "Start Conversation" and allow microphone access</li>
              <li>• Talk naturally about your interests, hobbies, and strengths</li>
              <li>• The AI will ask questions to understand your personality</li>
              <li>• Once complete, you'll get your personalized career recommendation</li>
            </ul>
          </div>

          {/* Skip option */}
          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/tree')}
              className="text-muted-foreground"
            >
              Skip for now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
