import React from 'react';
import { AnalysisResult } from '../types';
import { X, CheckCircle, AlertTriangle, Lightbulb, Activity } from 'lucide-react';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: AnalysisResult | null;
  isLoading: boolean;
}

const AnalysisModal: React.FC<AnalysisModalProps> = ({ isOpen, onClose, result, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-kami-card w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-gray-700 animate-in zoom-in-95 duration-200">
        <div className="sticky top-0 bg-kami-card/95 backdrop-blur border-b border-gray-700 p-6 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Activity className="text-kami-accent" />
            KAMI Global Analysis
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-kami-primary mb-6"></div>
              <p className="text-lg text-gray-300">Gemini is analyzing your strategy...</p>
              <p className="text-sm text-gray-500 mt-2">Connecting dots between Context, Analysis, Method, and Impact.</p>
            </div>
          ) : result ? (
            <div className="space-y-8">
              {/* Score & Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800/50 rounded-xl p-6 flex flex-col items-center justify-center border border-gray-700">
                  <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-kami-accent to-purple-400">
                    {result.score}
                  </div>
                  <div className="text-sm text-gray-400 mt-2 font-medium">Strategy Score</div>
                </div>
                <div className="md:col-span-2 bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">Executive Summary</h3>
                  <p className="text-gray-200 leading-relaxed">{result.summary}</p>
                </div>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                   <h3 className="flex items-center gap-2 text-green-400 font-semibold border-b border-gray-700 pb-2">
                     <CheckCircle size={18} /> Strengths
                   </h3>
                   <ul className="space-y-2">
                     {result.strengths.map((item, idx) => (
                       <li key={idx} className="flex gap-2 text-gray-300 text-sm">
                         <span className="text-green-500/50">•</span> {item}
                       </li>
                     ))}
                   </ul>
                </div>

                <div className="space-y-4">
                   <h3 className="flex items-center gap-2 text-red-400 font-semibold border-b border-gray-700 pb-2">
                     <AlertTriangle size={18} /> Weaknesses & Risks
                   </h3>
                   <ul className="space-y-2">
                     {result.weaknesses.map((item, idx) => (
                       <li key={idx} className="flex gap-2 text-gray-300 text-sm">
                         <span className="text-red-500/50">•</span> {item}
                       </li>
                     ))}
                   </ul>
                </div>
              </div>

              <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-6">
                <h3 className="flex items-center gap-2 text-indigo-300 font-semibold mb-4">
                  <Lightbulb size={18} /> Strategic Recommendations
                </h3>
                <div className="grid gap-3">
                  {result.suggestions.map((item, idx) => (
                    <div key={idx} className="flex gap-3 bg-gray-900/50 p-3 rounded-lg">
                      <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold">
                        {idx + 1}
                      </span>
                      <p className="text-gray-200 text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">No analysis available yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;