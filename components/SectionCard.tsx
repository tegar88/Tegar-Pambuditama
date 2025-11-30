import React, { useState } from 'react';
import { KamiSection } from '../types';
import { Sparkles, Maximize2, RotateCcw, Copy } from 'lucide-react';

interface SectionCardProps {
  section: KamiSection;
  onUpdate: (id: string, newContent: string) => void;
  onAiAssist: (section: KamiSection, prompt: string) => void;
}

const SectionCard: React.FC<SectionCardProps> = ({ section, onUpdate, onAiAssist }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [showAiInput, setShowAiInput] = useState(false);

  const handleAiSubmit = () => {
    if (!prompt.trim()) return;
    onAiAssist(section, prompt);
    setPrompt('');
    setShowAiInput(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(section.content);
  };

  const cardClass = `
    relative flex flex-col h-full bg-kami-card border border-gray-700 rounded-xl overflow-hidden transition-all duration-300
    ${isExpanded ? 'fixed inset-4 z-50 shadow-2xl border-kami-primary' : 'hover:border-kami-accent/50 shadow-lg'}
  `;

  return (
    <div className={cardClass}>
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b border-gray-700 ${section.color}`}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white font-bold backdrop-blur-sm">
            {section.key}
          </div>
          <div>
            <h3 className="font-semibold text-white tracking-wide">{section.title}</h3>
            <p className="text-xs text-white/70">{section.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title={isExpanded ? "Minimize" : "Expand"}
          >
            {isExpanded ? <RotateCcw size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative group">
        <textarea
          className="w-full h-full p-4 bg-transparent text-gray-200 resize-none focus:outline-none focus:bg-white/5 transition-colors leading-relaxed placeholder-gray-600"
          placeholder={`Enter details for ${section.title}...`}
          value={section.content}
          onChange={(e) => onUpdate(section.id, e.target.value)}
          disabled={section.isLoading}
        />
        
        {section.isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-kami-accent"></div>
              <span className="text-sm text-kami-accent animate-pulse">Gemini is thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* AI Toolbar */}
      <div className="p-3 border-t border-gray-700 bg-black/20">
        {!showAiInput ? (
          <div className="flex justify-between items-center">
             <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-colors"
            >
              <Copy size={14} />
              Copy
            </button>
            <button
              onClick={() => setShowAiInput(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-kami-primary/20 text-kami-accent hover:bg-kami-primary/30 rounded-full text-xs font-medium transition-all"
            >
              <Sparkles size={14} />
              AI Suggest
            </button>
          </div>
        ) : (
          <div className="flex gap-2 animate-in slide-in-from-bottom-2 fade-in duration-200">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Focus on digital transformation..."
              className="flex-1 bg-gray-800 text-xs text-white rounded px-3 py-1.5 border border-gray-600 focus:border-kami-primary focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleAiSubmit()}
              autoFocus
            />
            <button
              onClick={handleAiSubmit}
              className="px-3 py-1.5 bg-kami-primary text-white text-xs rounded hover:bg-indigo-500 transition-colors"
            >
              Go
            </button>
            <button
              onClick={() => setShowAiInput(false)}
              className="px-2 py-1.5 text-gray-400 hover:text-white text-xs"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionCard;