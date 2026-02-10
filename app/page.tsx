"use client";
import { useState, useEffect } from 'react';
import { Upload, CheckCircle2, AlertCircle, RefreshCcw, LayoutPanelLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EggDetector() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // สร้าง Preview เมื่อเลือกไฟล์
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
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
      // เปลี่ยน URL_API_BACKEND เป็น URL ของ Render หรือ Localhost:8000
      const res = await fetch('http://localhost:8000/predict', { 
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-20">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 mb-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-amber-400 p-2 rounded-lg">
              <LayoutPanelLeft className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">EggVision AI</span>
          </div>
          <button onClick={reset} className="text-slate-500 hover:text-slate-800 transition">
            <RefreshCcw size={20} />
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">ระบบตรวจสอบคุณภาพไข่</h1>
          <p className="text-slate-500 text-lg">ตรวจจับรอยร้าวและความสมบูรณ์ของไข่ด้วย AI ความแม่นยำสูง</p>
        </header>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* ส่วนอัพโหลด (Left Side) */}
          <div className="lg:col-span-4 space-y-6">
            <div className={`bg-white p-6 rounded-3xl shadow-sm border-2 border-dashed transition-all ${file ? 'border-amber-400' : 'border-slate-200'}`}>
              <label className="flex flex-col items-center justify-center cursor-pointer">
                {!previewUrl ? (
                  <div className="py-10 flex flex-col items-center">
                    <div className="bg-slate-100 p-4 rounded-full mb-4">
                      <Upload className="text-slate-400" size={32} />
                    </div>
                    <p className="text-sm font-medium text-slate-600">คลิกเพื่อเลือกรูปภาพไข่</p>
                    <p className="text-xs text-slate-400 mt-1">PNG, JPG ขนาดไม่เกิน 10MB</p>
                  </div>
                ) : (
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-inner">
                    <img src={previewUrl} className="object-cover w-full h-full" alt="Preview" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition flex items-center justify-center">
                      <span className="text-white text-sm bg-black/50 px-3 py-1 rounded-full">เปลี่ยนรูป</span>
                    </div>
                  </div>
                )}
                <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </label>
            </div>

            <button 
              onClick={handleUpload}
              disabled={!file || loading}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-semibold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all disabled:bg-slate-200 disabled:shadow-none transform active:scale-[0.98]"
            >
              {loading ? "กำลังวิเคราะห์..." : "วิเคราะห์คุณภาพไข่"}
            </button>
          </div>

          {/* ส่วนแสดงผล (Right Side) */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {!result ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-slate-100 border-2 border-dashed border-slate-200 rounded-3xl h-full min-h-[400px] flex items-center justify-center text-slate-400"
                >
                  <p>รอการอัพโหลดเพื่อแสดงผลวิเคราะห์</p>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Summary Cards */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-3xl shadow-sm">
                      <p className="text-slate-400 text-xs font-bold uppercase mb-1">ทั้งหมด</p>
                      <p className="text-3xl font-black text-slate-900">{result.total}</p>
                    </div>
                    <div className="bg-green-50 p-6 rounded-3xl shadow-sm border border-green-100">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 size={14} className="text-green-600" />
                        <p className="text-green-600 text-xs font-bold uppercase">ไข่ปกติ</p>
                      </div>
                      <p className="text-3xl font-black text-green-700">{result.good}</p>
                    </div>
                    <div className="bg-red-50 p-6 rounded-3xl shadow-sm border border-red-100">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle size={14} className="text-red-600" />
                        <p className="text-red-600 text-xs font-bold uppercase">ไข่แตก</p>
                      </div>
                      <p className="text-3xl font-black text-red-700">{result.broken}</p>
                    </div>
                  </div>

                  {/* Image Comparison */}
                  <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
                    <h3 className="text-sm font-bold text-slate-800 mb-4 px-2 italic">Result Analysis</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 ml-2">ORIGINAL</span>
                        <img src={previewUrl!} className="rounded-2xl w-full aspect-[4/3] object-cover border border-slate-100" />
                      </div>
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-amber-500 ml-2">AI DETECTION</span>
                        <img src={result.image} className="rounded-2xl w-full aspect-[4/3] object-cover border border-amber-100" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}