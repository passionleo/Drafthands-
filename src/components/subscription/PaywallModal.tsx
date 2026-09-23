import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  GraduationCap, 
  CreditCard, 
  Key, 
  ShieldCheck, 
  ArrowRight,
  BookOpen,
  Award,
  Zap,
  Building,
  Check
} from 'lucide-react';
import { DrawingTopic } from '../../types/curriculum';
import { 
  SubscriptionPlan, 
  SubscriptionPlanType, 
  SUBSCRIPTION_PLANS, 
  FREE_TOPICS_PER_TIER,
  UserRoleType
} from '../../types/subscription';
import { useSubscription } from '../../context/SubscriptionContext';
import { payWithPaystack, formatNaira } from '../../utils/paystack';
import { VisitorTracker } from '../../utils/visitorTracker';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetTopic?: DrawingTopic | null;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  targetTopic
}) => {
  const { 
    subscribeToPlan, 
    enableDemoMode, 
    redeemVoucherCode,
    isMasterAdmin,
    enableMasterAdminBypass
  } = useSubscription();

  const [selectedPlanType, setSelectedPlanType] = useState<SubscriptionPlanType>('STUDENT_SESSION');
  const [payerEmail, setPayerEmail] = useState<string>('student@drafthands.edu.ng');
  const [isProcessingPaystack, setIsProcessingPaystack] = useState<boolean>(false);
  const [voucherInput, setVoucherInput] = useState<string>('');
  const [voucherFeedback, setVoucherFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Visitor Access Request to Owner state
  const [isRequestSectionOpen, setIsRequestSectionOpen] = useState<boolean>(false);
  const [requestName, setRequestName] = useState<string>('');
  const [requestEmail, setRequestEmail] = useState<string>('');
  const [requestRole, setRequestRole] = useState<UserRoleType>('STUDENT');
  const [requestInstitution, setRequestInstitution] = useState<string>('');
  const [requestReason, setRequestReason] = useState<string>('');
  const [requestFeedback, setRequestFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmitAccessRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestName.trim() || !requestEmail.trim()) return;

    VisitorTracker.submitAccessRequest({
      name: requestName.trim(),
      email: requestEmail.trim(),
      role: requestRole,
      institution: requestInstitution.trim() || 'Technical College / Secondary School',
      reason: requestReason.trim() || 'Requesting visitor access from platform owner for technical drawing study.'
    });

    setRequestFeedback('Your request has been forwarded directly to the Platform Owner (passion4dami@gmail.com). You will receive access once approved.');
    setTimeout(() => {
      setRequestFeedback(null);
      setIsRequestSectionOpen(false);
    }, 4500);
  };

  const handleApplyMasterBypass = () => {
    enableMasterAdminBypass('passion4dami@gmail.com');
    setVoucherFeedback({
      success: true,
      message: 'Master Owner Bypass applied for passion4dami@gmail.com! All modules unlocked.'
    });
    setTimeout(() => {
      onClose();
    }, 900);
  };

  const selectedPlan = SUBSCRIPTION_PLANS[selectedPlanType] || SUBSCRIPTION_PLANS.STUDENT_SESSION;

  const handleOfficialPaystackCheckout = () => {
    setIsProcessingPaystack(true);
    payWithPaystack({
      email: payerEmail,
      amount: selectedPlan.priceNGN,
      planType: selectedPlanType,
      planName: selectedPlan.name,
      userRole: selectedPlan.audience === 'Teacher' ? 'TEACHER' : selectedPlan.audience === 'Institution' ? 'SCHOOL' : 'STUDENT',
      customerName: payerEmail.split('@')[0],
      onSuccess: (response) => {
        setIsProcessingPaystack(false);
        subscribeToPlan(selectedPlanType, response.reference);
        onClose();
      },
      onClose: () => {
        setIsProcessingPaystack(false);
      },
      onError: () => {
        setIsProcessingPaystack(false);
      }
    });
  };

  const handleRedeemVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherInput.trim()) return;

    const res = redeemVoucherCode(voucherInput);
    setVoucherFeedback(res);

    if (res.success) {
      setTimeout(() => {
        onClose();
      }, 1400);
    }
  };

  const handleActivateDemoMode = () => {
    enableDemoMode();
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
        <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-500/10">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                    Premium Curriculum Access
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                    WAEC / NERDC / ISO Standards
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-slate-100 mt-0.5">
                  Unlock Full Technical Drawing Academy
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Master Admin Bypass Notice */}
          {isMasterAdmin && (
            <div className="mx-4 sm:mx-6 mt-4 p-3.5 bg-gradient-to-r from-amber-500/20 via-emerald-500/15 to-cyan-500/20 border border-amber-400/50 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold text-amber-200">Master Owner Permanent Bypass is Active</span>
                  <p className="text-[11px] text-slate-300">
                    Logged in as Platform Owner (<span className="text-amber-300 font-mono">passion4dami@gmail.com</span>). All modules and tools are fully unlocked.
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors shrink-0 shadow-md shadow-amber-500/20"
              >
                Dismiss / Continue Testing
              </button>
            </div>
          )}

          {/* Modal Content Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
            {/* Freemium Policy Alert & Locked Target Topic */}
            {targetTopic ? (
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2 text-amber-300 font-semibold mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>Locked Module #{targetTopic.moduleCode}: {targetTopic.title}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    You have reached beyond the first {FREE_TOPICS_PER_TIER} free topics of <strong>{targetTopic.tier}</strong>. Subscribe or enter an institution code to unlock this topic and the remaining specialized syllabus.
                  </p>
                </div>
                <span className="font-mono text-[10px] px-2.5 py-1 rounded bg-amber-900/60 text-amber-300 border border-amber-700/60 whitespace-nowrap">
                  {targetTopic.standards.waecRef}
                </span>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/50 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-cyan-300 font-semibold mb-1">
                  <GraduationCap className="w-4 h-4" />
                  <span>Drafthands Freemium Access Model</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  Every student and educator has <strong>unlimited free access to the first 3 topics</strong> in every tier (SS1, SS2, SS3, and Higher Institution). Upgrade to access advanced Building, Machine Drawing, AutoCAD, and CorelDRAW modules.
                </p>
              </div>
            )}

            {/* Subscription Plan Cards Grid */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <span>Select Your Access Plan</span>
              </h3>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {/* 1. Student Termly */}
                <button
                  type="button"
                  onClick={() => setSelectedPlanType('STUDENT_TERMLY')}
                  className={`p-3.5 rounded-xl text-left border transition-all relative flex flex-col justify-between ${
                    selectedPlanType === 'STUDENT_TERMLY'
                      ? 'bg-slate-800/90 border-cyan-400 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-400'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">STUDENT TERMLY</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-100">3-Month Term Pass</h4>
                    <div className="my-2">
                      <span className="text-lg font-mono font-bold text-emerald-400">₦2,500</span>
                      <span className="text-[10px] text-slate-400"> / term</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      Complete syllabus access for 1 secondary term.
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                    WAEC practice & basic whiteboard
                  </div>
                </button>

                {/* 2. Full Academic Session (Popular) */}
                <button
                  type="button"
                  onClick={() => setSelectedPlanType('STUDENT_SESSION')}
                  className={`p-3.5 rounded-xl text-left border transition-all relative flex flex-col justify-between ${
                    selectedPlanType === 'STUDENT_SESSION'
                      ? 'bg-slate-800/90 border-emerald-400 shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-400'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="absolute -top-2.5 right-3 bg-emerald-500 text-slate-950 font-bold text-[9px] px-2 py-0.5 rounded-full shadow">
                    BEST VALUE (SAVE 40%)
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">FULL SESSION PASS</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-100">1-Year Academic Access</h4>
                    <div className="my-2">
                      <span className="text-lg font-mono font-bold text-emerald-400">₦6,000</span>
                      <span className="text-[10px] text-slate-400"> / 1 year</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      All 30+ topics across SS1-SS3 and Polytechnic/University.
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-emerald-400 font-medium">
                    Building, Machine, CAD & CorelDRAW
                  </div>
                </button>

                {/* 3. Teacher Pro */}
                <button
                  type="button"
                  onClick={() => setSelectedPlanType('TEACHER_PRO')}
                  className={`p-3.5 rounded-xl text-left border transition-all relative flex flex-col justify-between ${
                    selectedPlanType === 'TEACHER_PRO'
                      ? 'bg-slate-800/90 border-purple-400 shadow-lg shadow-purple-950/50 ring-1 ring-purple-400'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-purple-400 font-bold">TEACHER PRO</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-100">Lesson Note Suite</h4>
                    <div className="my-2">
                      <span className="text-lg font-mono font-bold text-purple-300">₦12,500</span>
                      <span className="text-[10px] text-slate-400"> / term</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      Automated lesson note generator & printable PDF schemes.
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-purple-300">
                    NERDC Lesson plans & Marking rubrics
                  </div>
                </button>

                {/* 4. Institution / Department */}
                <button
                  type="button"
                  onClick={() => setSelectedPlanType('INSTITUTION_PASS')}
                  className={`p-3.5 rounded-xl text-left border transition-all relative flex flex-col justify-between ${
                    selectedPlanType === 'INSTITUTION_PASS'
                      ? 'bg-slate-800/90 border-blue-400 shadow-lg shadow-blue-950/50 ring-1 ring-blue-400'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-blue-400 font-bold">INSTITUTION</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-100">School Multi-Seat</h4>
                    <div className="my-2">
                      <span className="text-lg font-mono font-bold text-blue-300">₦45,000</span>
                      <span className="text-[10px] text-slate-400"> / year</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      100 student seats + drawing lab projector whiteboard.
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-blue-300">
                    Departmental licensing & onboarding
                  </div>
                </button>
              </div>
            </div>

            {/* Selected Plan Feature Breakdown */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{selectedPlan.name} Includes:</span>
                  </h4>
                  <p className="text-[11px] text-slate-400">{selectedPlan.tagline}</p>
                </div>
                <div className="text-right">
                  <span className="text-base font-mono font-bold text-emerald-400">
                    ₦{selectedPlan.priceNGN.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 block">{selectedPlan.billingPeriod}</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-2 text-xs">
                {(selectedPlan?.features || []).map((feat, i) => (
                  <div key={i} className="flex items-start gap-2 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-tight">{feat}</span>
                  </div>
                ))}
              </div>

              {/* Checkout Action Button & Demo Tier Restriction */}
              <div className="pt-3 border-t border-slate-800 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Official Paystack Checkout: Cards, Bank Transfer, USSD & QR</span>
                  </div>
                  <span className="text-amber-400 font-mono text-[10px] hidden sm:inline">
                    Instant Automated Activation
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1.5">
                    <span className="text-[10px] text-slate-400 font-mono">Receipt:</span>
                    <input
                      type="email"
                      value={payerEmail}
                      onChange={(e) => setPayerEmail(e.target.value)}
                      placeholder="student@example.com"
                      className="bg-transparent text-xs text-emerald-300 placeholder:text-slate-500 focus:outline-none w-44 font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleActivateDemoMode}
                      className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 font-mono text-[11px] border border-slate-700/80 transition-colors"
                      title="Demo mode unlocks free introductory content only"
                    >
                      Preview Free Tier
                    </button>

                    <button
                      onClick={handleOfficialPaystackCheckout}
                      disabled={isProcessingPaystack}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-colors"
                    >
                      {isProcessingPaystack ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Connecting to Paystack...</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          <span>Pay with Paystack ({formatNaira(selectedPlan.priceNGN)})</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* School / Institution License Key Voucher Redemption */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>Have a School Access Code or Scholarship Voucher?</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  e.g. DRAFTHANDS-VIP, WAEC-SCHOLAR-2025, TEST-FACULTY-PASS
                </span>
              </div>

              <form onSubmit={handleRedeemVoucher} className="flex flex-wrap gap-2 text-xs">
                <input
                  type="text"
                  value={voucherInput}
                  onChange={(e) => setVoucherInput(e.target.value)}
                  placeholder="Enter School Access Code (e.g. DRAFTHANDS-VIP)"
                  className="flex-1 min-w-[220px] bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-amber-300 uppercase placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors shadow-md shadow-amber-600/20"
                >
                  Redeem Code
                </button>
                <button
                  type="button"
                  onClick={handleApplyMasterBypass}
                  className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all flex items-center gap-1.5"
                  title="Activate Permanent Master Admin Bypass for passion4dami@gmail.com"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Owner Bypass (passion4dami@gmail.com)</span>
                </button>
              </form>

              {voucherFeedback && (
                <div className={`p-2.5 rounded-lg text-xs font-medium ${
                  voucherFeedback.success ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60' : 'bg-red-950/60 text-red-300 border border-red-800/60'
                }`}>
                  {voucherFeedback.message}
                </div>
              )}
            </div>

            {/* Direct Visitor Permit Request from Owner */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Visiting School, Teacher, or Need Special Permit?</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsRequestSectionOpen(prev => !prev)}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                >
                  {isRequestSectionOpen ? 'Hide Request Form' : 'Request Access from Platform Owner'}
                </button>
              </div>

              {isRequestSectionOpen && (
                <form onSubmit={handleSubmitAccessRequest} className="pt-2 space-y-3 border-t border-slate-800/80 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block text-slate-400 text-[10px] mb-1">Your Full Name:</label>
                      <input
                        type="text"
                        value={requestName}
                        onChange={(e) => setRequestName(e.target.value)}
                        placeholder="e.g. Engr. Mohammed Bello"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[10px] mb-1">Email Address:</label>
                      <input
                        type="email"
                        value={requestEmail}
                        onChange={(e) => setRequestEmail(e.target.value)}
                        placeholder="e.g. bello@govcollege.edu.ng"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[10px] mb-1">Role / Designation:</label>
                      <select
                        value={requestRole}
                        onChange={(e) => setRequestRole(e.target.value as any)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="STUDENT">Student Candidate</option>
                        <option value="TEACHER">Technical Drawing Instructor</option>
                        <option value="PARENT">Parent / Guardian</option>
                        <option value="ADMIN">School Administrator / Inspector</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[10px] mb-1">School / Institution:</label>
                      <input
                        type="text"
                        value={requestInstitution}
                        onChange={(e) => setRequestInstitution(e.target.value)}
                        placeholder="e.g. King's College Lagos"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[10px] mb-1">Reason for Access Request:</label>
                    <textarea
                      rows={2}
                      value={requestReason}
                      onChange={(e) => setRequestReason(e.target.value)}
                      placeholder="e.g. Evaluating interactive smartboard projection for SS2 WAEC preparation..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400 font-mono">
                      Owner Notification: passion4dami@gmail.com
                    </span>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/30 transition-all cursor-pointer"
                    >
                      Submit Access Request to Owner
                    </button>
                  </div>
                </form>
              )}

              {requestFeedback && (
                <div className="p-2.5 rounded-lg text-xs font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 animate-in fade-in duration-200">
                  {requestFeedback}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
