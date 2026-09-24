import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  GraduationCap, 
  Briefcase, 
  Users, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Key, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2,
  Building,
  School,
  AlertCircle,
  RefreshCw,
  Compass,
  BookOpen,
  FileCheck2
} from 'lucide-react';

export type UserRoleType = 'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN';
export type PortalTargetType = 'STUDENT' | 'TEACHER' | 'PARENT' | 'PAST_QUESTIONS' | 'STUDIO' | 'OWNER';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'SIGN_IN' | 'REGISTER';
  initialRole?: UserRoleType;
  targetPortal?: PortalTargetType;
  onAuthSuccess: (
    role: UserRoleType, 
    userDetails: { name: string; email: string; institution?: string; isEmailVerified?: boolean },
    targetPortal?: PortalTargetType
  ) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'SIGN_IN',
  initialRole,
  targetPortal = 'STUDENT',
  onAuthSuccess
}) => {
  const [mode, setMode] = useState<'SIGN_IN' | 'REGISTER'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRoleType>(() => {
    if (targetPortal === 'OWNER') return 'ADMIN';
    if (initialRole) return initialRole;
    if (targetPortal === 'TEACHER') return 'TEACHER';
    if (targetPortal === 'PARENT') return 'PARENT';
    return 'STUDENT';
  });
  
  const [fullName, setFullName] = useState('');
  const [emailOrUsername, setEmailOrUsername] = useState(() => {
    if (targetPortal === 'OWNER') return 'passion4dami@gmail.com';
    return '';
  });
  const [password, setPassword] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync state when props change
  useEffect(() => {
    if (targetPortal === 'OWNER') {
      setSelectedRole('ADMIN');
      if (!emailOrUsername) setEmailOrUsername('passion4dami@gmail.com');
    } else if (initialRole) {
      setSelectedRole(initialRole);
    } else if (targetPortal === 'TEACHER') {
      setSelectedRole('TEACHER');
    } else if (targetPortal === 'PARENT') {
      setSelectedRole('PARENT');
    } else {
      setSelectedRole('STUDENT');
    }
    setMode(initialMode);
    setErrorMsg('');
  }, [targetPortal, initialRole, initialMode, isOpen]);

  if (!isOpen) return null;

  // Contextual title & badges for the portal being accessed
  const getPortalInfo = () => {
    switch (targetPortal) {
      case 'OWNER':
        return {
          title: 'Platform Owner Master Command Center',
          badge: 'Owner Access',
          icon: ShieldCheck,
          badgeColor: 'bg-amber-950 text-amber-300 border-amber-500/40',
          desc: 'Owner access authentication. Enter master credentials for instant root access.'
        };
      case 'TEACHER':
        return {
          title: 'Technical Teacher Portal',
          badge: 'Teacher Access',
          icon: BookOpen,
          badgeColor: 'bg-purple-950 text-purple-300 border-purple-500/40',
          desc: 'Access NERDC lesson notes, student performance analytics, and 2-way live classes.'
        };
      case 'PARENT':
        return {
          title: 'Parent Monitoring Portal',
          badge: 'Parent Access',
          icon: Users,
          badgeColor: 'bg-blue-950 text-blue-300 border-blue-500/40',
          desc: 'Monitor your ward\'s drafting sheets, continuous assessment, and WAEC exam readiness.'
        };
      case 'PAST_QUESTIONS':
        return {
          title: '10-Year WAEC/NECO Exam Archive',
          badge: 'Exam Archive Hub',
          icon: FileCheck2,
          badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-500/40',
          desc: 'Access verified step-by-step vector solutions and chief examiner marking rubrics.'
        };
      default:
        return {
          title: 'Student CAD & Drafting Studio',
          badge: 'Student Access',
          icon: Compass,
          badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-500/40',
          desc: 'Access curriculum syllabus (SS1–SS3 & Higher Inst), virtual instruments, and CAD simulations.'
        };
    }
  };

  const portalInfo = getPortalInfo();
  const PortalIcon = portalInfo.icon;

  // Submit form and sign in immediately with username/email and password (bypassing OTP)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailOrUsername?.trim()) {
      setErrorMsg('Please enter your email or username.');
      return;
    }

    if (!password?.trim()) {
      setErrorMsg('Please enter your password.');
      return;
    }

    const email = emailOrUsername.includes('@') ? emailOrUsername : (emailOrUsername ? `${emailOrUsername.toLowerCase()}@drafthands.edu.ng` : 'user@drafthands.edu.ng');
    const roleToUse = selectedRole || 'STUDENT';

    // Set authenticated user state directly
    const user = {
      id: 'user_1',
      name: fullName || 'Engr. Kolawole',
      email: email,
      role: roleToUse
    };

    let resolvedPortal: PortalTargetType = targetPortal;
    if (roleToUse === 'ADMIN' || targetPortal === 'OWNER') resolvedPortal = 'OWNER';
    else if (roleToUse === 'TEACHER') resolvedPortal = 'TEACHER';
    else if (roleToUse === 'PARENT') resolvedPortal = 'PARENT';
    else resolvedPortal = 'STUDENT';

    onAuthSuccess?.(roleToUse, {
      name: user?.name || 'Engr. Kolawole',
      email: user?.email || 'user@drafthands.edu.ng',
      institution: institutionName || 'DraftHands Technical College',
      isEmailVerified: true
    }, resolvedPortal);

    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-950/95 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shrink-0 ${
              targetPortal === 'OWNER' 
                ? 'bg-gradient-to-tr from-amber-600 to-amber-500 text-white shadow-amber-600/30' 
                : 'bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-cyan-600/30'
            }`}>
              {PortalIcon ? <PortalIcon className="w-5 h-5 text-white" /> : <Lock className="w-5 h-5 text-white" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  {portalInfo?.title || 'Authentication'}
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${portalInfo?.badgeColor || 'bg-cyan-950 text-cyan-300'}`}>
                  {portalInfo?.badge || 'Portal'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {portalInfo?.desc || 'Sign in to access your portal.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => onClose?.()}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch: Sign in vs Register */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-950 border-b border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setMode('SIGN_IN')}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'SIGN_IN'
                ? 'bg-slate-800 text-cyan-300 shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Sign In (Username & Password)</span>
          </button>
          <button
            onClick={() => setMode('REGISTER')}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'REGISTER'
                ? 'bg-slate-800 text-cyan-300 shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Register New Account</span>
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 custom-scrollbar">
          {/* Role Selection Tabs (Only when not in Owner portal) */}
          {targetPortal !== 'OWNER' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Select Your Academic Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRole('STUDENT')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedRole === 'STUDENT'
                      ? 'bg-cyan-950/80 border-cyan-500 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <GraduationCap className={`w-4 h-4 mx-auto mb-1 ${selectedRole === 'STUDENT' ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <div className="text-xs font-bold leading-tight">Student</div>
                  <div className="text-[10px] text-slate-400">SS1–SS3 & Poly</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('TEACHER')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedRole === 'TEACHER'
                      ? 'bg-purple-950/80 border-purple-500 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <Briefcase className={`w-4 h-4 mx-auto mb-1 ${selectedRole === 'TEACHER' ? 'text-purple-400' : 'text-slate-500'}`} />
                  <div className="text-xs font-bold leading-tight">Instructor</div>
                  <div className="text-[10px] text-slate-400">Lesson Generator</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('PARENT')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedRole === 'PARENT'
                      ? 'bg-blue-950/80 border-blue-500 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <Users className={`w-4 h-4 mx-auto mb-1 ${selectedRole === 'PARENT' ? 'text-blue-400' : 'text-slate-500'}`} />
                  <div className="text-xs font-bold leading-tight">Parent</div>
                  <div className="text-[10px] text-slate-400">Ward Progress</div>
                </button>
              </div>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {mode === 'REGISTER' && (
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Full Legal Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Babatunde Adeleke"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">
                {mode === 'SIGN_IN' ? 'Username or Email Address' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={emailOrUsername}
                  onChange={(e) => {
                    setEmailOrUsername(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder={targetPortal === 'OWNER' ? 'passion4dami@gmail.com' : 'e.g. student@drafthands.edu.ng'}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
                {mode === 'SIGN_IN' && (
                  <span className="text-[11px] text-cyan-400 hover:text-cyan-300 cursor-pointer">
                    Forgot Password?
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            {mode === 'REGISTER' && (
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Secondary School or Technical College (Optional)
                </label>
                <div className="relative">
                  <School className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    placeholder="e.g. Kings College Lagos / Federal Tech College"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-cyan-600 focus:ring-0"
                />
                <span>Remember this session</span>
              </label>
              <span className="text-[11px] text-emerald-400 font-mono">
                ✓ Instant Sign-In Active
              </span>
            </div>

            <button
              type="submit"
              className={`w-full py-2.5 rounded-xl text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all mt-2 cursor-pointer ${
                targetPortal === 'OWNER'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 shadow-amber-600/30'
                  : 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-cyan-600/30'
              }`}
            >
              <span>
                {mode === 'SIGN_IN' 
                  ? 'Sign In & Send Verification Code' 
                  : 'Sign In'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
