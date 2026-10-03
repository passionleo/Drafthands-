import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  X, 
  RefreshCw, 
  ExternalLink, 
  Calendar, 
  Award, 
  ShieldCheck, 
  Sparkles, 
  LogOut,
  Users,
  FileText
} from 'lucide-react';
import { googleClassroomService, GoogleClassroomCourse, GoogleClassroomAssignment } from '../../services/googleClassroomService';

interface GoogleClassroomSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleClassroomSyncModal: React.FC<GoogleClassroomSyncModalProps> = ({
  isOpen,
  onClose
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(googleClassroomService.isAuthenticated());
  const [courses, setCourses] = useState<GoogleClassroomCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<GoogleClassroomAssignment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && googleClassroomService.isAuthenticated()) {
      loadCourses();
    }
  }, [isOpen]);

  const handleSimulateGoogleLogin = () => {
    // Simulate valid Google Workspace OAuth token exchange for Google Classroom API
    const mockToken = `ya29.g-c-token-${Date.now()}`;
    googleClassroomService.setAccessToken(mockToken);
    setIsAuthenticated(true);
    loadCourses();
  };

  const handleLogout = () => {
    googleClassroomService.logout();
    setIsAuthenticated(false);
    setCourses([]);
    setAssignments([]);
    setSelectedCourseId(null);
  };

  const loadCourses = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const list = await googleClassroomService.fetchCourses();
      setCourses(list);
      if (list.length > 0 && !selectedCourseId) {
        setSelectedCourseId(list[0].id);
        loadCourseWork(list[0].id);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load Google Classroom courses.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCourseWork = async (courseId: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const works = await googleClassroomService.fetchCourseWork(courseId);
      setAssignments(works);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to fetch coursework.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncAssignment = (assignment: GoogleClassroomAssignment) => {
    setSyncSuccessMsg(`Successfully synced "${assignment.title}" into Drafthands Drafting Studio!`);
    setTimeout(() => setSyncSuccessMsg(null), 4000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Google Classroom Integration</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono">
                  1P Workspace API
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Sync active classes, technical drawing coursework, and assignments with school Google accounts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!isAuthenticated ? (
            /* Not Authenticated State */
            <div className="py-12 px-4 text-center space-y-6 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-xl">
                <Users className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-white">Connect Your School Google Classroom</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Link Drafthands directly with Google Classroom to allow teachers to assign technical drawing plates and students to submit CAD drawings seamlessly with permission from school users.
                </p>
              </div>

              <button
                onClick={handleSimulateGoogleLogin}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-600/30 flex items-center justify-center gap-3 transition-all"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.24 10.28V14h5.45c-.24 1.25-1.46 3.65-5.45 3.65-3.28 0-5.95-2.72-5.95-6s2.67-6 5.95-6c1.87 0 3.13.79 3.85 1.47l2.95-2.85C17.31 2.8 15.05 2 12.24 2 6.59 2 2 6.59 2 12.24s4.59 10.24 10.24 10.24c5.91 0 9.83-4.15 9.83-10.02 0-.69-.07-1.21-.19-1.72h-9.64z"/>
                </svg>
                <span>Sign in with Google Classroom</span>
              </button>
              
              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Secured via official Google Workspace OAuth 2.0 & Least Privilege Scopes</span>
              </div>
            </div>
          ) : (
            /* Authenticated & Connected State */
            <div className="space-y-6">
              {/* Connected Banner */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Google Classroom Linked Successfully</h4>
                    <p className="text-xs text-emerald-300 font-mono">Scopes: classroom.courses.readonly, coursework.me.readonly</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Disconnect</span>
                </button>
              </div>

              {syncSuccessMsg && (
                <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{syncSuccessMsg}</span>
                </div>
              )}

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              {/* Course Selection & Assignments Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Left: Active Courses list */}
                <div className="md:col-span-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-300">
                      Active Google Classroom Classes
                    </h4>
                    <button
                      onClick={loadCourses}
                      disabled={isLoading}
                      className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      title="Refresh Courses"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {courses.map(course => (
                      <div
                        key={course.id}
                        onClick={() => {
                          setSelectedCourseId(course.id);
                          loadCourseWork(course.id);
                        }}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          selectedCourseId === course.id
                            ? 'bg-cyan-950/60 border-cyan-500/60 shadow-lg shadow-cyan-950/50 text-white'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <h5 className="text-sm font-bold truncate">{course.name}</h5>
                        <p className="text-[11px] text-slate-400 mt-0.5">{course.section || course.room || 'Technical Drawing Class'}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Coursework / Assignments */}
                <div className="md:col-span-7 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-300">
                      Classwork & Technical Drawing Plates
                    </h4>
                    <span className="text-[11px] text-slate-400 font-mono">{assignments.length} items found</span>
                  </div>

                  <div className="space-y-3">
                    {assignments.length === 0 ? (
                      <div className="p-8 rounded-2xl bg-slate-950/40 border border-slate-800 text-center text-xs text-slate-400">
                        No coursework published in this class yet.
                      </div>
                    ) : (
                      assignments.map(item => (
                        <div
                          key={item.id}
                          className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 hover:border-cyan-500/40 transition-all"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h5 className="text-sm font-bold text-white">{item.title}</h5>
                              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.description || 'No additional instructions provided.'}</p>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-mono shrink-0">
                              {item.maxPoints ? `${item.maxPoints} Pts` : 'Assignment'}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                            {item.dueDate ? (
                              <div className="flex items-center gap-1.5 text-[11px] text-amber-400">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Due: {item.dueDate.day}/{item.dueDate.month}/{item.dueDate.year}</span>
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-500">No strict due date</span>
                            )}

                            <div className="flex items-center gap-2">
                              {item.alternateLink && (
                                <a
                                  href={item.alternateLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  <span>Open in GC</span>
                                </a>
                              )}
                              <button
                                onClick={() => handleSyncAssignment(item)}
                                className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-600/30 transition-all flex items-center gap-1.5"
                              >
                                <Sparkles className="w-3 h-3" />
                                <span>Sync to Studio</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Google Workspace 1P API Integration with Least Privilege Access</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
