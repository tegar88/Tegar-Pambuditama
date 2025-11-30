import React, { useState, useEffect } from 'react';
import { KamiSection, AnalysisResult } from './types';
import SectionCard from './components/SectionCard';
import AnalysisModal from './components/AnalysisModal';
import { generateSectionSuggestion, analyzeCanvas } from './services/geminiService';
import { Layout, BrainCircuit, Download, Trash2, Rocket } from 'lucide-react';

const INITIAL_SECTIONS: KamiSection[] = [
  {
    id: 'k',
    key: 'K',
    title: 'Kaji Tujuan Inti',
    description: 'Guru dan murid bersama-sama Mendekonstruksi (mengurai) bahasa kurikulum (CP/TP) menjadi ide-ide besar yang sederhana.',
    content: '',
    color: 'bg-gradient-to-r from-blue-600/20 to-blue-900/20 border-blue-500/30'
  },
  {
    id: 'a',
    key: 'A',
    title: 'Ambil Konteks Nyata',
    description: 'Murid secara aktif Menghubungkan ide besar tersebut dengan fakta, masalah, atau data di lingkungan sekitar mereka (Kontekstualisasi).',
    content: '',
    color: 'bg-gradient-to-r from-purple-600/20 to-purple-900/20 border-purple-500/30'
  },
  {
    id: 'm',
    key: 'M',
    title: 'Modelkan',
    description: 'Murid Memvisualisasikan (membuat model, sketsa, analogi, atau peta konsep) sebagai representasi pemahaman awal mereka tentang tujuan tersebut.',
    content: '',
    color: 'bg-gradient-to-r from-emerald-600/20 to-emerald-900/20 border-emerald-500/30'
  },
  {
    id: 'i',
    key: 'I',
    title: 'Ikat Komitmen Belajar',
    description: 'Guru dan murid Menyepakati (menetapkan) representasi tersebut sebagai kontrak belajar dan panduan yang akan selalu dirujuk sepanjang proses.',
    content: '',
    color: 'bg-gradient-to-r from-rose-600/20 to-rose-900/20 border-rose-500/30'
  }
];

export default function App() {
  const [sections, setSections] = useState<KamiSection[]>(INITIAL_SECTIONS);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  useEffect(() => {
    if (!process.env.API_KEY) {
      setApiKeyMissing(true);
    }
  }, []);

  const handleUpdateSection = (id: string, newContent: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, content: newContent } : s));
  };

  const handleAiAssist = async (section: KamiSection, userPrompt: string) => {
    if (apiKeyMissing) {
      alert("API Key is missing in environment variables.");
      return;
    }
    
    // Set loading state for specific section
    setSections(prev => prev.map(s => s.id === section.id ? { ...s, isLoading: true } : s));

    try {
      const suggestion = await generateSectionSuggestion(section, sections, userPrompt);
      // Append suggestion or replace? Let's append with a newline for safety
      const newContent = section.content 
        ? `${section.content}\n\n--- AI Suggestion ---\n${suggestion}`
        : suggestion;
      
      handleUpdateSection(section.id, newContent);
    } catch (error) {
      console.error(error);
      alert("Failed to get suggestion. Check console.");
    } finally {
      setSections(prev => prev.map(s => s.id === section.id ? { ...s, isLoading: false } : s));
    }
  };

  const handleGlobalAnalysis = async () => {
    if (apiKeyMissing) return;
    
    setIsAnalysisOpen(true);
    setIsAnalyzing(true);
    
    try {
      const result = await analyzeCanvas(sections);
      setAnalysisResult(result);
    } catch (error) {
      console.error(error);
      setAnalysisResult(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    if (confirm("Clear all sections?")) {
      setSections(INITIAL_SECTIONS);
      setAnalysisResult(null);
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sections, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "kami-canvas.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="min-h-screen bg-kami-bg text-kami-text font-sans selection:bg-kami-primary selection:text-white pb-20">
      
      {/* Navigation Bar */}
      <nav className="border-b border-gray-800 bg-kami-bg/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-kami-primary to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-kami-primary/20">
              <Layout className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">KAMI Canvas <span className="text-kami-primary">AI</span></h1>
              <p className="text-xs text-gray-400">Strategic Framework Tool</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
             {apiKeyMissing && (
                <span className="text-red-400 text-xs bg-red-900/20 px-2 py-1 rounded border border-red-800 hidden md:block">
                  Missing API_KEY
                </span>
             )}
            <button 
              onClick={handleClear}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
              title="Clear Canvas"
            >
              <Trash2 size={20} />
            </button>
            <button 
              onClick={handleExport}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Export JSON"
            >
              <Download size={20} />
            </button>
            <div className="h-6 w-px bg-gray-700 mx-2"></div>
            <button 
              onClick={handleGlobalAnalysis}
              disabled={apiKeyMissing}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
                ${apiKeyMissing 
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                  : 'bg-white text-kami-bg hover:bg-gray-200 shadow-[0_0_15px_rgba(255,255,255,0.3)]'}
              `}
            >
              <BrainCircuit size={18} />
              <span className="hidden sm:inline">Analyze Strategy</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Grid Canvas */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 h-[calc(100vh-140px)] min-h-[600px]">
          {sections.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              onUpdate={handleUpdateSection}
              onAiAssist={handleAiAssist}
            />
          ))}
        </div>
      </main>

      {/* Analysis Modal */}
      <AnalysisModal 
        isOpen={isAnalysisOpen} 
        onClose={() => setIsAnalysisOpen(false)}
        result={analysisResult}
        isLoading={isAnalyzing}
      />
      
      {/* Floating Rocket decoration or status */}
      <div className="fixed bottom-6 right-6 opacity-20 hover:opacity-100 transition-opacity">
         <div className="bg-gradient-to-t from-kami-primary to-purple-500 p-3 rounded-full blur-xl absolute inset-0"></div>
         <div className="relative bg-black p-3 rounded-full border border-gray-700">
            <Rocket className="text-white" />
         </div>
      </div>
    </div>
  );
}