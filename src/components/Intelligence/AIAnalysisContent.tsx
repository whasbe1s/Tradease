import React, { useState, useRef } from 'react';
import { Sparkles, Upload, Image as ImageIcon, Loader2, X, MessageSquare, FileText } from 'lucide-react';
import { analyzeChart, analyzeSentiment } from '../../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface AIAnalysisContentProps {
    addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const AIAnalysisContent: React.FC<AIAnalysisContentProps> = ({ addToast }) => {
    const [mode, setMode] = useState<'chart' | 'text'>('chart');
    const [input, setInput] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setResult(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                if (blob) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setImage(reader.result as string);
                        setResult(null);
                        setMode('chart');
                    };
                    reader.readAsDataURL(blob);
                }
            }
        }
    };

    const handleAnalyze = async () => {
        if (mode === 'chart' && !image) {
            addToast('Please upload or paste a chart image first.', 'error');
            return;
        }
        if (mode === 'text' && !input.trim()) {
            addToast('Please enter some text to analyze.', 'error');
            return;
        }

        setIsAnalyzing(true);
        setResult(null);

        try {
            let analysis = '';
            if (mode === 'chart' && image) {
                // Remove data:image/png;base64, prefix
                const base64Image = image.split(',')[1];
                analysis = await analyzeChart(base64Image, input);
            } else {
                analysis = await analyzeSentiment(input);
            }
            setResult(analysis);
        } catch (error) {
            console.error('Analysis failed:', error);
            addToast('Analysis failed. Please check your API key.', 'error');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto h-[calc(100vh-140px)] min-h-[600px]">
            <div
                className="w-full h-full backdrop-blur-md border border-nothing-dark/5 rounded-3xl p-6 shadow-xl flex flex-col relative overflow-hidden"
                style={{ backgroundColor: `rgba(67, 86, 99, var(--bento-opacity))` }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-nothing-accent/10 rounded-full">
                            <Sparkles size={20} className="text-nothing-accent" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-nothing-dark tracking-tight">AI Intelligence</h2>
                            <p className="text-[10px] font-mono uppercase tracking-widest text-nothing-dark/40">Powered by Gemini</p>
                        </div>
                    </div>

                    {/* Mode Switcher */}
                    <div className="flex bg-nothing-dark/5 p-1 rounded-full">
                        <button
                            onClick={() => setMode('chart')}
                            className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${mode === 'chart'
                                ? 'bg-white text-nothing-dark shadow-sm'
                                : 'text-nothing-dark/40 hover:text-nothing-dark/60'
                                }`}
                        >
                            <ImageIcon size={14} /> Chart
                        </button>
                        <button
                            onClick={() => setMode('text')}
                            className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${mode === 'text'
                                ? 'bg-white text-nothing-dark shadow-sm'
                                : 'text-nothing-dark/40 hover:text-nothing-dark/60'
                                }`}
                        >
                            <FileText size={14} /> Text
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto mb-6 space-y-6 pr-2" onPaste={handlePaste}>
                    {mode === 'chart' ? (
                        <div className="space-y-6">
                            {!image ? (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-nothing-dark/10 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-nothing-dark/5 hover:border-nothing-dark/20 transition-all group h-64"
                                >
                                    <div className="w-16 h-16 bg-nothing-dark/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Upload size={24} className="text-nothing-dark/40" />
                                    </div>
                                    <p className="font-mono text-nothing-dark/40 uppercase tracking-widest text-center text-xs">
                                        Paste chart image (Ctrl+V)<br />or click to upload
                                    </p>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                </div>
                            ) : (
                                <div className="relative group rounded-2xl overflow-hidden border border-nothing-dark/10 shadow-lg">
                                    <img src={image} alt="Chart to analyze" className="w-full" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-start justify-end p-4 opacity-0 group-hover:opacity-100">
                                        <button
                                            onClick={() => { setImage(null); setResult(null); }}
                                            className="bg-white/90 p-2 rounded-full shadow-lg hover:bg-red-50 hover:text-red-500 transition-colors backdrop-blur-sm"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="bg-nothing-dark/5 rounded-2xl p-4">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Add context (e.g., 'H4 timeframe, looking for longs')..."
                                    className="w-full bg-transparent border-none font-mono text-sm focus:outline-none resize-none placeholder:text-nothing-dark/30"
                                    rows={2}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="bg-nothing-dark/5 rounded-2xl p-6 h-full min-h-[300px]">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Paste news headline or article text here..."
                                className="w-full h-full bg-transparent border-none font-mono text-sm focus:outline-none resize-none placeholder:text-nothing-dark/30"
                            />
                        </div>
                    )}

                    {/* Result Display */}
                    {result && (
                        <div className="bg-white/50 backdrop-blur border border-nothing-dark/10 rounded-2xl p-6 animate-fade-in shadow-sm">
                            <div className="flex items-center gap-2 mb-4 text-nothing-accent">
                                <Sparkles size={16} />
                                <span className="text-xs font-mono uppercase tracking-widest font-bold">AI Insight</span>
                            </div>
                            <div className="prose prose-sm prose-invert font-sans text-nothing-dark leading-relaxed max-w-none">
                                <ReactMarkdown>{result}</ReactMarkdown>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="pt-4 border-t border-nothing-dark/5">
                    <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || (mode === 'chart' && !image) || (mode === 'text' && !input)}
                        className={`
                            w-full py-4 rounded-xl font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all
                            ${isAnalyzing || (mode === 'chart' && !image) || (mode === 'text' && !input)
                                ? 'bg-nothing-dark/5 text-nothing-dark/20 cursor-not-allowed'
                                : 'bg-nothing-dark text-nothing-base hover:bg-nothing-dark/90 hover:scale-[1.02] active:scale-[0.98] shadow-lg'
                            }
                        `}
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 size={18} className="animate-spin" /> Analyzing...
                            </>
                        ) : (
                            <>
                                <Sparkles size={18} /> Generate Analysis
                            </>
                        )}
                    </button>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-nothing-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            </div>
        </div>
    );
};
