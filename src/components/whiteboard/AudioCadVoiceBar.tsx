import React, { useState, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  Square, 
  Send, 
  Globe, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Volume2, 
  X,
  Compass
} from 'lucide-react';

interface AudioCadVoiceBarProps {
  onExecuteInstruction: (instruction: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const AudioCadVoiceBar: React.FC<AudioCadVoiceBarProps> = ({
  onExecuteInstruction,
  isOpen,
  onClose
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [transcriptText, setTranscriptText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState('');
  const [searching, setSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<'VOICE_CAD' | 'SEARCH_GROUNDING'>('VOICE_CAD');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleAudioUpload(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err: any) {
      console.error("Microphone access error:", err);
      setErrorMsg("Could not access microphone. Please check browser permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleAudioUpload = async (blob: Blob) => {
    setTranscribing(true);
    setErrorMsg(null);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64String = (reader.result as string)?.split(',')[1];
        if (!base64String) {
          setTranscribing(false);
          setErrorMsg("Failed to process recorded audio.");
          return;
        }

        const res = await fetch('/api/transcribe-audio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioBase64: base64String,
            mimeType: 'audio/webm'
          })
        });

        const data = await res.json();
        setTranscribing(false);

        if (data.success && data.transcription) {
          setTranscriptText(data.transcription);
          onExecuteInstruction(data.transcription);
        } else {
          setErrorMsg(data.error || "Transcription failed.");
        }
      };
    } catch (err: any) {
      setTranscribing(false);
      setErrorMsg(err.message || "Network error during audio transcription.");
    }
  };

  const handleSearchGrounding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setSearchResult('');
    setErrorMsg(null);

    try {
      const res = await fetch('/api/search-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });

      const data = await res.json();
      setSearching(false);

      if (data.success) {
        setSearchResult(data.text);
      } else {
        setErrorMsg(data.error || "Search grounding failed.");
      }
    } catch (err: any) {
      setSearching(false);
      setErrorMsg(err.message || "Failed to fetch search data.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-20 right-4 z-50 w-96 bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden font-sans text-slate-100 animate-in fade-in slide-in-from-top-4 duration-200">
      {/* Header */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-white tracking-tight">DraftHands AI Voice & Search</h4>
            <p className="text-[10px] text-slate-400">gemini-3.5-transcribe & Google Grounding</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 bg-slate-950 p-1 border-b border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('VOICE_CAD')}
          className={`py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'VOICE_CAD'
              ? 'bg-cyan-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Mic className="w-3.5 h-3.5" />
          <span>Voice Transcription</span>
        </button>
        <button
          onClick={() => setActiveTab('SEARCH_GROUNDING')}
          className={`py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'SEARCH_GROUNDING'
              ? 'bg-cyan-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Google Search Data</span>
        </button>
      </div>

      <div className="p-4 space-y-4">
        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {activeTab === 'VOICE_CAD' ? (
          <div className="space-y-3">
            <div className="text-center space-y-2 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex justify-center">
                {isRecording ? (
                  <button
                    onClick={stopRecording}
                    className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-xl shadow-rose-600/40 animate-pulse transition-all cursor-pointer"
                    title="Stop Recording"
                  >
                    <Square className="w-7 h-7" />
                  </button>
                ) : (
                  <button
                    onClick={startRecording}
                    disabled={transcribing}
                    className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white flex items-center justify-center shadow-xl shadow-cyan-600/30 transition-all cursor-pointer"
                    title="Click to Speak CAD Construction Command"
                  >
                    <Mic className="w-7 h-7" />
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-300 font-medium">
                {isRecording ? 'Listening to your drafting command...' : transcribing ? 'Transcribing with gemini-3.5-transcribe...' : 'Click microphone to speak (e.g. "Draw circle radius 50")'}
              </p>
            </div>

            {transcriptText && (
              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">Latest Transcription</span>
                <p className="text-xs text-white font-medium italic">"{transcriptText}"</p>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1 pt-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>CAD Construction Effected on Canvas</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSearchGrounding} className="space-y-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">
                Search WAEC / NERDC Technical Drawing Standards
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. ISO 128 dimensioning rules..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  disabled={searching}
                  className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  {searching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {searchResult && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 max-h-48 overflow-y-auto">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">Google Search Grounding Results</span>
                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">{searchResult}</p>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
