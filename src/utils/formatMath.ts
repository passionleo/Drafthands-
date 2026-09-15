/**
 * Mathematical Formulation and Proof Formatter
 * Converts raw mathematical/LaTeX notation to clean, accessible Unicode symbols.
 * (e.g. ^\circ, ^/circ, \circ -> °; \theta -> θ; \pi -> π; \frac{a}{b} -> a/b; \sqrt{x} -> √(x); \pm -> ±)
 */

export function formatMathSymbols(input?: string): string {
  if (!input) return '';
  let s = input;

  // 1. Degree symbol replacements: ^\circ, ^/circ, \circ, ^{\circ}, ^circ
  s = s.replace(/\^?\\?circ/gi, '°');
  s = s.replace(/\^?\/circ/gi, '°');
  s = s.replace(/\^\{?°\}?/g, '°');
  s = s.replace(/°\^/g, '°');

  // 2. LaTeX text wrappers: \text{...} -> ...
  s = s.replace(/\\text\{([^}]+)\}/g, '$1');

  // 3. Mathematical operators and relations
  s = s.replace(/\\times/g, '×');
  s = s.replace(/\\cdot/g, '·');
  s = s.replace(/\\pm/g, '±');
  s = s.replace(/\\mp/g, '∓');
  s = s.replace(/\\le(?!a)/g, '≤');
  s = s.replace(/\\ge(?!a)/g, '≥');
  s = s.replace(/\\approx/g, '≈');
  s = s.replace(/\\neq/g, '≠');
  s = s.replace(/\\angle/g, '∠');
  s = s.replace(/\\perp/g, '⊥');
  s = s.replace(/\\cap/g, '∩');
  s = s.replace(/\\cup/g, '∪');
  s = s.replace(/\\in/g, '∈');
  s = s.replace(/\\notin/g, '∉');
  s = s.replace(/\\subset/g, '⊂');
  s = s.replace(/\\subseteq/g, '⊆');
  s = s.replace(/\\iff/g, '⟺');
  s = s.replace(/\\implies/g, '⟹');
  s = s.replace(/\\to\b/g, '→');

  // 4. Greek letters
  s = s.replace(/\\theta/g, 'θ');
  s = s.replace(/\\pi/g, 'π');
  s = s.replace(/\\Delta/g, 'Δ');
  s = s.replace(/\\delta/g, 'δ');
  s = s.replace(/\\alpha/g, 'α');
  s = s.replace(/\\beta/g, 'β');
  s = s.replace(/\\gamma/g, 'γ');
  s = s.replace(/\\lambda/g, 'λ');
  s = s.replace(/\\phi/g, 'φ');
  s = s.replace(/\\omega/g, 'ω');
  s = s.replace(/\\sigma/g, 'σ');

  // 5. Number sets & common symbols
  s = s.replace(/\\mathbb\{Z\}/g, 'ℤ');
  s = s.replace(/\\mathbb\{R\}/g, 'ℝ');
  s = s.replace(/\\mathbb\{N\}/g, 'ℕ');
  s = s.replace(/\\sum/g, '∑');

  // 6. Fractions: \frac{a}{b} -> a / b (or (a) / (b) if compound)
  // Repeat to handle nested fractions if any
  for (let i = 0; i < 3; i++) {
    s = s.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, (_m, num, den) => {
      const trimmedNum = num.trim();
      const trimmedDen = den.trim();
      const needsParenNum = trimmedNum.includes('+') || trimmedNum.includes('-');
      const needsParenDen = trimmedDen.includes('+') || trimmedDen.includes('-') || trimmedDen.includes('*') || trimmedDen.includes('·') || trimmedDen.includes('×');
      const formattedNum = needsParenNum ? `(${trimmedNum})` : trimmedNum;
      const formattedDen = needsParenDen ? `(${trimmedDen})` : trimmedDen;
      return `${formattedNum} / ${formattedDen}`;
    });
  }
  s = s.replace(/\\frac/g, '');

  // 7. Square roots: \sqrt{...} -> √( ... )
  s = s.replace(/\\sqrt\{([^{}]+)\}/g, '√($1)');
  s = s.replace(/\\sqrt/g, '√');

  // 8. Binomial coefficients: \binom{n}{k} -> C(n, k)
  s = s.replace(/\\binom\{([^{}]+)\}\{([^{}]+)\}/g, 'C($1, $2)');

  // 9. LaTeX formatting commands
  s = s.replace(/\\left\(/g, '(').replace(/\\right\)/g, ')');
  s = s.replace(/\\left\[/g, '[').replace(/\\right\]/g, ']');
  s = s.replace(/\\left\{/g, '{').replace(/\\right\}/g, '}');
  s = s.replace(/\\overline\{([^}]+)\}/g, '$1');
  s = s.replace(/\\quad/g, '   ').replace(/\\qquad/g, '      ');
  s = s.replace(/\\,/g, ' ').replace(/\\;/g, '; ');
  s = s.replace(/\\\\/g, '\n');

  // 10. Superscripts and Subscripts
  s = s.replace(/\^2(?!\d)/g, '²');
  s = s.replace(/\^3(?!\d)/g, '³');
  s = s.replace(/\^4(?!\d)/g, '⁴');
  s = s.replace(/\^n(?!\w)/g, 'ⁿ');

  // 11. Clean up dangling braces and redundant backslashes
  s = s.replace(/\\([a-zA-Z]+)/g, '$1');
  s = s.replace(/[{}]/g, '');

  // 12. Fix multiple adjacent degree symbols
  s = s.replace(/°+/g, '°');

  return s.trim();
}
