import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, RefreshCw, Zap, ShieldCheck, ChevronDown } from 'lucide-react';
import { chatWithGemini, ChatMessage } from '../../services/geminiService';
import { useAuth } from '../../contexts/AuthContext';

export const AIChatbotWidget: React.FC = () => {
  const { user, role } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: `Halo ${user?.name || 'Mitra'}! ⚡ Saya **Spora AI Recruiter Agent** terintegrasi dengan Google Gemini AI. Ada yang bisa saya bantu terkait kandidat EV, asesmen, atau rekrutmen hari ini?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = textToSend || inputMessage.trim();
    if (!prompt || isLoading) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const aiReplyText = await chatWithGemini(prompt, role || 'student', `Nama User: ${user?.name}, Email: ${user?.email}`);
      const aiMsg: ChatMessage = {
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        sender: 'ai',
        text: 'Maaf, terjadi kendala saat menghubungkan ke Google Gemini AI Agent. Silakan coba lagi.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-slate-900 via-[#0099B8] to-cyan-500 text-white p-3.5 sm:px-4 sm:py-3.5 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-2.5 border-2 border-white/20 group"
          title="Open Spora AI Assistant"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900"></span>
          </div>
          <span className="font-bold text-xs tracking-wide hidden sm:inline">Spora AI Agent</span>
        </button>
      )}

      {/* Expanded Chatbot Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[380px] h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#0099B8] text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-cyan-300 border border-white/20">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-extrabold text-sm flex items-center gap-1.5 leading-tight">
                  Spora AI Agent <Sparkles size={13} className="text-amber-300" />
                </h3>
                <span className="text-[10px] text-cyan-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Powered by Google Gemini AI
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Suggestion Chips */}
          <div className="bg-slate-50 p-2 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
            {[
              "⚡ Rekomendasi Talent EV",
              "🏭 Kebutuhan Industri",
              "🎓 Tips Interview Vokasi"
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="px-2.5 py-1 bg-white border border-slate-200 rounded-full text-slate-700 hover:border-[#0099B8] hover:text-[#0099B8] font-medium whitespace-nowrap transition-colors shadow-2xs"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 items-start ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                  msg.sender === 'user' ? 'bg-[#0099B8] text-white' : 'bg-slate-900 text-cyan-300'
                }`}>
                  {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>

                <div className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#0099B8] text-white rounded-tr-none font-medium'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-2xs'
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span className={`block text-[9px] mt-1.5 ${msg.sender === 'user' ? 'text-cyan-100 text-right' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-xs text-slate-500 font-medium animate-pulse pt-2">
                <Bot size={16} className="text-[#0099B8]" />
                <span>Google Gemini AI is thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Tanyakan ke Spora AI Agent..."
              className="flex-1 p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0099B8] focus:outline-none bg-slate-50"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="p-2.5 bg-[#0099B8] hover:bg-[#007A93] text-white rounded-xl disabled:opacity-50 transition-colors shadow-sm"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
