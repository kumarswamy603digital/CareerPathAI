import { useState, useCallback, useRef, useEffect } from 'react';
import { useConversation } from '@elevenlabs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { MessageCircle, X, Mic, MicOff, Loader2, Volume2, Send, Keyboard } from 'lucide-react';
import { cn } from '@/lib/utils';

const ELEVENLABS_AGENT_ID = 'agent_8501k18x4qeee61vtwnh9g56b0em';
const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/career-chat`;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const micErrorToMessage = (err: unknown) => {
  const e = err as Partial<DOMException> | undefined;
  const name = e?.name;

  switch (name) {
    case 'NotAllowedError':
    case 'PermissionDeniedError':
      return 'Microphone permission denied. Please allow microphone access for this site (try opening in a new tab if you are in a preview).';
    case 'NotFoundError':
      return 'No microphone found. Please connect a microphone and try again.';
    case 'NotReadableError':
      return 'Microphone is busy or unavailable (another app may be using it). Close other apps and try again.';
    case 'SecurityError':
      return 'Microphone access requires a secure context (HTTPS).';
    default:
      return null;
  }
};

const isEmbedded = () => {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
};

export function AIChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [mode, setMode] = useState<'voice' | 'text'>('voice');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const conversation = useConversation({
    clientTools: {
      career: (params: { personality: string[]; career: string; interests: string[] }) => {
        console.log("Career tool called with:", params);
        toast.success(`Career recommendation: ${params.career}`, {
          description: `Based on your interests and personality, we recommend ${params.career}!`,
          duration: 10000,
        });
        return "Career recommendation noted. Feel free to ask more questions!";
      },
    },
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Cleanup to prevent orphaned sessions (can cause "connected but silent" behavior)
  useEffect(() => {
    return () => {
      conversation.endSession();
    };
  }, [conversation]);

  const startConversation = useCallback(async () => {
    setIsConnecting(true);

    // Microphone access is often blocked inside embedded previews/iframes.
    if (isEmbedded()) {
      toast.error('Voice chat needs to run in a new tab to access the microphone. Opening a new tab now.');
      window.open(window.location.href, '_blank', 'noopener,noreferrer');
      setIsConnecting(false);
      return;
    }

    // If a previous session is still around, end it first.
    if (conversation.status === 'connected') {
      await conversation.endSession();
    }

    try {
      await conversation.startSession({
        agentId: ELEVENLABS_AGENT_ID,
        connectionType: 'webrtc',
      });

      await conversation.setVolume({ volume: 1 });

      toast.success('Connected! Ask me anything about careers.');
    } catch (err) {
      const micMsg = micErrorToMessage(err);
      const fallback = err instanceof Error ? err.message : '';
      console.error('Failed to start voice session:', err);
      toast.error(micMsg ?? (fallback ? `Failed to start voice chat: ${fallback}` : 'Failed to start voice chat.'));
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

  const sendTextMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    let assistantContent = '';

    try {
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant') {
                  return prev.map((m, i) => 
                    i === prev.length - 1 ? { ...m, content: assistantContent } : m
                  );
                }
                return [...prev, { role: 'assistant', content: assistantContent }];
              });
            }
          } catch {
            // Incomplete JSON, wait for more data
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to get response');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendTextMessage();
    }
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
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-xl animate-in slide-in-from-bottom-4 fade-in duration-300 flex flex-col max-h-[500px]">
          {/* Header */}
          <div className="p-4 border-b border-border shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-semibold text-foreground">Career Advisor</h3>
                <p className="text-xs text-muted-foreground">Ask about any career</p>
              </div>
              {/* Mode toggle */}
              <div className="flex gap-1 bg-muted rounded-lg p-1">
                <button
                  onClick={() => { setMode('voice'); if (isConnected) stopConversation(); }}
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    mode === 'voice' ? "bg-card shadow-sm" : "hover:bg-card/50"
                  )}
                  title="Voice chat"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { setMode('text'); if (isConnected) stopConversation(); }}
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    mode === 'text' ? "bg-card shadow-sm" : "hover:bg-card/50"
                  )}
                  title="Text chat"
                >
                  <Keyboard className="w-4 h-4" />
                </button>
              </div>
            </div>
            
          </div>
          
          {mode === 'voice' ? (
            /* Voice mode */
            <div className="p-6 flex flex-col items-center gap-4">
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

              <p className="text-sm text-center text-muted-foreground">
                {isConnecting 
                  ? 'Connecting...' 
                  : isConnected 
                    ? isSpeaking 
                      ? 'AI is speaking...' 
                      : 'Listening... Ask me anything!'
                    : 'Start a voice conversation'}
              </p>

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
          ) : (
            /* Text mode */
            <>
              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Ask me anything about careers, salaries, skills, or education paths!
                    </p>
                  )}
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex",
                        msg.role === 'user' ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[85%] rounded-2xl px-4 py-2 text-sm",
                          msg.role === 'user'
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-muted text-foreground rounded-bl-md"
                        )}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && messages[messages.length - 1]?.role === 'user' && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2">
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-3 border-t border-border shrink-0">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your question..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    onClick={sendTextMessage}
                    disabled={!input.trim() || isLoading}
                    size="icon"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}

          <div className="px-4 pb-3 shrink-0">
            <p className="text-[10px] text-center text-muted-foreground">
              {mode === 'voice' 
                ? 'Prefer typing? Switch to text mode above' 
                : 'Prefer talking? Switch to voice mode above'}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
