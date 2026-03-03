"use client";
import { useState, useEffect } from 'react';
import { Upload, CheckCircle2, AlertCircle, RefreshCcw, LayoutPanelLeft, Zap, Maximize2, BarChart3, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EggVisionPro() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!file) { setPreviewUrl(null); return; }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('https://Chalermchai2294-Ai.hf.space/predict', { method: 'POST', body: formData });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setFile(null); setResult(null); };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans">
      {/* --- Navbar --- */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50 px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 p-2 rounded-lg shadow-lg shadow-amber-500/20">
              <Zap className="text-white fill-current" size={20} />
            </div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic">
              EggVision <span className="text-amber-500">Analytics</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {result && (
              <button onClick={reset} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition">
                <RefreshCcw size={16} /> NEW SCAN
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-6 lg:p-10">
        <AnimatePresence mode="wait">
          {!result ? (
            /* --- หน้า Upload (Large Center Box) --- */
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl mx-auto mt-10"
            >
              <div className="text-center mb-10">
                <h2 className="text-4xl font-black mb-4">Quality Control Inspection</h2>
                <p className="text-slate-400">อัปโหลดรูปภาพเพื่อเริ่มต้นการตรวจสอบด้วยระบบ EggVision AI Engine</p>
              </div>

              <div className="bg-slate-900 border-2 border-dashed border-slate-700 rounded-[3rem] p-12 text-center group hover:border-amber-500/50 transition-all duration-500 shadow-2xl">
                <label className="cursor-pointer block">
                  {!previewUrl ? (
                    <div className="py-20">
                      <div className="w-24 h-24 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                        <Upload className="text-amber-500" size={40} />
                      </div>
                      <p className="text-2xl font-bold mb-2">Drop Egg Image Here</p>
                      <p className="text-slate-500">รองรับไฟล์ JPG, PNG ความละเอียดสูง</p>
                    </div>
                  ) : (
                    <div className="relative max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl ring-4 ring-amber-500/30">
                      <img src={previewUrl} className="w-full h-auto" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <p className="font-bold">คลิกเพื่อเปลี่ยนรูป</p>
                      </div>
                    </div>
                  )}
                  <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                </label>
              </div>

              <button 
                onClick={handleUpload}
                disabled={!file || loading}
                className="w-full mt-8 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 text-slate-900 py-6 rounded-2xl font-black text-xl shadow-xl shadow-amber-500/10 transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
              >
                {loading ? <RefreshCcw className="animate-spin" /> : <BarChart3 />}
                {loading ? "Processing..." : "Start Analysis"}
              </button>
            </motion.div>
          ) : (
            /* --- หน้าผลลัพธ์ (Large Layout) --- */
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              
              {/* Top Dashboard Stats */}

              {/* Huge Image Comparison Section */}
              <div className="bg-slate-900 rounded-[3rem] p-6 lg:p-10 border border-slate-800 shadow-2xl">
                <div className="flex items-center justify-between mb-8 px-4">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-8 bg-amber-500 rounded-full" />
                    <h3 className="text-2xl font-black uppercase tracking-tight">Visual Inspection Report</h3>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full">
                    <Maximize2 size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-300">High Precision Analysis</span>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-10">
                  {/* Image 1: Input */}
                  <div className="space-y-4 group">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Source Input</span>
                      <span className="text-[10px] text-slate-600">RAW IMAGE</span>
                    </div>
                    <div className="relative rounded-[2rem] overflow-hidden border-2 border-slate-800 bg-slate-950 group-hover:border-slate-700 transition-all duration-500">
                      <img src={previewUrl!} className="w-full h-auto object-contain max-h-[700px]" alt="Original" />
                      <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-bold">CAM_01_FEED</div>
                    </div>
                  </div>

                  {/* Image 2: AI Result (Huge) */}
                  <div className="space-y-4 group">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-amber-500 uppercase tracking-[0.3em]">AI Classification</span>
                      <span className="text-[10px] text-amber-600/50 underline">YOLOv8 ENGINE</span>
                    </div>
                    <div className="relative rounded-[2rem] overflow-hidden border-2 border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.1)] bg-slate-950 transition-all duration-500">
                      <img src={result.image} className="w-full h-auto object-contain max-h-[700px]" alt="Result" />
                      <div className="absolute top-6 right-6 bg-amber-500 px-4 py-2 rounded-xl text-[10px] font-black text-slate-950">PROCESSED</div>
                      {/* Scanline Effect */}
                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-amber-500/5 to-transparent h-20 w-full animate-scan" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="flex justify-center pt-10">
                <button 
                  onClick={reset}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-10 py-5 rounded-2xl font-bold flex items-center gap-3 transition-all active:scale-95 shadow-lg"
                >
                  <RefreshCcw size={20} /> ANALYZE ANOTHER BATCH
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style jsx global>{`
        @keyframes scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(500%); }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
