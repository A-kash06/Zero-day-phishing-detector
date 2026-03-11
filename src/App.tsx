/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Search, 
  Activity, 
  Lock, 
  Globe, 
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  Info,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type } from "@google/genai";

interface AnalysisResult {
  url: string;
  lexical_score: number;
  visual_score: number;
  risk_score: number;
  prediction: string;
  status: 'Safe' | 'Warning' | 'Danger';
  features: {
    lexical_findings: string;
    visual_findings: string;
    ui_elements_detected: string;
  };
  timestamp: string;
}

export default function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError(null);
    setResult(null);

    let targetUrl = url;
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Gemini API key is not configured. Please check your settings.");
      }
      
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Perform a deep hybrid phishing analysis on this URL: ${targetUrl}. 
        
        Use your tools to access the site content and search for information about this domain.
        Analyze it from these perspectives:
        1. Lexical Analysis: Check the URL string for suspicious patterns, typosquatting, or deceptive subdomains.
        2. UI/Visual Analysis: Based on the page content and structure, identify visual red flags (e.g., mimicking a login page of a major brand, suspicious forms, lack of branding consistency).
        
        Return a JSON object with:
        - lexical_score (0-100, where 100 is highly suspicious)
        - visual_score (0-100, where 100 is highly suspicious)
        - risk_score (0-100, weighted average)
        - prediction ("Phishing" or "Legitimate")
        - status ("Safe", "Warning", "Danger")
        - features (object with keys: lexical_findings, visual_findings, ui_elements_detected)
        
        Be extremely specific about the UI elements you detect. If you cannot access the site, use your knowledge and search results to estimate.`,
        config: {
          tools: [{ urlContext: {} }, { googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              lexical_score: { type: Type.NUMBER },
              visual_score: { type: Type.NUMBER },
              risk_score: { type: Type.NUMBER },
              prediction: { type: Type.STRING },
              status: { type: Type.STRING },
              features: {
                type: Type.OBJECT,
                properties: {
                  lexical_findings: { type: Type.STRING },
                  visual_findings: { type: Type.STRING },
                  ui_elements_detected: { type: Type.STRING }
                }
              }
            },
            required: ["lexical_score", "visual_score", "risk_score", "prediction", "status", "features"]
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      setResult({
        ...data,
        url: targetUrl,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      console.error("Analysis error:", err);
      setError(err.message || 'An error occurred during analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-emerald-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Zero-Day <span className="text-emerald-400">PhishGuard</span></h1>
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-medium">Hybrid Analysis Engine v2.4</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <a href="#" className="hover:text-white transition-colors">Dashboard</a>
            <a href="#" className="hover:text-white transition-colors">Threat Intelligence</a>
            <a href="#" className="hover:text-white transition-colors">API Docs</a>
            <div className="h-4 w-px bg-white/10" />
            <button className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors">
              System Status: <span className="text-emerald-400">Optimal</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Scanner */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold tracking-tight leading-tight">
                Detect Phishing with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
                  Hybrid Intelligence.
                </span>
              </h2>
              <p className="text-white/50 text-lg max-w-xl">
                Our engine combines lexical URL analysis with visual CNN processing to identify zero-day phishing threats before they hit the blocklists.
              </p>
            </div>

            <form onSubmit={handleScan} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-500" />
              <div className="relative flex items-center bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden p-2">
                <div className="pl-4 pr-2 text-white/30">
                  <Globe className="w-5 h-5" />
                </div>
                <input 
                  type="text" 
                  placeholder="Enter URL to scan (e.g., https://secure-login.example.com)"
                  className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-white/20 py-4"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <button 
                  disabled={loading}
                  className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-black font-bold px-8 py-4 rounded-xl transition-all flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Activity className="w-5 h-5 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      Scan Now
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
              {[
                { icon: Zap, title: "Real-time", desc: "Instant analysis" },
                { icon: Lock, title: "Secure", desc: "Privacy-first scanning" },
                { icon: Activity, title: "Hybrid", desc: "Visual + Lexical" }
              ].map((f, i) => (
                <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                  <f.icon className="w-5 h-5 text-emerald-400 mb-2" />
                  <h3 className="font-bold text-sm">{f.title}</h3>
                  <p className="text-xs text-white/40">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              {!result && !loading && !error && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="h-full min-h-[400px] border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center p-8 space-y-4"
                >
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                    <Search className="w-8 h-8 text-white/20" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Ready to Scan</h3>
                    <p className="text-sm text-white/40 max-w-[240px]">Enter a URL to begin the hybrid analysis process.</p>
                  </div>
                </motion.div>
              )}

              {loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[400px] bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center space-y-8"
                >
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-emerald-500/20 rounded-full animate-pulse" />
                    <div className="absolute inset-0 border-t-4 border-emerald-500 rounded-full animate-spin" />
                    <Shield className="absolute inset-0 m-auto w-10 h-10 text-emerald-500" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold">Analyzing URL...</h3>
                    <div className="flex flex-col gap-1">
                      <p className="text-xs text-white/40 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                        Extracting lexical features
                      </p>
                      <p className="text-xs text-white/40 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
                        Running CNN visual analysis
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {result && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden"
                >
                  {/* Result Header */}
                  <div className={`p-6 flex items-center justify-between ${
                    result.status === 'Safe' ? 'bg-emerald-500/10' : 
                    result.status === 'Warning' ? 'bg-yellow-500/10' : 'bg-red-500/10'
                  }`}>
                    <div className="flex items-center gap-3">
                      {result.status === 'Safe' ? (
                        <ShieldCheck className="w-8 h-8 text-emerald-400" />
                      ) : result.status === 'Warning' ? (
                        <AlertTriangle className="w-8 h-8 text-yellow-400" />
                      ) : (
                        <ShieldAlert className="w-8 h-8 text-red-400" />
                      )}
                      <div>
                        <h3 className="font-bold text-lg">{result.prediction} Detected</h3>
                        <p className="text-xs opacity-60 uppercase tracking-wider font-bold">
                          {result.status} Level Threat
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black">{result.risk_score}%</div>
                      <div className="text-[10px] opacity-40 uppercase font-bold">Risk Score</div>
                    </div>
                  </div>

                  <div className="p-8 space-y-8">
                    {/* Progress Bars */}
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-white/40">
                          <span>Lexical Analysis</span>
                          <span>{result.lexical_score}%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${result.lexical_score}%` }}
                            className="h-full bg-emerald-500"
                          />
                        </div>
                        <p className="text-[11px] text-white/40 leading-relaxed italic">
                          "{result.features.lexical_findings}"
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-white/40">
                          <span>Visual CNN Analysis</span>
                          <span>{result.visual_score}%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${result.visual_score}%` }}
                            className="h-full bg-blue-500"
                          />
                        </div>
                        <p className="text-[11px] text-white/40 leading-relaxed italic">
                          "{result.features.visual_findings}"
                        </p>
                      </div>

                      {/* UI Elements Detected */}
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                          <Globe className="w-3 h-3" />
                          <span>UI Components Detected</span>
                        </div>
                        <p className="text-[11px] text-white/60 leading-relaxed">
                          {result.features.ui_elements_detected}
                        </p>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] text-white/30 uppercase font-bold">Analyzed URL</p>
                        <p className="text-xs truncate font-mono text-white/60">{result.url}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-white/30 uppercase font-bold">Timestamp</p>
                        <p className="text-xs font-mono text-white/60">{new Date(result.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => setResult(null)}
                      className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-sm font-bold transition-colors"
                    >
                      Scan Another URL
                    </button>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 text-center space-y-4"
                >
                  <AlertTriangle className="w-12 h-12 text-red-400 mx-auto" />
                  <h3 className="text-lg font-bold">Analysis Failed</h3>
                  <p className="text-sm text-red-400/60">{error}</p>
                  <button 
                    onClick={() => setError(null)}
                    className="px-6 py-2 bg-red-500 text-white rounded-xl font-bold text-sm"
                  >
                    Retry
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-12 border-t border-white/5 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 text-white/20">
            <Shield className="w-4 h-4" />
            <p className="text-xs font-medium">© 2026 Zero-Day PhishGuard. All rights reserved.</p>
          </div>
          <div className="flex gap-6 text-xs font-medium text-white/40">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Security Research</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
