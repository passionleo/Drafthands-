import React, { useState } from 'react';
import {
  X,
  School,
  Users,
  ShieldCheck,
  CreditCard,
  Award,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Key,
  ExternalLink,
  ChevronRight,
  Download,
  Building2,
  Sparkles
} from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';

interface AdminConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminConsoleModal: React.FC<AdminConsoleModalProps> = ({ isOpen, onClose }) => {
  const { subscription, currentPlan, openPaywall, userProfile } = useSubscription();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'LICENSES' | 'ROSTER' | 'BILLING'>('OVERVIEW');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-amber-600/30">
              <School className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Institutional Administrator Console
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  School Admin
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {userProfile?.institution || 'Federal Science & Technical College, Yaba'} • Session 2025/2026
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

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 pt-2 bg-slate-950/60 border-b border-slate-800 text-xs font-semibold overflow-x-auto">
          {[
            { id: 'OVERVIEW', label: 'School Overview', icon: Building2 },
            { id: 'LICENSES', label: 'Multi-Seat Licenses', icon: Key },
            { id: 'ROSTER', label: 'Student & Staff Roster', icon: Users },
            { id: 'BILLING', label: 'Paystack Institution Billing', icon: CreditCard }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-2.5 px-3.5 border-b-2 font-medium transition-all ${
                  isActive
                    ? 'border-amber-400 text-amber-300 bg-amber-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-6 custom-scrollbar text-slate-300 text-xs">
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-5">
              {/* Top KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 text-[11px] mb-1">Enrolled Technical Students</div>
                  <div className="text-xl font-bold text-white">248</div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" /> +18 new registrations this term
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 text-[11px] mb-1">Active Educator Passes</div>
                  <div className="text-xl font-bold text-white">8</div>
                  <div className="text-[10px] text-cyan-400 mt-1">Full Grading Desk & Lesson Notes</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 text-[11px] mb-1">NERDC Curriculum Coverage</div>
                  <div className="text-xl font-bold text-emerald-400">92.4%</div>
                  <div className="text-[10px] text-slate-400 mt-1">SS1: 100% • SS2: 95% • SS3: 88%</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 text-[11px] mb-1">School Plan Status</div>
                  <div className="text-sm font-bold text-amber-300">
                    {subscription.isSubscribed ? currentPlan.name : 'Free Institutional Pilot'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {subscription.isSubscribed ? 'Active via Paystack' : 'Upgrade for 500+ seat license'}
                  </div>
                </div>
              </div>

              {/* Institution Bio & Details */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white">Institutional Accreditation</h4>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700/60 text-emerald-300 text-[10px] font-mono">
                    WAEC / NABTEB Approved Center
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Center Number:</span>
                    <span className="font-mono text-white">WAEC-NG-40291-TD</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Department Head:</span>
                    <span className="text-white">Engr. D. Adebayo (FNSE)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Lead Principal / Dean:</span>
                    <span className="text-white">Dr. C. O. Okonjo</span>
                  </div>
                </div>
              </div>

              {/* Recent Classroom Drawing Tasks */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <h4 className="font-bold text-sm text-white">Class Drawing Assessment Activity</h4>
                <div className="divide-y divide-slate-800/80">
                  {[
                    { class: 'SS2 Technical A', topic: 'Isometric to 1st Angle Orthographic Projection', submitted: '36/38', avgScore: '84%' },
                    { class: 'SS1 Engineering B', topic: 'Tangency & Involute Construction', submitted: '42/45', avgScore: '79%' },
                    { class: 'SS3 Exam Prep', topic: 'Sectional Mechanical Assembly of Flanged Coupling', submitted: '29/30', avgScore: '88%' }
                  ].map((row, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-white">{row.class}</div>
                        <div className="text-slate-400 text-[11px]">{row.topic}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-cyan-400">{row.submitted} Submissions</div>
                        <div className="text-[10px] text-emerald-400">Class Average: {row.avgScore}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'LICENSES' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-sm text-white">Multi-Seat Voucher & Allocation Keys</h4>
                  <p className="text-slate-400 text-xs">
                    Issue license keys for technical drawing classrooms, computer labs, and student tablets.
                  </p>
                </div>
                <button
                  onClick={() => openPaywall()}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md shadow-amber-600/30 flex items-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Purchase More Seats</span>
                </button>
              </div>

              <div className="space-y-2">
                {[
                  { code: 'FSTC-YABA-SS1-2025', seats: '50 Seats', tier: 'SS1 Plane Geometry', status: 'Active (48 claimed)' },
                  { code: 'FSTC-YABA-SS2-2025', seats: '50 Seats', tier: 'SS2 Solid & Orthographic', status: 'Active (49 claimed)' },
                  { code: 'FSTC-YABA-SS3-2025', seats: '40 Seats', tier: 'SS3 WAEC Past Question Pack', status: 'Active (37 claimed)' },
                  { code: 'FSTC-TEACHER-FACULTY', seats: '10 Seats', tier: 'Full Educator Lesson Note Suite', status: 'Active (8 claimed)' }
                ].map((key, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-mono font-bold text-amber-300 text-xs">{key.code}</div>
                      <div className="text-slate-400 text-[11px]">{key.tier} • {key.seats}</div>
                    </div>
                    <span className="px-2 py-1 rounded bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 font-mono text-[10px]">
                      {key.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ROSTER' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-white">Registered Academy Users</h4>
                <span className="text-[11px] text-slate-400">Total: 256 Active Profiles</span>
              </div>
              <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                {[
                  { name: 'Tunde Bakare', email: 'tunde.b@student.drafthands.edu', role: 'STUDENT', class: 'SS2 Tech', verified: true },
                  { name: 'Engr. D. Adebayo', email: 'adebayo.engr@drafthands.edu', role: 'TEACHER', class: 'Head of TD', verified: true },
                  { name: 'Mrs. Folashade Bakare', email: 'folashade.b@parent.drafthands.edu', role: 'PARENT', class: 'Guardian', verified: true },
                  { name: 'Chukwuma Obi', email: 'c.obi@student.drafthands.edu', role: 'STUDENT', class: 'SS1 Tech', verified: true },
                  { name: 'Aminu Mohammed', email: 'a.mohammed@student.drafthands.edu', role: 'STUDENT', class: 'SS3 Revision', verified: true }
                ].map((user, i) => (
                  <div key={i} className="p-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-white flex items-center gap-2">
                        <span>{user.name}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                          user.role === 'STUDENT'
                            ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/30'
                            : user.role === 'TEACHER'
                              ? 'bg-purple-950 text-purple-300 border border-purple-500/30'
                              : 'bg-blue-950 text-blue-300 border border-blue-500/30'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                      <div className="text-slate-400 text-[11px] font-mono">{user.email} • {user.class}</div>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'BILLING' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white">Paystack Institutional Subscription</h4>
                  <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300 font-mono text-[10px]">
                    Paystack Live Gateway
                  </span>
                </div>
                <p className="text-slate-300 text-xs">
                  Institutional Master Pass covers up to 500 student accounts, 10 instructor passes, WAEC 10-year exam bank, and CAD vector export tools.
                </p>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">Current Plan Rate:</div>
                    <div className="text-base font-bold text-white font-mono">₦25,000 / school term</div>
                  </div>
                  <button
                    onClick={() => openPaywall()}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center gap-2 transition-all"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Manage via Paystack</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
