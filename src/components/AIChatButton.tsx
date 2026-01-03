import { useState, useCallback } from 'react';
import { useConversation } from '@elevenlabs/react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { MessageCircle, X, Mic, MicOff, Loader2, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const ELEVENLABS_AGENT_ID = 'agent_8501k18x4qeee61vtwnh9g56b0em';

export function AIChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs agent');
      toast.success('Connected! Ask me anything about careers.');
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

  const isConnected = conversation.status === 'connected';
  const isSpeaking = conversation.isSpeaking;

  const startConversation = useCallback(async () => {
    setIsConnecting(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({
        agentId: ELEVENLABS_AGENT_ID,
      } as any);
    } catch (error) {
      console.error('Failed to start conversation:', error);
      toast.error('Failed to connect. Please allow microphone access.');
    } finally {
      setIsConnecting(false);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const handleToggle = () => {
    if (isOpen && isConnected) {
      stopConversation();
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating button */}
      <Button
        onClick={handleToggle}
        size="icon"
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-300",
          isOpen 
            ? "bg-muted hover:bg-muted/80" 
            : "bg-primary hover:bg-primary/90 glow-amber"
        )}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </Button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-card border border-border rounded-2xl shadow-xl animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="p-4 border-b border-border">
            <h3 className="font-serif font-semibold text-foreground">Career Advisor</h3>
            <p className="text-xs text-muted-foreground">Ask follow-up questions about any career</p>
          </div>
          
          <div className="p-6 flex flex-col items-center gap-4">
            {/* Status indicator */}
            <div className={cn(
              "w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300",
              isConnected 
                ? isSpeaking 
                  ? "bg-primary/20 animate-pulse" 
                  : "bg-primary/10"
                : "bg-muted"
            )}>
              {isConnecting ? (
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              ) : isConnected ? (
                isSpeaking ? (
                  <Volume2 className="w-10 h-10 text-primary animate-pulse" />
                ) : (
                  <Mic className="w-10 h-10 text-primary" />
                )
              ) : (
                <MicOff className="w-10 h-10 text-muted-foreground" />
              )}
            </div>

            {/* Status text */}
            <p className="text-sm text-center text-muted-foreground">
              {isConnecting 
                ? 'Connecting...' 
                : isConnected 
                  ? isSpeaking 
                    ? 'AI is speaking...' 
                    : 'Listening... Ask me anything!'
                  : 'Start a voice conversation'}
            </p>

            {/* Action button */}
            <Button
              onClick={isConnected ? stopConversation : startConversation}
              disabled={isConnecting}
              variant={isConnected ? "outline" : "default"}
              className="w-full"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : isConnected ? (
                <>
                  <MicOff className="w-4 h-4 mr-2" />
                  End Conversation
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Start Talking
                </>
              )}
            </Button>
          </div>

          <div className="px-4 pb-4">
            <p className="text-[10px] text-center text-muted-foreground">
              Ask about salaries, skills, education paths, or career transitions
            </p>
          </div>
        </div>
      )}
    </>
  );
}
