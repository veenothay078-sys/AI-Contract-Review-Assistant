import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Loader2, Bot, User, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../contexts/AuthContext';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export default function QAModule({ contractText, onViewClauseDetails }) {
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !contractText) return;

    const userMessage = { role: 'user', content: inputValue.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/qa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          contractText,
          question: userMessage.content,
          history: messages
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get answer from AI');
      }

      setMessages(prev => [...prev, { role: 'model', content: data.answer }]);
    } catch (err) {
      console.error(err);
      setError(err.message || 'A network error occurred while contacting the AI.');
      // Remove the user message if it failed completely, or just show error?
      // Better to keep it and show error
    } finally {
      setIsLoading(false);
    }
  };

  if (!contractText) return null;

  return (
    <section id="qa-module" className="px-6 py-6 mb-8">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col h-[600px] overflow-hidden"
      >
        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-border/50 shrink-0">
          <div className="p-2.5 bg-accent/10 rounded-xl border border-accent/20">
            <MessageSquare className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-textPrimary">Ask Your Contract</h2>
            <p className="text-sm text-textMuted mt-0.5">Ask questions in natural language about the uploaded agreement</p>
          </div>
        </div>
          
          {/* Chat History Area */}
          <div className="flex-1 overflow-y-auto px-2 space-y-6 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-textMuted opacity-70">
                <Bot className="w-12 h-12 mb-3 text-border" />
                <p className="text-sm">No questions asked yet.</p>
                <p className="text-xs mt-1">Try asking: "Who can terminate this agreement?" or "What is the notice period?"</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                    msg.role === 'user' ? 'bg-accent text-background' : 'bg-background border border-border text-accent'
                  }`}>
                    {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  
                  <div className={`max-w-[80%] rounded-2xl px-5 py-4 ${
                    msg.role === 'user' 
                      ? 'bg-background border border-border/50 text-textPrimary' 
                      : 'bg-background/50 border border-border/50 text-textPrimary prose prose-sm prose-invert prose-p:leading-relaxed prose-pre:bg-card max-w-none'
                  }`}>
                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap text-[15px]">{msg.content}</p>
                    ) : (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    )}
                  </div>
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-card border border-border text-accent flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-6 py-4 shadow-subtle flex items-center gap-3">
                  <Loader2 className="w-4 h-4 text-accent animate-spin" />
                  <span className="text-sm text-textMuted font-medium animate-pulse">Analyzing contract text...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-danger/10 border border-danger/30 text-danger flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="bg-danger/10 border border-danger/20 rounded-2xl rounded-tl-sm px-5 py-3 shadow-subtle max-w-[80%]">
                  <p className="text-sm text-danger">{error}</p>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="pt-4 mt-4 border-t border-border/50 shrink-0">
            <form onSubmit={handleSendMessage} className="relative flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about payment terms, termination, obligations..."
                className="w-full bg-background border border-border rounded-full pl-5 pr-14 py-3.5 text-sm text-textPrimary placeholder:text-textMuted focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent transition-all"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="absolute right-2 p-2 bg-accent hover:bg-accentSecondary text-background rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

      </motion.div>
    </section>
  );
}
