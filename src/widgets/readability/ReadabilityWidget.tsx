import type { WidgetProps } from "../types";

export type ReadabilityOptions = {
  scale: "percent" | "ten";
  showTarget: boolean;
  target: number;
};

// 1. Conteo de sílabas adaptado al español (Se mantiene igual, es muy preciso)
function countSyllables(text: string): number {
  if (!text) return 0;
  
  const words = text.toLowerCase().match(/[a-záéíóúüñ]+/g) || [];
  let totalSyllables = 0;

  for (const word of words) {
    let w = word.replace(/([qg])u([eéíi])/g, '$1$2');
    const vowels = w.match(/[aeiouáéíóúü]/g);
    if (!vowels) continue;

    let syllables = vowels.length;
    const vowelGroups = w.match(/[aeiouáéíóúü]{2,}/g) || [];
    
    for (const group of vowelGroups) {
      let reductions = group.length - 1;
      
      const strongStrong = group.match(/[aeoáéó]{2}/g);
      if (strongStrong) reductions -= strongStrong.length;
      
      const hiatusAccented = group.match(/[aeoáéó][íú]|[íú][aeoáéó]/g);
      if (hiatusAccented) reductions -= hiatusAccented.length;
      
      syllables -= Math.max(0, reductions);
    }
    
    totalSyllables += Math.max(1, syllables);
  }
  
  return totalSyllables;
}

// 2. NUEVO: Cálculo Szigriszt-Pazos
function computeSzigrisztPazos(text: string): number | null {
  if (!text || text.trim().length === 0) return null;

  const segmenterWord = new Intl.Segmenter('es', { granularity: 'word' });
  const words = Array.from(segmenterWord.segment(text)).filter(s => s.isWordLike);
  
  if (words.length === 0) return null;

  const segmenterSentence = new Intl.Segmenter('es', { granularity: 'sentence' });
  const sentences = Array.from(segmenterSentence.segment(text)).filter(s => s.segment.trim().length > 0);

  const wordCount = words.length;

  const sentenceCount = Math.max(1, sentences.length); 
  const syllablesCount = countSyllables(text);

  const avgSyllables = syllablesCount / wordCount;
  const avgWords = wordCount / sentenceCount;

  const score = 206.835 - (62.3 * avgSyllables) - avgWords;
  
  return Math.max(0, Math.min(100, Math.round(score * 10) / 10));
}

// 3. NUEVO: Escala Oficial INFLESZ traducida
function getDifficultyLabel(score: number): string {
  // Los cortes están basados en los grados oficiales de la escala INFLESZ
  if (score > 80) return "Very easy";         // Grados 1-4
  if (score >= 65) return "Fairly easy";      // Grados 5-8
  if (score >= 50) return "Standard";         // Grados 9-12 (Prensa general / Bachillerato)
  if (score >= 35) return "Fairly difficult"; // Universitario
  if (score >= 15) return "Difficult";        // Universitario especializado
  return "Very difficult";                    // Científico / Técnico
}

// 4. Componente Widget (a prueba de fallos con las opciones)
export default function ReadabilityWidget({ text, options }: WidgetProps<ReadabilityOptions>) {
  const score = computeSzigrisztPazos(text ?? "");
  
  const scale = options?.scale ?? "percent";
  const showTarget = options?.showTarget ?? true;
  const target = options?.target ?? 70;

  const maxScale = scale === "percent" ? 100 : 10;
  
  const normalizedScore = score !== null 
    ? (scale === "ten" ? (score / 10).toFixed(1) : score)
    : null;

  const widthPercentage = score !== null ? `${score}%` : "0%";
  const targetPercentage = scale === "percent" ? target : target * 10;

  return (
    <div>
      <div className="ta-big">
        {normalizedScore ?? "—"}
        <span className="ta-muted"> / {maxScale}</span>
      </div>
      
      {score !== null && (
        <p className="ta-muted" style={{ marginTop: "-0.5rem", marginBottom: "0.5rem" }}>
          {getDifficultyLabel(score)}
        </p>
      )}

      <div className="ta-bar" aria-hidden="true">
        <div 
          className="ta-bar-fill" 
          style={{ 
            width: widthPercentage,
            // Alerta visual si baja del nivel "Normal" (menor a 50)
            backgroundColor: score !== null && score < 50 ? "#ef4444" : undefined 
          }} 
        />
        {showTarget && (
          <div 
            className="ta-bar-target" 
            style={{ left: `${targetPercentage}%` }} 
          />
        )}
      </div>
      
      {showTarget && (
        <p className="ta-muted">Target: {target}{scale === "percent" ? "%" : ""}</p>
      )}
    </div>
  );
}