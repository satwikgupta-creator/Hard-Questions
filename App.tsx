import React, { useState, useRef, useEffect } from 'react';
import { initializeChat, sendMessageStream, analyzeDistortions } from './services/geminiService';
import { Message, Sender } from './types';
import { MessageBubble } from './components/MessageBubble';
import { Onboarding } from './components/Onboarding';
import { Send, StopCircle, RefreshCw, Sparkles } from 'lucide-react';
import { GenerateContentResponse } from '@google/genai';

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleOnboardingComplete = async (context: string) => {
    setHasStarted(true);
    initializeChat();
    
    // Add system start message visually
    const startMsg: Message = {
        id: Date.now().toString(),
        text: "Initializing psychological profile...",
        sender: Sender.SYSTEM,
        timestamp: Date.now()
    };
    setMessages([startMsg]);

    // Send initial context to AI without showing it in chat bubble (it's the prompt)
    setIsLoading(true);
    
    const initialPrompt = `
      ${context}
      
      Okay, I've just given you my honest assessment of why I'm behind. 
      Start by tearing apart my excuses or validating my reality, then ask me the first hard question.
    `;

    await processAIResponse(initialPrompt, false); // false = don't display user prompt in UI, just the AI response
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: Sender.USER,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    await processAIResponse(userMsg.text);
  };

  const processAIResponse = async (prompt: string, displayPromptAsUserMsg = true) => {
    try {
        // Add placeholder for AI response
        const aiMsgId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, {
            id: aiMsgId,
            text: "",
            sender: Sender.AI,
            timestamp: Date.now(),
            isThinking: true
        }]);

        const stream = await sendMessageStream(prompt);
        
        let fullText = "";
        
        for await (const chunk of stream) {
            const textChunk = (chunk as GenerateContentResponse).text || "";
            fullText += textChunk;
            
            setMessages(prev => prev.map(msg => 
                msg.id === aiMsgId 
                ? { ...msg, text: fullText, isThinking: false }
                : msg
            ));
        }

    } catch (error) {
        console.error(error);
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            text: "Error: The mirror is clouded. Check your connection or API Key.",
            sender: Sender.SYSTEM,
            timestamp: Date.now()
        }]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleBSCheck = async (text: string) => {
      // Analyze specific text
      const analysisId = Date.now().toString();
      setMessages(prev => [...prev, {
          id: analysisId,
          text: "Analyzing for cognitive distortions...",
          sender: Sender.AI,
          timestamp: Date.now(),
          isThinking: true,
          isAnalysis: true
      }]);

      const analysis = await analyzeDistortions(text);

      setMessages(prev => prev.map(msg => 
          msg.id === analysisId
          ? { ...msg, text: analysis, isThinking: false }
          : msg
      ));
  };

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-obsidian text-white font-sans">
        <Onboarding onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-obsidian text-white font-sans overflow-hidden">
      
      {/* Header */}
      <header className="flex-none p-4 border-b border-gray-800 flex items-center justify-between bg-obsidian z-10">
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse-slow"></div>
            <h1 className="font-bold tracking-tight text-lg">THE MIRROR</h1>
        </div>
        <div className="text-xs text-gray-500 font-mono hidden md:block">
            SESSION ACTIVE // REALITY CHECK IN PROGRESS
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
        <div className="max-w-3xl mx-auto">
            {messages.map((msg) => (
                <MessageBubble 
                    key={msg.id} 
                    message={msg} 
                    onAnalyze={handleBSCheck}
                />
            ))}
            <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="flex-none p-4 bg-charcoal border-t border-gray-800">
        <div className="max-w-3xl mx-auto relative">
            <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                    if(e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                    }
                }}
                disabled={isLoading}
                placeholder={isLoading ? "Thinking..." : "Respond honestly..."}
                className="w-full bg-obsidian border border-gray-700 rounded-xl p-4 pr-12 text-white placeholder-gray-600 focus:border-indigo-500 outline-none resize-none h-20 md:h-24 shadow-inner font-mono text-sm"
            />
            
            <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || isLoading}
                    className={`p-2 rounded-lg transition-all ${
                        inputText.trim() && !isLoading 
                        ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-900/50' 
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    }`}
                >
                   {isLoading ? <RefreshCw className="animate-spin" size={18} /> : <Send size={18} />}
                </button>
            </div>
        </div>
        <div className="text-center mt-2">
            <p className="text-[10px] text-gray-600">
                AI can make mistakes. Verify important information. This is for coaching purposes only.
            </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
