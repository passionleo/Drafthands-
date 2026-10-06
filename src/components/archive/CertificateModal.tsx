import React, { useState } from 'react';
import { Award, Download, X, CheckCircle2, ShieldCheck, Upload } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  examTitle: string;
  scorePercentage: number;
  examBody: string;
  year: number;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  studentName,
  examTitle,
  scorePercentage,
  examBody,
  year
}) => {
  const [customSignature, setCustomSignature] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('drafthands_custom_signature') || '';
      } catch {}
    }
    return '';
  });

  if (!isOpen) return null;

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setCustomSignature(result);
          try {
            localStorage.setItem('drafthands_custom_signature', result);
          } catch {}
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrintOrDownload = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Top Bar */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Certificate of Technical Proficiency</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintOrDownload}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download / Print Certificate</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Display Area */}
        <div className="p-8 sm:p-12 overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex flex-col items-center justify-center text-center">
          <div className="w-full max-w-3xl bg-slate-900 border-4 border-amber-500/60 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden space-y-6">
            {/* Background watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <Award className="w-96 h-96 text-amber-400" />
            </div>

            <div className="space-y-2 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold border border-amber-500/40">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>DraftHands Academic Certification</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase font-serif">
                Certificate of Proficiency
              </h1>
              <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">
                This is proudly presented to
              </p>
            </div>

            <div className="py-3 relative z-10">
              <h2 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-amber-300 to-yellow-400 font-serif tracking-tight">
                {studentName}
              </h2>
              <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-2" />
            </div>

            <div className="max-w-xl mx-auto text-xs sm:text-sm text-slate-300 leading-relaxed relative z-10">
              For successfully completing the examination and demonstrating high-level technical proficiency in <strong className="text-white">{examTitle}</strong> ({examBody} {year}), achieving an authenticated score of <strong className="text-emerald-400 font-mono text-base">{scorePercentage}%</strong> mapped to NERDC and ISO 128 drafting standards.
            </div>

            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-800 relative z-10 items-end">
              <div className="text-left space-y-1">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Date of Issue</div>
                <div className="text-xs font-bold text-white font-mono">
                  {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono">✓ Verified Digital Credential</div>
              </div>

              <div className="text-right space-y-1 flex flex-col items-end">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Director & Lead Educator</div>
                <div className="h-12 flex items-center justify-end">
                  {customSignature ? (
                    <img src={customSignature} alt="Instructor Signature" className="max-h-12 object-contain filter invert opacity-90" />
                  ) : (
                    <span className="font-serif italic text-cyan-400 text-lg font-bold tracking-wider">
                      Engr. Kolawole Kayode
                    </span>
                  )}
                </div>
                <div className="text-xs font-bold text-white">Engr. Kolawole O. Kayode, B.Tech</div>
                <div className="text-[10px] text-slate-400">International School, University of Lagos (ISL)</div>
              </div>
            </div>

            {/* Signature Upload Option for Instructor */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 relative z-10">
              <span>Educator Signature Settings:</span>
              <label className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-[11px] cursor-pointer border border-slate-700 flex items-center gap-1.5">
                <Upload className="w-3 h-3" />
                <span>Upload Signature Image</span>
                <input type="file" accept="image/*" onChange={handleSignatureUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
