import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, Sender } from '../types';
import { AlertTriangle, User, Terminal } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  onAnalyze?: (text: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onAnalyze }) => {
  const isUser = message.sender === Sender.USER;
  const isSystem = message.sender === Sender.SYSTEM;
  const isAnalysis = message.isAnalysis;

  if (isSystem) {
      return (
          <div className="flex justify-center my-4 opacity-50">
              <span className="text-xs font-mono text-gray-400 border border-gray-700 px-2 py-1 rounded">
                  {message.text}
              </span>
          </div>
      )
  }

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-charcoal border border-gray-700' : 
          isAnalysis ? 'bg-red-900/20 border border-red-500/50 text-red-500' : 'bg-indigo-900/20 border border-indigo-500/50 text-indigo-400'
        }`}>
          {isUser ? <User size={14} className="text-gray-400" /> : 
           isAnalysis ? <AlertTriangle size={14} /> : <Terminal size={14} />}
        </div>

        {/* Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-4 py-3 rounded-lg shadow-md font-sans text-sm leading-relaxed overflow-hidden
            ${isUser 
              ? 'bg-slate text-gray-100 rounded-tr-none' 
              : isAnalysis 
                ? 'bg-red-950/30 border border-red-900/50 text-red-100 rounded-tl-none'
                : 'bg-charcoal border border-gray-800 text-gray-200 rounded-tl-none'
            }
          `}>
            {message.isThinking ? (
               <div className="flex items-center gap-2 text-gray-500 animate-pulse">
                 <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                 <div className="w-2 h-2 bg-gray-500 rounded-full delay-75"></div>
                 <div className="w-2 h-2 bg-gray-500 rounded-full delay-150"></div>
               </div>
            ) : (
              <ReactMarkdown 
                components={{
                    p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-outside ml-4 mb-2 space-y-1" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-4 mb-2 space-y-1" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-2 border-gray-500 pl-3 italic text-gray-400 my-2" {...props} />,
                }}
              >
                {message.text}
              </ReactMarkdown>
            )}
          </div>

          {/* Actions for User Messages */}
          {isUser && !message.isThinking && onAnalyze && (
             <button 
                onClick={() => onAnalyze(message.text)}
                className="mt-1 text-xs text-red-400 hover:text-red-300 flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
             >
                <AlertTriangle size={10} /> Check for BS
             </button>
          )}
          
          <span className="text-[10px] text-gray-600 mt-1 font-mono">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};
