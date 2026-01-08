import { useConversation } from "@elevenlabs/react";
import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Phone, PhoneOff, Volume2 } from "lucide-react";
import { toast } from "sonner";

interface CareerResult {
  interests: string[];
  personality: string[];
  career: string;
}

interface VoiceCareerAdvisorProps {
  onCareerResult: (result: CareerResult) => void;
}

const AGENT_ID = "agent_8501k18x4qeee61vtwnh9g56b0em";

export function VoiceCareerAdvisor({ onCareerResult }: VoiceCareerAdvisorProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);

  const conversation = useConversation({
    clientTools: {
      career: (params: { personality: string[]; career: string; interests: string[] }) => {
        console.log("Career tool called with:", params);
        
        // Process the career recommendation
        onCareerResult({
          interests: params.interests || [],
          personality: params.personality || [],
          career: params.career || "Software Engineer",
        });
        
        return "Career recommendation saved successfully. Goodbye!";
      },
    },
    onConnect: () => {
      console.log("Connected to ElevenLabs agent");
      toast.success("Connected! Start speaking with the AI advisor.");
    },
    onDisconnect: () => {
      console.log("Disconnected from agent");
      setIsConnecting(false);
    },
    onMessage: (message: unknown) => {
      console.log("Message received:", message);
      
      // Handle transcripts - safely check message type
      const msg = message as { type?: string; user_transcription_event?: { user_transcript?: string }; agent_response_event?: { agent_response?: string } };
      if (msg.type === "user_transcript" || msg.type === "agent_response") {
        const text = msg.type === "user_transcript" 
          ? `You: ${msg.user_transcription_event?.user_transcript || ""}`
          : `AI: ${msg.agent_response_event?.agent_response || ""}`;
        
        if (text && text.length > 4) {
          setTranscript(prev => [...prev.slice(-10), text]);
        }
      }
    },
    onError: (error) => {
      console.error("Conversation error:", error);
      toast.error("Connection error. Please try again.");
      setIsConnecting(false);
    },
  });

  const startConversation = useCallback(async () => {
    setIsConnecting(true);
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start the conversation with the public agent
      await conversation.startSession({
        agentId: AGENT_ID,
      } as Parameters<typeof conversation.startSession>[0]);
    } catch (error) {
      console.error("Failed to start conversation:", error);
      toast.error("Failed to start conversation. Please check microphone permissions.");
      setIsConnecting(false);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const isConnected = conversation.status === "connected";
  const isSpeaking = conversation.isSpeaking;

  return (
    <Card className="w-full max-w-2xl bg-card border-border shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-serif flex items-center justify-center gap-2">
          <Volume2 className="w-6 h-6 text-primary" />
          Voice Career Advisor
        </CardTitle>
        <CardDescription>
          Have a natural conversation with our AI to discover your ideal career
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Status indicator */}
        <div className="flex items-center justify-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
            isConnected 
              ? isSpeaking 
                ? "bg-primary/20 text-primary" 
                : "bg-green-500/20 text-green-600"
              : "bg-muted text-muted-foreground"
          }`}>
            {isConnected ? (
              isSpeaking ? (
                <>
                  <Volume2 className="w-4 h-4 animate-pulse" />
                  <span className="text-sm font-medium">AI is speaking...</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 animate-pulse" />
                  <span className="text-sm font-medium">Listening to you...</span>
                </>
              )
            ) : (
              <>
                <MicOff className="w-4 h-4" />
                <span className="text-sm font-medium">Not connected</span>
              </>
            )}
          </div>
        </div>

        {/* Visual feedback - animated circles */}
        <div className="flex items-center justify-center py-8">
          <div className={`relative w-32 h-32 rounded-full flex items-center justify-center ${
            isConnected 
              ? isSpeaking 
                ? "bg-primary/10" 
                : "bg-green-500/10"
              : "bg-muted"
          }`}>
            {isConnected && (
              <>
                <div className={`absolute inset-0 rounded-full animate-ping opacity-25 ${
                  isSpeaking ? "bg-primary" : "bg-green-500"
                }`} style={{ animationDuration: '2s' }} />
                <div className={`absolute inset-4 rounded-full animate-ping opacity-25 ${
                  isSpeaking ? "bg-primary" : "bg-green-500"
                }`} style={{ animationDuration: '2.5s' }} />
              </>
            )}
            {isSpeaking ? (
              <Volume2 className="w-12 h-12 text-primary" />
            ) : isConnected ? (
              <Mic className="w-12 h-12 text-green-600" />
            ) : (
              <MicOff className="w-12 h-12 text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Transcript area */}
        {transcript.length > 0 && (
          <div className="bg-muted/50 rounded-lg p-4 max-h-40 overflow-y-auto space-y-2">
            {transcript.map((line, i) => (
              <p key={i} className={`text-sm ${
                line.startsWith("You:") ? "text-foreground" : "text-muted-foreground"
              }`}>
                {line}
              </p>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-center">
          {!isConnected ? (
            <Button
              size="lg"
              onClick={startConversation}
              disabled={isConnecting}
              className="gap-2 text-lg px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isConnecting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Phone className="w-5 h-5" />
                  Start Voice Call
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
              <PhoneOff className="w-5 h-5" />
              End Call
            </Button>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <h4 className="font-medium text-sm font-serif">How it works:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Click "Start Voice Call" and allow microphone access</li>
            <li>• Have a natural conversation about your interests and goals</li>
            <li>• The AI will recommend a career based on your discussion</li>
            <li>• Speak naturally - the AI understands conversational speech</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
