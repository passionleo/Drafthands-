import React from 'react';
import { Award, Star, Quote, CheckCircle2, Building, GraduationCap, ShieldCheck } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote: "Before Drafthands, explaining 3rd angle projection and sectional views on a traditional chalkboard was cumbersome. Now, our students visualize isometric slicing in 3D and manipulate the cutting plane directly. Our WAEC Technical Drawing distinction rate jumped from 45% to 89%.",
      author: "Engr. T. O. Balogun",
      role: "Lead Instructor & Head of Technical Education",
      institution: "Federal Science & Technical College, Yaba",
      badge: "Technical Instructor",
      rating: 5
    },
    {
      quote: "The fidelity of the virtual T-Square, 30°/60° set squares, and compass line weights (2H vs HB) is unmatched. Our engineering freshmen transition into CAD drafting with extraordinary spatial confidence and true European/ISO drafting standards compliance.",
      author: "Dr. O. A. Adeleke",
      role: "Senior Lecturer in Mechanical Drafting",
      institution: "Yaba College of Technology",
      badge: "Faculty Educator",
      rating: 5
    },
    {
      quote: "I used to lose marks in WAEC Paper 2 because I kept erasing my compass bisection lines. Drafthands taught me the exact marking scheme and how to keep 2H construction lines crisp. I scored an A1 in Technical Drawing and won the National Olympiad!",
      author: "Chukwuma Adebayo",
      role: "SS3 Technical Student & Drafting Scholar",
      institution: "King's College Lagos",
      badge: "A1 Distinction Student",
      rating: 5
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-950 relative overflow-hidden border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>Endorsed Across West Africa</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Trusted by Technical Colleges, Polytechnics & WAEC Examiners
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Real stories of educational transformation from secondary classrooms to engineering lecture halls.
          </p>
        </div>

        {/* 3 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-7 flex flex-col justify-between shadow-xl hover:border-cyan-500/40 transition-all relative group"
            >
              <Quote className="w-8 h-8 text-cyan-500/20 absolute top-5 right-5" />

              <div className="space-y-4">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                  <span className="text-[11px] font-mono text-slate-400 ml-2">
                    {item.badge}
                  </span>
                </div>

                {/* Quote */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-5 mt-5 border-t border-slate-800/80">
                <div className="text-xs sm:text-sm font-bold text-white">
                  {item.author}
                </div>
                <div className="text-[11px] text-cyan-400 font-medium">
                  {item.role}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {item.institution}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Accreditation Logos Strip */}
        <div className="mt-14 pt-10 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 sm:gap-12 opacity-70 grayscale hover:grayscale-0 transition-all">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>NERDC CURRICULUM</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>WAEC & NECO STANDARDS</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400">
            <Building className="w-4 h-4 text-blue-400" />
            <span>NBTE ACCREDITATION</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400">
            <GraduationCap className="w-4 h-4 text-purple-400" />
            <span>ISO 128 / ISO 129 COMPLIANT</span>
          </div>
        </div>

      </div>
    </section>
  );
};
