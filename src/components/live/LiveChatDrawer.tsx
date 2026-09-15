import React, { useState } from 'react';
import { 
  X, 
  Send, 
  MessageSquare, 
  Users, 
  Hand, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Pencil, 
  Sparkles, 
  HelpCircle, 
  ThumbsUp, 
  Crown, 
  CheckCircle,
  VolumeX
} from 'lucide-react';
import { LiveParticipant, LiveChatMessage } from '../../types/liveClass';

interface LiveChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: LiveChatMessage[];
  onSendMessage: (text: string, isQuestion?: boolean) => void;
  onUpvoteQuestion: (msgId: string) => void;
  participants: LiveParticipant[];
  localParticipantId: string;
  isTeacher: boolean;
  onMuteAllStudents?: () => void;
  onToggleStudentAudio?: (id: string) => void;
  onToggleStudentDrawing?: (id: string) => void;
  onLowerStudentHand?: (id: string) => void;
}

export const LiveChatDrawer: React.FC<LiveChatDrawerProps> = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  onUpvoteQuestion,
  participants,
  localParticipantId,
  isTeacher,
  onMuteAllStudents,
  onToggleStudentAudio,
  onToggleStudentDrawing,
  onLowerStudentHand
}) => {
  const [activeTab, setActiveTab] = useState<'CHAT' | 'PARTICIPANTS'>('CHAT');
  const [inputText, setInputText] = useState('');
  const [isQuestionMode, setIsQuestionMode] = useState(false);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim(), isQuestionMode);
    setInputText('');
    setIsQuestionMode(false);
  };

  const quickFormulas = ['Ø 50mm', 'R = 35mm', 'Angle 60°', 'Scale 1:50', '2H Line', 'HB Outline', 'Tangent at Point P'];

  const handRaisedCount = participants.filter(p => p.isHandRaised).length;

  return (
    <div className="w-80 sm:w-96 bg-slate-900 border-l border-slate-800 flex flex-col h-full z-40 select-none shadow-2xl shrink-0">
      {/* Header & Tabs */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('CHAT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'CHAT' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Class Chat</span>
          </button>
          <button
            onClick={() => setActiveTab('PARTICIPANTS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'PARTICIPANTS' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Roster ({participants.length})</span>
            {handRaisedCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold flex items-center justify-center">
                {handRaisedCount}
              </span>
            )}
          </button>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* TAB CONTENT: CHAT */}
      {activeTab === 'CHAT' && (
        <div className="flex-1 flex flex-col min-h-0 bg-slate-900/90">
          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-slate-800">
            {messages.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <p>Welcome to Live Technical Graphics Class!</p>
                <p className="text-[11px] text-slate-600 mt-1">Post questions, dimensions, or technical queries.</p>
              </div>
            ) : (
              messages.map((m) => {
                const isLocal = m.senderId === localParticipantId;
                const isTeacherMsg = m.senderRole === 'TEACHER';

                return (
                  <div
                    key={m.id}
                    className={`rounded-xl p-2.5 text-xs transition-all ${
                      m.isQuestion
                        ? 'bg-amber-950/40 border border-amber-500/30'
                        : isTeacherMsg
                        ? 'bg-purple-950/40 border border-purple-500/30'
                        : isLocal
                        ? 'bg-cyan-950/40 border border-cyan-500/30 ml-4'
                        : 'bg-slate-800/80 border border-slate-700/60 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-200">{m.senderName}</span>
                        {isTeacherMsg && (
                          <span className="px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">
                            Teacher
                          </span>
                        )}
                        {m.isQuestion && (
                          <span className="flex items-center gap-0.5 px-1 py-0.2 rounded bg-amber-500 text-slate-950 text-[9px] font-extrabold">
                            <HelpCircle className="w-2.5 h-2.5" /> Q&A
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500">{m.timestamp}</span>
                    </div>

                    <p className="text-slate-300 leading-relaxed break-words">{m.text}</p>

                    {m.isQuestion && (
                      <div className="mt-2 flex items-center justify-between pt-1 border-t border-amber-500/20 text-[10px]">
                        <span className="text-amber-400/80">Question for Teacher</span>
                        <button
                          onClick={() => onUpvoteQuestion(m.id)}
                          className="flex items-center gap-1 text-amber-300 hover:text-amber-200 bg-amber-500/20 hover:bg-amber-500/30 px-2 py-0.5 rounded transition-colors"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>{m.upvotes || 0}</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Technical Terms Toolbar */}
          <div className="px-3 py-1.5 bg-slate-950/80 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {quickFormulas.map((formula, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(prev => prev ? `${prev} ${formula}` : formula)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-750 text-cyan-300 text-[10px] font-mono whitespace-nowrap border border-slate-700"
              >
                {formula}
              </button>
            ))}
          </div>

          {/* Message Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800">
            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                onClick={() => setIsQuestionMode(prev => !prev)}
                className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-colors ${
                  isQuestionMode
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <HelpCircle className="w-3 h-3" />
                <span>Mark as Question</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder={isQuestionMode ? "Ask a question about this step..." : "Send a message to class..."}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-slate-900 text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500 placeholder:text-slate-500"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:hover:bg-cyan-600 text-white shadow-md shadow-cyan-600/30 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB CONTENT: PARTICIPANTS ROSTER */}
      {activeTab === 'PARTICIPANTS' && (
        <div className="flex-1 flex flex-col min-h-0 bg-slate-900/90">
          {/* Teacher Mass Actions */}
          {isTeacher && (
            <div className="p-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Teacher Controls</span>
              {onMuteAllStudents && (
                <button
                  onClick={onMuteAllStudents}
                  className="px-2 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 text-[11px] font-bold flex items-center gap-1 transition-colors"
                >
                  <VolumeX className="w-3 h-3" />
                  <span>Mute All</span>
                </button>
              )}
            </div>
          )}

          {/* Roster List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
            {participants.map((p) => {
              const isLocal = p.id === localParticipantId;
              const isHost = p.role === 'TEACHER';

              return (
                <div
                  key={p.id}
                  className="p-2 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-between gap-2 hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 shadow" style={{ backgroundColor: p.avatarBg }}>
                      {p.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-slate-200 truncate max-w-[120px]">
                          {p.name} {isLocal ? '(You)' : ''}
                        </span>
                        {isHost && <Crown className="w-3 h-3 text-amber-400 shrink-0" />}
                      </div>
                      <span className="text-[10px] text-slate-400 block">{p.gradeOrClass || (isHost ? 'Instructor' : 'Student')}</span>
                    </div>
                  </div>

                  {/* Actions & Status */}
                  <div className="flex items-center gap-1">
                    {p.isHandRaised && (
                      <button
                        onClick={() => isTeacher && onLowerStudentHand && onLowerStudentHand(p.id)}
                        className="p-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse"
                        title={isTeacher ? 'Click to Lower Hand' : 'Hand Raised'}
                      >
                        <Hand className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {isTeacher && !isHost && onToggleStudentDrawing && (
                      <button
                        onClick={() => onToggleStudentDrawing(p.id)}
                        className={`p-1 rounded border transition-colors ${
                          p.hasDrawingPermission
                            ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                            : 'bg-slate-900 text-slate-500 border-slate-700 hover:text-slate-300'
                        }`}
                        title={p.hasDrawingPermission ? 'Revoke Whiteboard Access' : 'Grant Whiteboard Access'}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {isTeacher && !isHost && onToggleStudentAudio && (
                      <button
                        onClick={() => onToggleStudentAudio(p.id)}
                        className={`p-1 rounded border ${
                          p.isAudioMuted ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        }`}
                        title={p.isAudioMuted ? 'Unmute' : 'Mute'}
                      >
                        {p.isAudioMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
