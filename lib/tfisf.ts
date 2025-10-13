/**
 * Simple TF-IDF + cosine similarity to score a resume text against a job description.
 * No external services required.
 */
function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9+#\.]+/g) || []).filter(t => t.length > 1);
}

function tf(tokens: string[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const t of tokens) m.set(t, (m.get(t) || 0) + 1);
  for (const [k, v] of m) m.set(k, v / tokens.length);
  return m;
}

export function tfidfScore(resume: string, job: string) {
  const docTokens = [tokenize(resume), tokenize(job)];
  const docTF = docTokens.map(tf);

  // idf over 2 docs
  const terms = new Set<string>([...docTF[0].keys(), ...docTF[1].keys()]);
  const idf = new Map<string, number>();
  for (const term of terms) {
    let df = 0;
    for (const d of docTokens) if (d.includes(term)) df++;
    idf.set(term, Math.log((2 + 1) / (df + 1)) + 1);
  }

  function vectorize(tfm: Map<string, number>) {
    const vec: number[] = [];
    for (const term of terms) {
      vec.push((tfm.get(term) || 0) * (idf.get(term) || 0));
    }
    return vec;
  }

  const v1 = vectorize(docTF[0]);
  const v2 = vectorize(docTF[1]);

  let dot = 0, n1 = 0, n2 = 0;
  for (let i = 0; i < v1.length; i++) {
    dot += v1[i] * v2[i];
    n1 += v1[i] * v1[i];
    n2 += v2[i] * v2[i];
  }
  const score = (n1 && n2) ? dot / (Math.sqrt(n1) * Math.sqrt(n2)) : 0;

  // top overlapping keywords
  const set1 = new Set(docTokens[0]);
  const set2 = new Set(docTokens[1]);
  const overlap = [...set1].filter(t => set2.has(t)).slice(0, 30);

  return { score, overlap };
}
