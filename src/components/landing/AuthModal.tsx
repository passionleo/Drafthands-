import React, { useState } from 'react';
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
  Phone
} from 'lucide-react';
import { ParticipantRole } from '../../types/liveClass';

export type UserRoleType = 'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'SIGN_IN' | 'REGISTER';
  onAuthSuccess: (
    role: UserRoleType, 
    userDetails: { name: string; email: string; institution?: string; isEmailVerified?: boolean }
  ) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'SIGN_IN',
  onAuthSuccess
}) => {
  const [mode, setMode] = useState<'SIGN_IN' | 'REGISTER' | 'VERIFY_EMAIL'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRoleType>('STUDENT');
  const [fullName, setFullName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Email verification state
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'REGISTER' && selectedRole === 'STUDENT') {
      // Enforce email verification for student registration
      setVerificationError('');
      setMode('VERIFY_EMAIL');
      return;
    }

    onAuthSuccess(selectedRole, {
      name: fullName || (selectedRole === 'STUDENT' ? 'Demo Student 1' : selectedRole === 'TEACHER' ? 'Demo Instructor' : selectedRole === 'PARENT' ? 'Demo Parent Guardian' : 'Demo Academic Dean'),
      email: emailOrPhone || 'user@test-academy.edu.ng',
      institution: institutionName || 'Test Technical Academy',
      isEmailVerified: true
    });
    onClose();
  };

  const handleVerifyEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationError('');
    setIsVerifying(true);

    const cleanCode = verificationCode.trim();
    if (cleanCode.length < 4) {
      setIsVerifying(false);
      setVerificationError('Please enter the full 6-digit verification code.');
      return;
    }

    setTimeout(() => {
      setIsVerifying(false);
      onAuthSuccess('STUDENT', {
        name: fullName || 'Demo Student 1 (SS2 Technical)',
        email: emailOrPhone || 'student@test-academy.edu.ng',
        institution: institutionName || 'Test Technical Academy',
        isEmailVerified: true
      });
      onClose();
    }, 600);
  };

  const handleQuickDemo = (role: UserRoleType) => {
    const demoConfigs: Record<UserRoleType, { name: string; email: string; institution: string; isEmailVerified: boolean }> = {
      STUDENT: {
        name: 'Demo Student 1 (SS2 Technical)',
        email: 'demo.student1@test-academy.edu.ng',
        institution: 'Test Technical Academy',
        isEmailVerified: true
      },
      TEACHER: {
        name: 'Demo Technical Instructor',
        email: 'demo.teacher@test-academy.edu.ng',
        institution: 'Test Technical Academy',
        isEmailVerified: true
      },
      PARENT: {
        name: 'Demo Parent Guardian',
        email: 'demo.parent@test-academy.edu.ng',
        institution: 'Guardian of Demo Student 1',
        isEmailVerified: true
      },
      ADMIN: {
        name: 'Demo Academic Dean',
        email: 'demo.dean@test-academy.edu.ng',
        institution: 'Test Technical Academy',
        isEmailVerified: true
      }
    };

    onAuthSuccess(role, demoConfigs[role]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-cyan-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {mode === 'VERIFY_EMAIL' 
                  ? 'Verify Student Email'
                  : mode === 'SIGN_IN' 
                    ? 'Sign In to Drafthands' 
                    : 'Create Your Free Academy Account'}
              </h3>
              <p className="text-xs text-slate-400">
                {mode === 'VERIFY_EMAIL'
                  ? 'Mandatory verification required before granting studio & syllabus access'
                  : 'Access NERDC curriculum, digital CAD tools, and WAEC archives'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch: Sign in vs Register (hidden when in verification mode) */}
        {mode !== 'VERIFY_EMAIL' && (
          <div className="grid grid-cols-2 p-1.5 bg-slate-950 border-b border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setMode('SIGN_IN')}
              className={`py-2 rounded-lg transition-all ${
                mode === 'SIGN_IN'
                  ? 'bg-slate-800 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('REGISTER')}
              className={`py-2 rounded-lg transition-all ${
                mode === 'REGISTER'
                  ? 'bg-slate-800 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create New Account
            </button>
          </div>
        )}

        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 custom-scrollbar">
          {mode === 'VERIFY_EMAIL' ? (
            <div className="space-y-4 py-2">
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto shadow-inner">
                  <Mail className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-white">Verification Code Dispatched</h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  We've sent a 6-digit confirmation code to{' '}
                  <span className="font-semibold text-cyan-300">{emailOrPhone || 'your registered email'}</span>.
                  Please enter the code below to activate your student account.
                </p>
                <div className="pt-2 flex items-center justify-center gap-2">
                  <span className="text-[11px] text-slate-400">Testing Code:</span>
                  <button
                    type="button"
                    onClick={() => setVerificationCode('849201')}
                    className="px-2 py-0.5 rounded bg-cyan-900/60 hover:bg-cyan-800/80 text-cyan-300 font-mono text-[11px] border border-cyan-700/50 transition-colors"
                  >
                    849201 (Click to Auto-fill)
                  </button>
                </div>
              </div>

              <form onSubmit={handleVerifyEmail} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block text-center">
                    Enter 6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={verificationCode}
                    onChange={e => {
                      setVerificationCode(e.target.value);
                      if (verificationError) setVerificationError('');
                    }}
                    placeholder="••••••"
                    className="w-full text-center tracking-[0.5em] font-mono text-xl py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    autoFocus
                  />
                  {verificationError && (
                    <p className="text-xs text-red-400 text-center font-medium mt-1">
                      {verificationError}
                    </p>
                  )}
                  {resendSuccess && (
                    <p className="text-xs text-emerald-400 text-center font-medium mt-1">
                      A fresh verification code was sent to your inbox!
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  {isVerifying ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Authenticating Email...
                    </span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify Email & Enter Studio</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-xs pt-1 text-slate-400">
                  <button
                    type="button"
                    onClick={() => {
                      setResendSuccess(true);
                      setTimeout(() => setResendSuccess(false), 3000);
                    }}
                    className="text-cyan-400 hover:underline"
                  >
                    Resend Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('REGISTER')}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Back to edit details
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              {/* Role selector */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
                  Select Your Educational Role
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { role: 'STUDENT' as UserRoleType, label: 'Student', icon: GraduationCap, desc: 'SS1–SS3 & Higher Inst' },
                { role: 'TEACHER' as UserRoleType, label: 'Teacher', icon: Briefcase, desc: 'Lesson Notes & Live Class' },
                { role: 'PARENT' as UserRoleType, label: 'Parent', icon: Users, desc: 'Track Progress & Scores' },
                { role: 'ADMIN' as UserRoleType, label: 'School Admin', icon: School, desc: 'Institution Management' }
              ].map(item => {
                const Icon = item.icon;
                const isSelected = selectedRole === item.role;
                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => setSelectedRole(item.role)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-300 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <div>
                      <div className="font-bold text-xs text-white">{item.label}</div>
                      <div className="text-[10px] text-slate-400 leading-tight">{item.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'REGISTER' && (
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Chukwuma Adebayo"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">Email Address or Student ID</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={emailOrPhone}
                  onChange={e => setEmailOrPhone(e.target.value)}
                  placeholder="student@school.edu.ng or +234..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {mode === 'REGISTER' && (
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Secondary School or Technical College</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={institutionName}
                    onChange={e => setInstitutionName(e.target.value)}
                    placeholder="e.g. Federal Technical College, Yaba"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs text-slate-300 font-medium">Password</label>
                {mode === 'SIGN_IN' && (
                  <button type="button" className="text-[11px] text-cyan-400 hover:underline">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0"
                />
                <span>Remember this device</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 transition-all mt-2"
            >
              <span>{mode === 'SIGN_IN' ? 'Sign In & Enter Academy' : 'Complete Registration & Start Free'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick 1-Click Demo Logins for instant evaluation */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-semibold uppercase text-slate-400">
                1-Click Instant Evaluation Demo
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">No password required</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('STUDENT')}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-left text-xs text-slate-300 transition-all flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                <span className="truncate font-semibold">Demo as Student (SS2)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('TEACHER')}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-left text-xs text-slate-300 transition-all flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                <span className="truncate font-semibold">Demo as Technical Teacher</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('PARENT')}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-left text-xs text-slate-300 transition-all flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span className="truncate font-semibold">Demo as Parent / Guardian</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('ADMIN')}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-left text-xs text-slate-300 transition-all flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                <span className="truncate font-semibold">Demo as School Principal</span>
              </button>
            </div>
          </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
};
